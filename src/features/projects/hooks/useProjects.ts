import { useEffect, useRef } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { listenToProjects } from "@/db/projects/projects.read";

/**
 * Hook that subscribes to real-time project updates for the active workspace.
 * Automatically syncs Firestore changes to Zustand store.
 * 
 * Real-time behavior:
 * - Any project created by any member appears immediately
 * - Any project update (status, priority, lead, etc.) syncs across all clients
 * - Any project deletion removes it from all clients
 * 
 * The listener is cleaned up when:
 * - Component unmounts
 * - Active workspace changes
 */
export function useProjects() {
  const {
    activeWorkspace,
    projects,
    projectsLoading,
    setProjects,
    setProjectsLoading,
  } = useWorkspaceStore();

  // Track if initial load has completed to avoid flash of loading state
  const hasInitialLoad = useRef(false);

  useEffect(() => {
    if (!activeWorkspace?.id) {
      setProjects([]);
      setProjectsLoading(false);
      hasInitialLoad.current = false;
      return;
    }

    // Only show loading on first subscription
    if (!hasInitialLoad.current) {
      setProjectsLoading(true);
    }

    const unsubscribe = listenToProjects(
      activeWorkspace.id,
      (updatedProjects) => {
        setProjects(updatedProjects);
        if (!hasInitialLoad.current) {
          setProjectsLoading(false);
          hasInitialLoad.current = true;
        }
      },
      (error) => {
        console.error("Failed to subscribe to projects:", error);
        setProjectsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [activeWorkspace?.id, setProjects, setProjectsLoading]);

  return {
    projects,
    loading: projectsLoading,
  };
}
