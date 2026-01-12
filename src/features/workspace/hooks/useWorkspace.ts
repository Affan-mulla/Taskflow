import { useEffect, useState } from "react";
import { getUserWorkspacesIds } from "@/db";
import useAuth from "@/features/auth/hooks/useAuth";

export function useWorkspace() {
  const { user, loading: authLoading } = useAuth();
  const [workspace, setWorkspace] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchWorkspaces = async () => {
      if (authLoading) return;

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

        if (isMounted) {
          setWorkspace(ids);
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
