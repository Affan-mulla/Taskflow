import { db } from "@/lib/firebase";
import type { Issue, IssuePriority, IssueStatus } from "@/shared/types/db";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/** Issue document reference helper */
const getIssueRef = (workspaceId: string, projectId: string, issueId: string) =>
  doc(db, "workspaces", workspaceId, "projects", projectId, "issues", issueId);

/** Allowed fields for partial issue updates */
type IssueUpdateFields = Pick<Issue, "status" | "priority" | "assigneeId" | "title" | "description">;

/**
 * Generic issue update function.
 * Automatically adds updatedAt timestamp.
 * Real-time listeners will sync changes to all clients.
 */
export async function updateIssue(
  workspaceId: string,
  projectId: string,
  issueId: string,
  fields: Partial<IssueUpdateFields>
): Promise<void> {
  const issueRef = getIssueRef(workspaceId, projectId, issueId);
  await updateDoc(issueRef, { ...fields, updatedAt: serverTimestamp() });
}

/** Update issue status (Kanban drag-and-drop) */
export const updateIssueStatus = (
  workspaceId: string,
  projectId: string,
  issueId: string,
  status: IssueStatus
) => updateIssue(workspaceId, projectId, issueId, { status });

/** Update issue priority */
export const updateIssuePriority = (
  workspaceId: string,
  projectId: string,
  issueId: string,
  priority: IssuePriority
) => updateIssue(workspaceId, projectId, issueId, { priority });

/** Update issue assignee */
export const updateIssueAssignee = (
  workspaceId: string,
  projectId: string,
  issueId: string,
  assigneeId: string | null
) => updateIssue(workspaceId, projectId, issueId, { assigneeId: assigneeId ?? undefined });

/** Update issue title */
export const updateIssueTitle = (
  workspaceId: string,
  projectId: string,
  issueId: string,
  title: string
) => updateIssue(workspaceId, projectId, issueId, { title });

/** Update issue description */
export const updateIssueDescription = (
  workspaceId: string,
  projectId: string,
  issueId: string,
  description: string
) => updateIssue(workspaceId, projectId, issueId, { description });
