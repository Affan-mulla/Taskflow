import { useEffect } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { getWorkspaceMembers } from "@/db";

type WorkspaceProviderProps = {
  children: React.ReactNode;
};

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const {
    activeWorkspace,
    setMembers,
    setMembersLoading,
    resetMembers,
  } = useWorkspaceStore();

  useEffect(() => {
    if (!activeWorkspace?.id) return;

    let cancelled = false;

    const loadMembers = async () => {
      try {
        setMembersLoading(true);

        const members = await getWorkspaceMembers(activeWorkspace.id);

        if (!cancelled) {
          setMembers(members);
        }
      } catch (err) {
        console.error("Failed to load workspace members", err);
      } finally {
        if (!cancelled) {
          setMembersLoading(false);
        }
      }
    };

    loadMembers();

    return () => {
      cancelled = true;
      resetMembers(); // prevents leakage when switching workspaces
    };
  }, [activeWorkspace?.id]);

  return <>{children}</>;
}
