import { useEffect, useState } from "react";
import { getUserWorkspacesIds, getWorkspacesByIds } from "@/db";
import useAuth from "@/features/auth/hooks/useAuth";

interface Workspace {
  id: string;
  workspaceName: string;
  workspaceUrl: string;
  createdAt: string;
  // add other fields as necessary
}

export function useWorkspace() {
  const { user, loading: authLoading } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchWorkspaces = async () => {
      // 1️⃣ Wait until auth finishes
      if (authLoading) return;

      // 2️⃣ Auth finished but no user
      if (!user) {
        if (isMounted) {
          setWorkspace([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const ids = (await getUserWorkspacesIds(user.uid)).filter(
          (id): id is string => id !== undefined
        );

        if (!isMounted) return;

        const allWorkspaces = await getWorkspacesByIds(ids);
        if (isMounted) {
          setWorkspace(allWorkspaces);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch workspaces")
          );
          setWorkspace([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWorkspaces();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  return {
    workspace,
    loading,
    error,
  };
}
