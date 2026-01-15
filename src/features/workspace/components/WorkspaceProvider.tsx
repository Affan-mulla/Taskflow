import { useEffect } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { getWorkspaceMembers, getWorkspaceProjects } from "@/db";

type WorkspaceProviderProps = {
  children: React.ReactNode;
};

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const {
    activeWorkspace,
    setMembers,
    setMembersLoading,
    resetMembers,
    setProjects,
    setProjectsLoading,
    resetProjects,
  } = useWorkspaceStore();

  useEffect(() => {
    if (!activeWorkspace?.id) return;

    let cancelled = false;

    const loadWorkspaceData = async () => {
      try {
        // Load members and projects in parallel
        setMembersLoading(true);
        setProjectsLoading(true);

        const [members, projects] = await Promise.all([
          getWorkspaceMembers(activeWorkspace.id),
          getWorkspaceProjects(activeWorkspace.id),
        ]);

        if (!cancelled) {
          setMembers(members);
          setProjects(projects);
        }
      } catch (err) {
        console.error("Failed to load workspace data", err);
      } finally {
        if (!cancelled) {
          setMembersLoading(false);
          setProjectsLoading(false);
        }
      }
    };

    loadWorkspaceData();

    return () => {
      cancelled = true;
      // Cleanup to prevent leakage when switching workspaces
      resetMembers();
      resetProjects();
    };
  }, [activeWorkspace?.id]);

  return <>{children}</>;
}
