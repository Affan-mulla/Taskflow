import { db } from "@/lib/firebase";
import type { IssuePriority, IssueStatus, TaskAttachment } from "@/shared/types/db";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * Get reference to a task document
 */
function getTaskRef(workspaceId: string, projectId: string, taskId: string) {
  return doc(db, "workspaces", workspaceId, "projects", projectId, "tasks", taskId);
}

/**
 * Update task status (used for Kanban drag-and-drop)
 */
export async function updateTaskStatus(
  workspaceId: string,
  projectId: string,
  taskId: string,
  newStatus: IssueStatus
): Promise<void> {
  const taskRef = getTaskRef(workspaceId, projectId, taskId);
  await updateDoc(taskRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update task priority
 */
export async function updateTaskPriority(
  workspaceId: string,
  projectId: string,
  taskId: string,
  newPriority: IssuePriority
): Promise<void> {
  const taskRef = getTaskRef(workspaceId, projectId, taskId);
  await updateDoc(taskRef, {
    priority: newPriority,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update task assignees
 */
export async function updateTaskAssignees(
  workspaceId: string,
  projectId: string,
  taskId: string,
  assignees: string[]
): Promise<void> {
  const taskRef = getTaskRef(workspaceId, projectId, taskId);
  await updateDoc(taskRef, {
    assignees,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update task title
 */
export async function updateTaskTitle(
  workspaceId: string,
  projectId: string,
  taskId: string,
  title: string
): Promise<void> {
  const taskRef = getTaskRef(workspaceId, projectId, taskId);
  await updateDoc(taskRef, {
    title: title.trim(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update task description
 */
export async function updateTaskDescription(
  workspaceId: string,
  projectId: string,
  taskId: string,
  description: string
): Promise<void> {
  const taskRef = getTaskRef(workspaceId, projectId, taskId);
  await updateDoc(taskRef, {
    description: description.trim(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update task summary
 */
export async function updateTaskSummary(
  workspaceId: string,
  projectId: string,
  taskId: string,
  summary: string
): Promise<void> {
  const taskRef = getTaskRef(workspaceId, projectId, taskId);
  await updateDoc(taskRef, {
    summary: summary.trim(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update task dates (start and/or target)
 */
export async function updateTaskDates(
  workspaceId: string,
  projectId: string,
  taskId: string,
  dates: { startDate?: Date | null; targetDate?: Date | null }
): Promise<void> {
  const taskRef = getTaskRef(workspaceId, projectId, taskId);
  const updateData: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if ("startDate" in dates) {
    updateData.startDate = dates.startDate;
  }
  if ("targetDate" in dates) {
    updateData.targetDate = dates.targetDate;
  }

  await updateDoc(taskRef, updateData);
}

/**
 * Update task attachments
 */
export async function updateTaskAttachments(
  workspaceId: string,
  projectId: string,
  taskId: string,
  attachments: TaskAttachment[]
): Promise<void> {
  const taskRef = getTaskRef(workspaceId, projectId, taskId);
  await updateDoc(taskRef, {
    attachments,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Generic task update for multiple fields at once
 */
export async function updateTask(
  workspaceId: string,
  projectId: string,
  taskId: string,
  updates: Partial<{
    title: string;
    summary: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
    assignees: string[];
    startDate: Date | null;
    targetDate: Date | null;
    attachments: TaskAttachment[];
  }>
): Promise<void> {
  const taskRef = getTaskRef(workspaceId, projectId, taskId);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
