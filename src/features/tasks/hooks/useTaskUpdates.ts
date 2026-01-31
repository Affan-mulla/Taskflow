import { useState, useEffect, useCallback } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUserStore } from "@/shared/store/store.user";
import type { Update, UpdateStatus, UpdateLink } from "@/shared/types/db";
import { listenToTaskUpdates } from "@/db/updates/updates.read";
import { createUpdate } from "@/db/updates/updates.create";
import { deleteTaskUpdate } from "@/db/updates/updates.delete";

interface UseTaskUpdatesOptions {
  projectId: string;
  taskId: string;
}

/**
 * Hook that subscribes to real-time updates for a specific task.
 *
 * Architecture:
 * - Updates are task-scoped (nested under project)
 * - Listener attaches only when workspace, projectId, AND taskId are valid
 * - Listener auto-cleans on task change or unmount
 *
 * Real-time behavior:
 * - Any update created by any member appears immediately
 * - Updates sync in real-time without polling or refetching
 */
export function useTaskUpdates({ projectId, taskId }: UseTaskUpdatesOptions) {
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useUserStore();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    // Guard: require workspace, project, and task
    if (!activeWorkspace?.id || !projectId || !taskId) {
      setUpdates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenToTaskUpdates(
      activeWorkspace.id,
      projectId,
      taskId,
      (updatedUpdates) => {
        setUpdates(updatedUpdates);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup listener on task change or unmount
    return () => unsubscribe();
  }, [activeWorkspace?.id, projectId, taskId]);

  // Create a new update
  const addUpdate = useCallback(
    async (content: string, status: UpdateStatus, links: UpdateLink[] = []) => {
      if (!activeWorkspace?.id || !projectId || !taskId || !user?.id) {
        return { success: false, error: "Missing required data" };
      }

      return await createUpdate({
        workspaceId: activeWorkspace.id,
        projectId,
        taskId,
        content,
        status,
        links,
        createdBy: user.id,
      });
    },
    [activeWorkspace?.id, projectId, taskId, user?.id]
  );

  // Delete an update
  const removeUpdate = useCallback(
    async (updateId: string) => {
      if (!activeWorkspace?.id || !projectId || !taskId) {
        return { success: false, error: "Missing required data" };
      }

      return await deleteTaskUpdate(activeWorkspace.id, projectId, taskId, updateId);
    },
    [activeWorkspace?.id, projectId, taskId]
  );

  return {
    updates,
    loading,
    error,
    addUpdate,
    removeUpdate,
  };
}
