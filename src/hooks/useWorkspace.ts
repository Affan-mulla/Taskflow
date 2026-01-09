import { useEffect, useState } from "react";
import { checkUserWorkspaces } from "@/db";
import useAuth from "./useAuth";

export function useWorkspaceCheck() {
  const { user } = useAuth();
  const [workspaceIds, setWorkspaceIds] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchWorkspaces = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const ids = await checkUserWorkspaces(user.uid);
        
        if (isMounted) {
          setWorkspaceIds(ids.filter((id): id is string => id !== undefined));
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch workspaces'));
          setWorkspaceIds([]);
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
  }, [user]);

  return { workspaceIds, loading, error };
}
