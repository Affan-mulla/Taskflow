import { useState, useEffect, useCallback } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import type { Issue, IssuePriority, IssueStatus } from "@/shared/types/db";
import { listenToIssues } from "@/db/issues/issues.read";
import {
  updateIssueStatus,
  updateIssuePriority,
  updateIssueAssignee,
} from "@/db/issues/issues.update";

interface UseIssuesOptions {
  projectId: string;
}

/**
 * Hook that subscribes to real-time issue updates for a specific project.
 * 
 * Real-time behavior:
 * - Any issue created by any member appears immediately
 * - Kanban drag-and-drop status changes sync across all clients
 * - Assignee, priority updates sync in real-time
 * 
 * Update pattern (optimistic UI):
 * 1. Update local state immediately for responsive UI
 * 2. Fire Firestore update (no await needed for UI)
 * 3. Listener automatically syncs state for all clients
 */
export function useIssues({ projectId }: UseIssuesOptions) {
  const { activeWorkspace } = useWorkspaceStore();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!activeWorkspace?.id || !projectId) {
      setIssues([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenToIssues(
      activeWorkspace.id,
      projectId,
      (updatedIssues) => {
        setIssues(updatedIssues);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeWorkspace?.id, projectId]);

  // Optimistic update helpers for Kanban board
  const updateStatus = useCallback(
    async (issueId: string, newStatus: IssueStatus) => {
      if (!activeWorkspace?.id) return;

      // Optimistic update
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );

      // Fire and forget - listener will sync
      updateIssueStatus(activeWorkspace.id, projectId, issueId, newStatus);
    },
    [activeWorkspace?.id, projectId]
  );

  const updatePriority = useCallback(
    async (issueId: string, newPriority: IssuePriority) => {
      if (!activeWorkspace?.id) return;

      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId ? { ...issue, priority: newPriority } : issue
        )
      );

      updateIssuePriority(activeWorkspace.id, projectId, issueId, newPriority);
    },
    [activeWorkspace?.id, projectId]
  );

  const updateAssignee = useCallback(
    async (issueId: string, newAssigneeId: string | null) => {
      if (!activeWorkspace?.id) return;

      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId
            ? { ...issue, assigneeId: newAssigneeId ?? undefined }
            : issue
        )
      );

      updateIssueAssignee(activeWorkspace.id, projectId, issueId, newAssigneeId);
    },
    [activeWorkspace?.id, projectId]
  );

  // Group issues by status for Kanban board
  const issuesByStatus = issues.reduce(
    (acc, issue) => {
      const status = issue.status || "backlog";
      if (!acc[status]) acc[status] = [];
      acc[status].push(issue);
      return acc;
    },
    {} as Record<IssueStatus, Issue[]>
  );

  return {
    issues,
    issuesByStatus,
    loading,
    error,
    updateStatus,
    updatePriority,
    updateAssignee,
  };
}
