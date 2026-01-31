import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import SettingRow from "../components/SettingRow";
import AvatarImg from "@/components/Common/AvatarImage";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pen } from "@hugeicons/core-free-icons";
import { useWorkspaceStore } from "@/shared/store/store.workspace";


const WorkspaceSettings = () => {
    const {activeWorkspace} = useWorkspaceStore()
  const [formData, setFormData] = useState({
    workspaceName: activeWorkspace?.workspaceName|| "",
    workspaceSlug: activeWorkspace?.workspaceUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving workspace settings:", formData);
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
                  src={formData.workspaceName}
                  fallbackText={formData.workspaceSlug.charAt(0)}
                />
              </div>

              <label
                htmlFor="avatar"
                className="absolute inset-0 grid place-items-center
              bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition"
              >
                <HugeiconsIcon icon={Pen} className="size-4 text-white" />
              </label>

              <input id="avatar" type="file" className="hidden" />
            </div>
          </SettingRow>
          <SettingRow
            title="Workspace name"
            description="The name shown to all members"
          >
            <Input
              name="workspaceName"
              placeholder="My workspace"
              value={formData.workspaceName}
              onChange={handleChange}
              className="max-w-md"
            />
          </SettingRow>

          <SettingRow
            title="Workspace slug"
            description="Used in workspace URLs"
          >
            <Input
              name="workspaceSlug"
              placeholder="my-workspace"
              value={formData.workspaceSlug}
              onChange={handleChange}
              className="max-w-md"
            />
          </SettingRow>

          <div className="flex justify-end pt-6">
            <Button onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">
            Danger zone
          </CardTitle>
          <CardDescription>
            Destructive and irreversible actions
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SettingRow
            title="Delete workspace"
            description="This will permanently delete the workspace and all data"
          >
            <Button variant="destructive">
              Delete workspace
            </Button>
          </SettingRow>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceSettings;
