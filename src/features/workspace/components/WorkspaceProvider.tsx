import { useEffect, useRef } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { getWorkspaceMembers, listenToProjects } from "@/db";

type WorkspaceProviderProps = {
  children: React.ReactNode;
};

/**
 * Provides real-time data subscriptions for the active workspace.
 * 
 * Members: One-time fetch (changes infrequently)
 * Projects: Real-time listener (syncs create/update/delete across all clients)
 */
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

  const hasInitialProjectLoad = useRef(false);

  useEffect(() => {
    if (!activeWorkspace?.id) {
      resetMembers();
      resetProjects();
      hasInitialProjectLoad.current = false;
      return;
    }

    // Load members (one-time fetch - members change infrequently)
    const loadMembers = async () => {
      setMembersLoading(true);
      try {
        const members = await getWorkspaceMembers(activeWorkspace.id);
        setMembers(members);
      } catch (err) {
        console.error("Failed to load workspace members", err);
      } finally {
        setMembersLoading(false);
      }
    };

    loadMembers();

    // Subscribe to projects (real-time - syncs across all workspace members)
    if (!hasInitialProjectLoad.current) {
      setProjectsLoading(true);
    }

    const unsubscribeProjects = listenToProjects(
      activeWorkspace.id,
      (projects) => {
        setProjects(projects);
        if (!hasInitialProjectLoad.current) {
          setProjectsLoading(false);
          hasInitialProjectLoad.current = true;
        }
      },
      (error) => {
        console.error("Projects subscription error:", error);
        setProjectsLoading(false);
      }
    );

    return () => {
      unsubscribeProjects();
      hasInitialProjectLoad.current = false;
    };
  }, [activeWorkspace?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
