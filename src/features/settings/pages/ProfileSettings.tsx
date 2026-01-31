import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/shared/store/store.user";
import { useRef, useState } from "react";
import AvatarImg from "@/components/Common/AvatarImage";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pen } from "@hugeicons/core-free-icons";
import SettingRow from "../components/SettingRow";
import EmailChangeButton from "../components/EmailChangeButton";
import { uploadAvatar } from "@/lib/storage";
import { updateUserName, updateUserAvatar } from "@/db/users/users.update";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProfileSettings = () => {
  const { user, setUser } = useUserStore();
  const { activeWorkspace, setWorkspaces, workspaces, setActiveWorkspace } = useWorkspaceStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isLeavingWorkspace, setIsLeavingWorkspace] = useState(false);
  
  // Track original name to detect changes
  const originalNameRef = useRef(user?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar file selection - immediate upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingAvatar(true);

    try {
      // Upload to Firebase Storage
      const uploadResult = await uploadAvatar(file);
      
      if (!uploadResult.success || !uploadResult.url) {
        toast.error(uploadResult.error || "Failed to upload avatar");
        return;
      }

      // Update Firestore
      const updateResult = await updateUserAvatar(uploadResult.url);
      
      if (!updateResult.success) {
        toast.error(updateResult.error || "Failed to save avatar");
        return;
      }

      // Update local state and store
      setFormData((prev) => ({ ...prev, avatar: uploadResult.url! }));
      setUser({ ...user, avatar: uploadResult.url });
      
      toast.success("Profile picture updated");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle name blur - save on blur if changed
  const handleNameBlur = async () => {
    const trimmedName = formData.name.trim();
    
    // Don't save if unchanged or empty
    if (trimmedName === originalNameRef.current || !trimmedName || !user) {
      // Reset to original if empty
      if (!trimmedName) {
        setFormData((prev) => ({ ...prev, name: originalNameRef.current }));
      }
      return;
    }

    setIsSavingName(true);
    const previousName = originalNameRef.current;

    try {
      // Optimistic update
      originalNameRef.current = trimmedName;
      setUser({ ...user, name: trimmedName });

      const result = await updateUserName(trimmedName);
      
      if (!result.success) {
        // Rollback on failure
        originalNameRef.current = previousName;
        setFormData((prev) => ({ ...prev, name: previousName }));
        setUser({ ...user, name: previousName });
        toast.error(result.error || "Failed to update name");
        return;
      }

      toast.success("Name updated");
    } catch (error) {
      // Rollback on error
      originalNameRef.current = previousName;
      setFormData((prev) => ({ ...prev, name: previousName }));
      setUser({ ...user, name: previousName });
      toast.error("Failed to update name");
    } finally {
      setIsSavingName(false);
    }
  };

  // Handle leave workspace
  const handleLeaveWorkspace = async () => {
    if (!user || !activeWorkspace) return;

    setIsLeavingWorkspace(true);

    try {
      // Remove user from workspace members
      await deleteDoc(
        doc(db, "workspaces", activeWorkspace.id, "members", user.id)
      );

      // Update local store - remove workspace from list
      const updatedWorkspaces = workspaces.filter(
        (w) => w.id !== activeWorkspace.id
      );
      setWorkspaces(updatedWorkspaces);

      toast.success(`Left ${activeWorkspace.workspaceName}`);

      // Navigate to another workspace or onboarding
      if (updatedWorkspaces.length > 0) {
        setActiveWorkspace(updatedWorkspaces[0]);
        navigate(`/${updatedWorkspaces[0].workspaceUrl}`);
      } else {
        setActiveWorkspace(null);
        navigate("/onboarding/workspace");
      }
    } catch (error) {
      console.error("Error leaving workspace:", error);
      toast.error("Failed to leave workspace");
    } finally {
      setIsLeavingWorkspace(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto w-full my-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information
        </p>
      </div>

      <Card className="rounded-md">
        <CardContent className="divide-y divide-border space-y-2">
          <SettingRow
            title="Profile picture"
            description="This will be shown across the workspace"
          >
            <div className="relative group">
              <div className="size-10">
                {isUploadingAvatar ? (
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                    <Spinner className="size-5" />
                  </div>
                ) : (
                  <AvatarImg
                    src={formData.avatar}
                    fallbackText={formData.name.charAt(0)}
                  />
                )}
              </div>

              {!isUploadingAvatar && (
                <label
                  htmlFor="avatar"
                  className="absolute inset-0 grid place-items-center rounded-full
                    bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition"
                >
                  <HugeiconsIcon icon={Pen} className="size-4 text-white" />
                </label>
              )}

              <input 
                ref={fileInputRef}
                id="avatar" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
            </div>
          </SettingRow>

          {/* Email */}
          <SettingRow title="Email" description="Your login email address">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formData.email}</span>
              <EmailChangeButton />
            </div>
          </SettingRow>

          {/* Full name */}
          <SettingRow title="Full name">
            <div className="relative">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleNameBlur}
                className="max-w-xs pr-8"
                disabled={isSavingName}
              />
              {isSavingName && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Spinner className="size-4" />
                </div>
              )}
            </div>
          </SettingRow>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold">Workspace Access</h2>
      </div>

      <Card className="rounded-md">
        <CardContent className="flex items-center justify-between gap-4">
          <CardTitle>Remove yourself from the workspace</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive" disabled={isLeavingWorkspace}>
                {isLeavingWorkspace ? (
                  <>
                    <Spinner className="size-4 mr-2" />
                    Leaving...
                  </>
                ) : (
                  "Leave workspace"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave{" "}
                  <span className="font-medium text-foreground">
                    {activeWorkspace?.workspaceName}
                  </span>
                  ? You will lose access to all projects and tasks in this
                  workspace. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLeaveWorkspace}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Leave workspace
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
