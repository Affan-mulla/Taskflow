import { useState } from "react";
import { toast } from "sonner";
import { createProject } from "@/db/projects/projects.create";
import type { AddProjectPayload } from "../validation/addProject";

export const useCreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async (payload: AddProjectPayload) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createProject(payload);

      if (result.success) {
        toast.success("Project created successfully!", {
          description: `"${payload.name}" has been added to your workspace.`,
          closeButton: true,
        });
        return { success: true, projectId: result.projectId };
      } else {
        const errorMsg = result.error || "Failed to create project";
        setError(errorMsg);
        toast.error("Failed to create project", {
          description: errorMsg,
          closeButton: true,
        });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      toast.error("Failed to create project", {
        description: errorMsg,
        closeButton: true,
      });
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createProject: handleCreateProject,
  };
};
