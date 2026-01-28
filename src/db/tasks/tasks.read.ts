import { db } from "@/lib/firebase";
import type { Task } from "@/shared/types/db";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

/**
 * Subscribe to real-time task updates for a specific project.
 * Uses onSnapshot to listen for any create/update/delete operations.
 *
 * This enables:
 * - Kanban board real-time sync
 * - Task list real-time updates
 * - Collaborative editing across workspace members
 *
 * Architecture note:
 * - Tasks are project-scoped, NOT fetched globally
 * - Listener should only be attached when a project is active
 * - Cleanup must happen on project change or unmount
 *
 * @param workspaceId - The workspace containing the project
 * @param projectId - The project to listen to
 * @param onData - Callback fired with updated tasks array
 * @param onError - Callback fired on subscription errors
 * @returns Unsubscribe function to clean up the listener
 */
export function listenToTasks(
  workspaceId: string,
  projectId: string,
  onData: (tasks: Task[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const tasksRef = collection(
    db,
    "workspaces",
    workspaceId,
    "projects",
    projectId,
    "tasks"
  );

  // Order by createdAt descending (newest first)
  // Can be changed to position field for manual ordering
  const q = query(tasksRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      onData(tasks);
    },
    (error) => {
      console.error("Tasks listener error:", error);
      onError?.(error);
    }
  );
}
