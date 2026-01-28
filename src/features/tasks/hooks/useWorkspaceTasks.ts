import { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import type { Task } from "@/shared/types/db";
import { query, orderBy, onSnapshot, collectionGroup } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Hook that subscribes to real-time task updates for ALL projects in a workspace.
 * 
 * This is different from useTasks which is project-scoped.
 * Use this for workspace-level task views (all tasks across all projects).
 * 
 * Real-time behavior:
 * - Any task created/updated/deleted in any project appears immediately
 * - Syncs across all workspace members
 */
export function useWorkspaceTasks() {
  const { activeWorkspace } = useWorkspaceStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!activeWorkspace?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Use collectionGroup to query all tasks across all projects
    const tasksQuery = query(
      collectionGroup(db, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const allTasks = snapshot.docs
          .filter(doc => {
            // Ensure tasks belong to current workspace
            return doc.ref.path.startsWith(`workspaces/${activeWorkspace.id}/projects/`);
          })
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Task[];
        
        setTasks(allTasks);
        setLoading(false);
      },
      (err) => {
        console.error("Workspace tasks listener error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeWorkspace?.id]);

  return { tasks, loading, error };
}
