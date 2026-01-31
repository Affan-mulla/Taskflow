import { db } from "@/lib/firebase";
import type { Update } from "@/shared/types/db";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

/**
 * Subscribe to real-time update notifications for a specific project.
 * Uses onSnapshot to listen for any create/delete operations.
 *
 * Path: workspaces/{workspaceId}/projects/{projectId}/updates
 *
 * This enables:
 * - Real-time update feed for projects
 * - Collaborative visibility across workspace members
 *
 * @param workspaceId - The workspace containing the project
 * @param projectId - The project to listen to
 * @param onData - Callback fired with updated updates array
 * @param onError - Callback fired on subscription errors
 * @returns Unsubscribe function to clean up the listener
 */
export function listenToProjectUpdates(
  workspaceId: string,
  projectId: string,
  onData: (updates: Update[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const updatesRef = collection(
    db,
    "workspaces",
    workspaceId,
    "projects",
    projectId,
    "updates"
  );

  // Order by createdAt descending (newest first)
  const q = query(updatesRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const updates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Update[];
      onData(updates);
    },
    (error) => {
      console.error("Project updates listener error:", error);
      onError?.(error);
    }
  );
}

/**
 * Subscribe to real-time update notifications for a specific task.
 * Uses onSnapshot to listen for any create/delete operations.
 *
 * Path: workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/updates
 *
 * This enables:
 * - Real-time update feed for tasks
 * - Collaborative visibility across workspace members
 *
 * @param workspaceId - The workspace containing the project
 * @param projectId - The project containing the task
 * @param taskId - The task to listen to
 * @param onData - Callback fired with updated updates array
 * @param onError - Callback fired on subscription errors
 * @returns Unsubscribe function to clean up the listener
 */
export function listenToTaskUpdates(
  workspaceId: string,
  projectId: string,
  taskId: string,
  onData: (updates: Update[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const updatesRef = collection(
    db,
    "workspaces",
    workspaceId,
    "projects",
    projectId,
    "tasks",
    taskId,
    "updates"
  );

  // Order by createdAt descending (newest first)
  const q = query(updatesRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const updates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Update[];
      onData(updates);
    },
    (error) => {
      console.error("Task updates listener error:", error);
      onError?.(error);
    }
  );
}
