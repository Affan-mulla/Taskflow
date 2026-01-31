import { useState, useEffect, useCallback } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUserStore } from "@/shared/store/store.user";
import type { Update, UpdateStatus, UpdateLink } from "@/shared/types/db";
import { listenToProjectUpdates } from "@/db/updates/updates.read";
import { createUpdate } from "@/db/updates/updates.create";
import { deleteProjectUpdate } from "@/db/updates/updates.delete";

interface UseProjectUpdatesOptions {
  projectId: string;
}

/**
 * Hook that subscribes to real-time updates for a specific project.
 *
 * Architecture:
 * - Updates are project-scoped
 * - Listener attaches only when workspace AND projectId are valid
 * - Listener auto-cleans on project change or unmount
 *
 * Real-time behavior:
 * - Any update created by any member appears immediately
 * - Updates sync in real-time without polling or refetching
 */
export function useProjectUpdates({ projectId }: UseProjectUpdatesOptions) {
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useUserStore();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    // Guard: require both workspace and project
    if (!activeWorkspace?.id || !projectId) {
      setUpdates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenToProjectUpdates(
      activeWorkspace.id,
      projectId,
      (updatedUpdates) => {
        setUpdates(updatedUpdates);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup listener on project change or unmount
    return () => unsubscribe();
  }, [activeWorkspace?.id, projectId]);

  // Create a new update
  const addUpdate = useCallback(
    async (content: string, status: UpdateStatus, links: UpdateLink[] = []) => {
      if (!activeWorkspace?.id || !projectId || !user?.id) {
        return { success: false, error: "Missing required data" };
      }

      return await createUpdate({
        workspaceId: activeWorkspace.id,
        projectId,
        content,
        status,
        links,
        createdBy: user.id,
      });
    },
    [activeWorkspace?.id, projectId, user?.id]
  );

  // Delete an update
  const removeUpdate = useCallback(
    async (updateId: string) => {
      if (!activeWorkspace?.id || !projectId) {
        return { success: false, error: "Missing required data" };
      }

      return await deleteProjectUpdate(activeWorkspace.id, projectId, updateId);
    },
    [activeWorkspace?.id, projectId]
  );

  return {
    updates,
    loading,
    error,
    addUpdate,
    removeUpdate,
  };
}
