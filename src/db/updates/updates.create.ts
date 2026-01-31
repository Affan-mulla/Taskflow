import { db } from "@/lib/firebase";
import type { UpdateStatus, UpdateLink } from "@/shared/types/db";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Payload for creating a new update
 */
export interface CreateUpdatePayload {
  workspaceId: string;
  projectId: string;
  taskId?: string; // Optional - if present, update belongs to a task
  content: string;
  status: UpdateStatus;
  links?: UpdateLink[];
  createdBy: string;
}

/**
 * Create a new update document in Firestore.
 * 
 * Updates can belong to:
 * - Projects: workspaces/{workspaceId}/projects/{projectId}/updates/{updateId}
 * - Tasks: workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/updates/{updateId}
 * 
 * Real-time listeners will automatically pick up the new update.
 */
export async function createUpdate(data: CreateUpdatePayload): Promise<{
  success: boolean;
  updateId?: string;
  error?: string;
}> {
  // Validate required fields
  if (!data.workspaceId?.trim()) {
    return { success: false, error: "Workspace ID is required" };
  }

  if (!data.projectId?.trim()) {
    return { success: false, error: "Project ID is required" };
  }

  if (!data.content?.trim()) {
    return { success: false, error: "Update content is required" };
  }

  if (!data.createdBy?.trim()) {
    return { success: false, error: "Creator ID is required" };
  }

  try {
    const updateData = {
      content: data.content.trim(),
      status: data.status || "on-track",
      links: data.links || [],
      createdBy: data.createdBy,
      createdAt: serverTimestamp(),
    };

    // Determine the collection path based on whether this is a task update or project update
    let updatesRef;
    if (data.taskId) {
      // Task update path
      updatesRef = collection(
        db,
        "workspaces",
        data.workspaceId,
        "projects",
        data.projectId,
        "tasks",
        data.taskId,
        "updates"
      );
    } else {
      // Project update path
      updatesRef = collection(
        db,
        "workspaces",
        data.workspaceId,
        "projects",
        data.projectId,
        "updates"
      );
    }

    const docRef = await addDoc(updatesRef, updateData);

    return {
      success: true,
      updateId: docRef.id,
    };
  } catch (error) {
    console.error("Failed to create update:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create update",
    };
  }
}
