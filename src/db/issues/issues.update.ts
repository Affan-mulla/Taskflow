import { db } from "@/lib/firebase";
import type { IssuePriority, IssueStatus } from "@/shared/types/db";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * Helper to get issue document reference.
 */
function getIssueRef(workspaceId: string, projectId: string, issueId: string) {
  return doc(db, "workspaces", workspaceId, "projects", projectId, "issues", issueId);
}

/**
 * Update issue status (used for Kanban drag-and-drop).
 * Firestore listener automatically syncs to all clients.
 */
export async function updateIssueStatus(
  workspaceId: string,
  projectId: string,
  issueId: string,
  newStatus: IssueStatus
) {
  try {
    const issueRef = getIssueRef(workspaceId, projectId, issueId);
    await updateDoc(issueRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update issue status:", error);
    throw error;
  }
}

/**
 * Update issue priority.
 */
export async function updateIssuePriority(
  workspaceId: string,
  projectId: string,
  issueId: string,
  newPriority: IssuePriority
) {
  try {
    const issueRef = getIssueRef(workspaceId, projectId, issueId);
    await updateDoc(issueRef, {
      priority: newPriority,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update issue priority:", error);
    throw error;
  }
}

/**
 * Update issue assignee.
 */
export async function updateIssueAssignee(
  workspaceId: string,
  projectId: string,
  issueId: string,
  newAssigneeId: string | null
) {
  try {
    const issueRef = getIssueRef(workspaceId, projectId, issueId);
    await updateDoc(issueRef, {
      assigneeId: newAssigneeId,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update issue assignee:", error);
    throw error;
  }
}

/**
 * Update issue title.
 */
export async function updateIssueTitle(
  workspaceId: string,
  projectId: string,
  issueId: string,
  newTitle: string
) {
  try {
    const issueRef = getIssueRef(workspaceId, projectId, issueId);
    await updateDoc(issueRef, {
      title: newTitle,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update issue title:", error);
    throw error;
  }
}

/**
 * Update issue description.
 */
export async function updateIssueDescription(
  workspaceId: string,
  projectId: string,
  issueId: string,
  newDescription: string
) {
  try {
    const issueRef = getIssueRef(workspaceId, projectId, issueId);
    await updateDoc(issueRef, {
      description: newDescription,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update issue description:", error);
    throw error;
  }
}
