import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import SettingRow from "../components/SettingRow";
import AvatarImg from "@/components/Common/AvatarImage";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pen } from "@hugeicons/core-free-icons";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { updateWorkspaceName, updateWorkspaceUrl, deleteWorkspace } from "@/db/workspace/workspace.update";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
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

const WorkspaceSettings = () => {
  const { activeWorkspace, setActiveWorkspace, workspaces, setWorkspaces } = useWorkspaceStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    workspaceName: activeWorkspace?.workspaceName || "",
    workspaceSlug: activeWorkspace?.workspaceUrl || "",
  });

  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingSlug, setIsSavingSlug] = useState(false);
  const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false);

  // Track original values to detect changes
  const originalNameRef = useRef(activeWorkspace?.workspaceName || "");
  const originalSlugRef = useRef(activeWorkspace?.workspaceUrl || "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle workspace name blur - save on blur if changed
  const handleNameBlur = async () => {
    const trimmedName = formData.workspaceName.trim();

    // Don't save if unchanged or empty
    if (trimmedName === originalNameRef.current || !trimmedName || !activeWorkspace) {
      // Reset to original if empty
      if (!trimmedName) {
        setFormData((prev) => ({ ...prev, workspaceName: originalNameRef.current }));
      }
      return;
    }

    setIsSavingName(true);
    const previousName = originalNameRef.current;

    try {
      // Optimistic update
      originalNameRef.current = trimmedName;
      setActiveWorkspace({ ...activeWorkspace, workspaceName: trimmedName });

      const result = await updateWorkspaceName(activeWorkspace.id, trimmedName);

      if (!result.success) {
        // Rollback on failure
        originalNameRef.current = previousName;
        setFormData((prev) => ({ ...prev, workspaceName: previousName }));
        setActiveWorkspace({ ...activeWorkspace, workspaceName: previousName });
        toast.error(result.error || "Failed to update workspace name");
        return;
      }

      // Update in workspaces list
      setWorkspaces(
        workspaces.map((w) =>
          w.id === activeWorkspace.id ? { ...w, workspaceName: trimmedName } : w
        )
      );

      toast.success("Workspace name updated");
    } catch (error) {
      // Rollback on error
      originalNameRef.current = previousName;
      setFormData((prev) => ({ ...prev, workspaceName: previousName }));
      setActiveWorkspace({ ...activeWorkspace, workspaceName: previousName });
      toast.error("Failed to update workspace name");
    } finally {
      setIsSavingName(false);
    }
  };

  // Handle workspace slug blur - save on blur if changed
  const handleSlugBlur = async () => {
    const trimmedSlug = formData.workspaceSlug.trim().toLowerCase().replace(/\s+/g, "-");

    // Don't save if unchanged or empty
    if (trimmedSlug === originalSlugRef.current || !trimmedSlug || !activeWorkspace) {
      // Reset to original if empty
      if (!trimmedSlug) {
        setFormData((prev) => ({ ...prev, workspaceSlug: originalSlugRef.current }));
      }
      return;
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(trimmedSlug)) {
      toast.error("Workspace slug can only contain lowercase letters, numbers, and hyphens");
      setFormData((prev) => ({ ...prev, workspaceSlug: originalSlugRef.current }));
      return;
    }

    setIsSavingSlug(true);
    const previousSlug = originalSlugRef.current;

    try {
      // Optimistic update
      originalSlugRef.current = trimmedSlug;
      setActiveWorkspace({ ...activeWorkspace, workspaceUrl: trimmedSlug });

      const result = await updateWorkspaceUrl(activeWorkspace.id, trimmedSlug);

      if (!result.success) {
        // Rollback on failure
        originalSlugRef.current = previousSlug;
        setFormData((prev) => ({ ...prev, workspaceSlug: previousSlug }));
        setActiveWorkspace({ ...activeWorkspace, workspaceUrl: previousSlug });
        toast.error(result.error || "Failed to update workspace URL");
        return;
      }

      // Update in workspaces list
      setWorkspaces(
        workspaces.map((w) =>
          w.id === activeWorkspace.id ? { ...w, workspaceUrl: trimmedSlug } : w
        )
      );

      // Update URL in browser
      navigate(`/${trimmedSlug}/settings/workspace`, { replace: true });

      toast.success("Workspace URL updated");
    } catch (error) {
      // Rollback on error
      originalSlugRef.current = previousSlug;
      setFormData((prev) => ({ ...prev, workspaceSlug: previousSlug }));
      setActiveWorkspace({ ...activeWorkspace, workspaceUrl: previousSlug });
      toast.error("Failed to update workspace URL");
    } finally {
      setIsSavingSlug(false);
    }
  };

  // Handle delete workspace
  const handleDeleteWorkspace = async () => {
    if (!activeWorkspace) return;

    setIsDeletingWorkspace(true);

    try {
      const result = await deleteWorkspace(activeWorkspace.id);

      if (!result.success) {
        toast.error(result.error || "Failed to delete workspace");
        return;
      }

      // Remove from local store
      const updatedWorkspaces = workspaces.filter((w) => w.id !== activeWorkspace.id);
      setWorkspaces(updatedWorkspaces);

      toast.success(`${activeWorkspace.workspaceName} has been deleted`);

      // Navigate to another workspace or onboarding
      if (updatedWorkspaces.length > 0) {
        setActiveWorkspace(updatedWorkspaces[0]);
        navigate(`/${updatedWorkspaces[0].workspaceUrl}`);
      } else {
        setActiveWorkspace(null);
        navigate("/onboarding/workspace");
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("Failed to delete workspace");
    } finally {
      setIsDeletingWorkspace(false);
    }
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto w-full my-8">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Workspace settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your workspace details and preferences
        </p>
      </div>

      {/* Workspace info */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>
            Basic information about your workspace
          </CardDescription>
        </CardHeader>

        <CardContent className="divide-y">
          <SettingRow
            title="Profile picture"
            description="This will be shown across the workspace"
          >
            <div className="relative group">
              <div className="size-10">
                <AvatarImg
                  src=""
                  fallbackText={formData.workspaceSlug.charAt(0).toUpperCase()}
                />
              </div>

              <label
                htmlFor="avatar"
                className="absolute inset-0 grid place-items-center rounded-full
                  bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition"
              >
                <HugeiconsIcon icon={Pen} className="size-4 text-white" />
              </label>

              <input id="avatar" type="file" className="hidden" accept="image/*" disabled />
            </div>
          </SettingRow>

          <SettingRow
            title="Workspace name"
            description="The name shown to all members"
          >
            <div className="relative">
              <Input
                name="workspaceName"
                placeholder="My workspace"
                value={formData.workspaceName}
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

          <SettingRow
            title="Workspace slug"
            description="Used in workspace URLs"
          >
            <div className="relative">
              <Input
                name="workspaceSlug"
                placeholder="my-workspace"
                value={formData.workspaceSlug}
                onChange={handleChange}
                onBlur={handleSlugBlur}
                className="max-w-xs pr-8"
                disabled={isSavingSlug}
              />
              {isSavingSlug && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Spinner className="size-4" />
                </div>
              )}
            </div>
          </SettingRow>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Destructive and irreversible actions
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SettingRow
            title="Delete workspace"
            description="This will permanently delete the workspace and all data"
          >
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive" disabled={isDeletingWorkspace}>
                  {isDeletingWorkspace ? (
                    <>
                      <Spinner className="size-4 mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete workspace"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to permanently delete{" "}
                    <span className="font-medium text-foreground">
                      {activeWorkspace?.workspaceName}
                    </span>
                    ? This will delete all projects, tasks, and data associated
                    with this workspace. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteWorkspace}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete workspace
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingRow>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceSettings;
