import { db } from "@/lib/firebase";
import type { Project } from "@/shared/types/db";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

/**
 * Subscribe to real-time project updates for a workspace.
 * Uses onSnapshot to listen for any create/update/delete operations.
 * 
 * @param workspaceId - The workspace to listen to
 * @param onData - Callback fired with updated projects array
 * @param onError - Callback fired on subscription errors
 * @returns Unsubscribe function to clean up the listener
 */
export function listenToProjects(
  workspaceId: string,
  onData: (projects: Project[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const projectsRef = collection(db, "workspaces", workspaceId, "projects");
  const q = query(projectsRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      onData(projects);
    },
    (error) => {
      console.error("Projects listener error:", error);
      onError?.(error);
    }
  );
}
