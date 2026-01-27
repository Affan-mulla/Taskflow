import { useState } from "react";
import { toast } from "sonner";
import { addProjectResource, removeProjectResource } from "@/db";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUserStore } from "@/shared/store/store.user";
import type { ProjectResource } from "@/shared/types/db";

export const useProjectResources = () => {
  const [loading, setLoading] = useState(false);
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useUserStore();

  const getWorkspaceId = () => {
    if (!activeWorkspace?.id) {
      throw new Error("No active workspace selected");
    }
    return activeWorkspace.id;
  };

  const addResource = async (
    projectId: string,
    title: string,
    url: string
  ): Promise<boolean> => {
    if (!user?.id) {
      toast.error("You must be logged in to add resources");
      return false;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL");
      return false;
    }

    setLoading(true);
    try {
      const resource: ProjectResource = {
        id: crypto.randomUUID(),
        title: title.trim(),
        url: url.trim(),
        addedBy: user.id,
        addedAt: new Date().toISOString(),
      };

      await addProjectResource(getWorkspaceId(), projectId, resource);
      toast.success("Resource added");
      return true;
    } catch (error) {
      console.error("Failed to add resource:", error);
      toast.error("Failed to add resource");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeResource = async (
    projectId: string,
    resource: ProjectResource
  ): Promise<boolean> => {
    setLoading(true);
    try {
      await removeProjectResource(getWorkspaceId(), projectId, resource);
      toast.success("Resource removed");
      return true;
    } catch (error) {
      console.error("Failed to remove resource:", error);
      toast.error("Failed to remove resource");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addResource,
    removeResource,
  };
};
