import { getUserWorkspacesIds, getWorkspacesByIds } from "@/db";
import { useUserStore } from "@/shared/store/store.user";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useEffect } from "react";

/**
 * Fetches the user's workspaces and stores them in Zustand.
 *
 * IMPORTANT: This hook ONLY fetches the workspace list.
 * Active workspace resolution is handled by useWorkspaceResolver
 * based on the URL (single source of truth).
 *
 * This separation ensures:
 * - URL drives workspace context
 * - No race conditions between URL and state
 * - Clean workspace switching via navigation
 */
export const useWorkspacesFetcher = () => {
  const { user } = useUserStore();
  const { setWorkspaces, workspaces } = useWorkspaceStore();

  useEffect(() => {
    if (!user) return;

    // Skip if already loaded (prevents unnecessary refetches)
    if (workspaces.length > 0) return;

    const fetchWorkspaces = async () => {
      const ids = await getUserWorkspacesIds(user.id);

      if (ids && ids.length > 0) {
        const fetchedWorkspaces = await getWorkspacesByIds(ids as string[]);
        setWorkspaces(fetchedWorkspaces);
      }
    };

    fetchWorkspaces();
  }, [user, workspaces.length, setWorkspaces]);
};

/**
 * @deprecated Use useWorkspacesFetcher instead.
 * This is kept for backwards compatibility during migration.
 */
export const useWorkspaceResolve = useWorkspacesFetcher;
