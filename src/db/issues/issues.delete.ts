import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

/**
 * Delete an issue from a project.
 * Firestore listener automatically removes it from all clients.
 */
export async function deleteIssue(
  workspaceId: string,
  projectId: string,
  issueId: string
) {
  try {
    const issueRef = doc(
      db,
      "workspaces",
      workspaceId,
      "projects",
      projectId,
      "issues",
      issueId
    );
    await deleteDoc(issueRef);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete issue:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete issue",
    };
  }
}
