import { db } from "@/lib/firebase";
import type { IssuePriority, IssueStatus } from "@/shared/types/db";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Link attachment stored in Firestore
 */
export interface LinkAttachment {
  title: string;
  url: string;
}

/**
 * Payload for creating a new task
 */
export interface CreateTaskPayload {
  workspaceId: string;
  projectId: string;
  title: string;
  summary?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignees?: string[];
  startDate?: Date | null;
  targetDate?: Date | null;
  createdBy: string;
  attachments?: LinkAttachment[];
}

/**
 * Create a new task document in Firestore.
 * Real-time listeners will automatically pick up the new task.
 */
export async function createTask(data: CreateTaskPayload): Promise<{
  success: boolean;
  taskId?: string;
  error?: string;
}> {
  // Validate required fields
  if (!data.workspaceId?.trim()) {
    return { success: false, error: "Workspace ID is required" };
  }

  if (!data.projectId?.trim()) {
    return { success: false, error: "Project ID is required" };
  }

  if (!data.title?.trim()) {
    return { success: false, error: "Task title is required" };
  }

  if (!data.createdBy?.trim()) {
    return { success: false, error: "Creator ID is required" };
  }

  try {
    const taskData = {
      projectId: data.projectId,
      title: data.title.trim(),
      summary: data.summary?.trim() || "",
      description: data.description?.trim() || "",
      status: data.status || "backlog",
      priority: data.priority || "no-priority",
      assignees: data.assignees || [],
      startDate: data.startDate || null,
      targetDate: data.targetDate || null,
      createdBy: data.createdBy,
      attachments: data.attachments || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const tasksRef = collection(
      db,
      "workspaces",
      data.workspaceId,
      "projects",
      data.projectId,
      "tasks"
    );

    const docRef = await addDoc(tasksRef, taskData);

    return {
      success: true,
      taskId: docRef.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}
