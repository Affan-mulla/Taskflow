import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

/**
 * Delete an update from a project.
 *
 * Path: workspaces/{workspaceId}/projects/{projectId}/updates/{updateId}
 *
 * @param workspaceId - The workspace ID
 * @param projectId - The project ID
 * @param updateId - The update ID to delete
 * @returns Promise with success status
 */
export async function deleteProjectUpdate(
  workspaceId: string,
  projectId: string,
  updateId: string
): Promise<{ success: boolean; error?: string }> {
  if (!workspaceId || !projectId || !updateId) {
    return { success: false, error: "Missing required IDs" };
  }

  try {
    const updateRef = doc(
      db,
      "workspaces",
      workspaceId,
      "projects",
      projectId,
      "updates",
      updateId
    );

    await deleteDoc(updateRef);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project update:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete update",
    };
  }
}

/**
 * Delete an update from a task.
 *
 * Path: workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/updates/{updateId}
 *
 * @param workspaceId - The workspace ID
 * @param projectId - The project ID
 * @param taskId - The task ID
 * @param updateId - The update ID to delete
 * @returns Promise with success status
 */
export async function deleteTaskUpdate(
  workspaceId: string,
  projectId: string,
  taskId: string,
  updateId: string
): Promise<{ success: boolean; error?: string }> {
  if (!workspaceId || !projectId || !taskId || !updateId) {
    return { success: false, error: "Missing required IDs" };
  }

  try {
    const updateRef = doc(
      db,
      "workspaces",
      workspaceId,
      "projects",
      projectId,
      "tasks",
      taskId,
      "updates",
      updateId
    );

    await deleteDoc(updateRef);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task update:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete update",
    };
  }
}
