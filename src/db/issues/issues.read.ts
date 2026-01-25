import { db } from "@/lib/firebase";
import type { Issue } from "@/shared/types/db";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

/**
 * Subscribe to real-time issue updates for a project.
 * Uses onSnapshot to listen for any create/update/delete operations.
 * 
 * This enables Kanban board real-time sync:
 * - Dragging an issue to a new column updates status in Firestore
 * - All other workspace members see the change immediately
 * - No polling or refetching required
 * 
 * @param workspaceId - The workspace containing the project
 * @param projectId - The project to listen to
 * @param onData - Callback fired with updated issues array
 * @param onError - Callback fired on subscription errors
 * @returns Unsubscribe function to clean up the listener
 */
export function listenToIssues(
  workspaceId: string,
  projectId: string,
  onData: (issues: Issue[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const issuesRef = collection(
    db,
    "workspaces",
    workspaceId,
    "projects",
    projectId,
    "issues"
  );
  const q = query(issuesRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const issues = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Issue[];
      onData(issues);
    },
    (error) => {
      console.error("Issues listener error:", error);
      onError?.(error);
    }
  );
}
