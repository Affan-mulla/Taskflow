import { useState } from "react";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { createIssue, type CreateIssuePayload } from "@/db/issues/issues.create";
import type { IssuePriority, IssueStatus } from "@/shared/types/db";

export interface CreateIssueInput {
  projectId: string;
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
}

/**
 * Hook for creating new issues.
 * Real-time listener will automatically pick up the new issue.
 */
export function useCreateIssue() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { activeWorkspace } = useWorkspaceStore();

  const handleCreateIssue = async (input: CreateIssueInput, createdBy: string) => {
    if (!activeWorkspace?.id) {
      const errorMsg = "No active workspace selected";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateIssuePayload = {
        workspaceId: activeWorkspace.id,
        projectId: input.projectId,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        assigneeId: input.assigneeId,
        createdBy,
      };

      const result = await createIssue(payload);

      if (result.success) {
        toast.success("Issue created", {
          description: `"${input.title}" has been added.`,
        });
        return { success: true, issueId: result.issueId };
      } else {
        setError(result.error || "Failed to create issue");
        toast.error("Failed to create issue");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      toast.error("Failed to create issue");
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createIssue: handleCreateIssue,
  };
}
