import { createWorkspace } from "@/db";
import type { workspaceSchemaType } from "@/validation/createWorkspace";
import { useState } from "react";

export const useCreateWorkspace = () => {
  const [loading, setLoading] = useState(false);

  const createWorkspaceHandler = async (data: workspaceSchemaType) => {
    try {
      setLoading(true);
      const workspaceId = await createWorkspace(data);
      if (!workspaceId) {
        return {
          error: "Failed to create workspace",
          success: false,
        };
      }

      if (!workspaceId.success) {
        return {
          error: workspaceId.error,
          success: false,
        };
      }

      return workspaceId;
    } catch (error) {
      console.error("Error creating workspace: ", error);
    } finally {
      setLoading(false);
    }
  };

  return { createWorkspaceHandler, loading };
};
