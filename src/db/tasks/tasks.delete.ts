import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

/**
 * Delete a task from Firestore.
 * Real-time listeners will automatically remove the task from all clients.
 *
 * @param workspaceId - The workspace containing the project
 * @param projectId - The project containing the task
 * @param taskId - The task to delete
 */
export async function deleteTask(
  workspaceId: string,
  projectId: string,
  taskId: string
): Promise<void> {
  const taskRef = doc(
    db,
    "workspaces",
    workspaceId,
    "projects",
    projectId,
    "tasks",
    taskId
  );
  await deleteDoc(taskRef);
}
