import { db } from "@/lib/firebase";
import type { Issue, IssuePriority, IssueStatus } from "@/shared/types/db";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface CreateIssuePayload {
  workspaceId: string;
  projectId: string;
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
  createdBy: string;
}

/**
 * Create a new issue within a project.
 * Real-time listeners will automatically pick up the new issue.
 */
export async function createIssue(data: CreateIssuePayload) {
  try {
    if (!data.workspaceId || !data.projectId) {
      throw new Error("Workspace ID and Project ID are required");
    }

    const issueData: Omit<Issue, "id"> = {
      projectId: data.projectId,
      title: data.title,
      description: data.description || "",
      status: data.status || "backlog",
      priority: data.priority || "no-priority",
      assigneeId: data.assigneeId,
      createdBy: data.createdBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const issuesRef = collection(
      db,
      "workspaces",
      data.workspaceId,
      "projects",
      data.projectId,
      "issues"
    );

    const docRef = await addDoc(issuesRef, issueData);

    return {
      success: true,
      issueId: docRef.id,
    };
  } catch (error) {
    console.error("Error creating issue:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create issue",
    };
  }
}
