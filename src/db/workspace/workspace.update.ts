import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

/**
 * Update workspace name in Firestore
 */
export const updateWorkspaceName = async (workspaceId: string, name: string) => {
  try {
    await updateDoc(doc(db, "workspaces", workspaceId), {
      workspaceName: name,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating workspace name:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update workspace name",
      success: false,
    };
  }
};

/**
 * Update workspace URL/slug in Firestore
 * Checks for uniqueness before updating
 */
export const updateWorkspaceUrl = async (workspaceId: string, newUrl: string) => {
  try {
    // Check if the new URL is already taken (by a different workspace)
    const q = query(
      collection(db, "workspaces"),
      where("workspaceUrl", "==", newUrl)
    );
    
    const snapshot = await getDocs(q);
    
    // If URL exists and belongs to a different workspace, reject
    if (!snapshot.empty && snapshot.docs[0].id !== workspaceId) {
      return {
        error: "This workspace URL is already taken",
        success: false,
      };
    }

    await updateDoc(doc(db, "workspaces", workspaceId), {
      workspaceUrl: newUrl,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating workspace URL:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update workspace URL",
      success: false,
    };
  }
};

/**
 * Delete workspace and all its subcollections
 */
export const deleteWorkspace = async (workspaceId: string) => {
  try {
    // Delete all members
    const membersSnapshot = await getDocs(
      collection(db, "workspaces", workspaceId, "members")
    );
    
    const memberDeletions = membersSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    
    await Promise.all(memberDeletions);

    // Delete workspace document
    await deleteDoc(doc(db, "workspaces", workspaceId));
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete workspace",
      success: false,
    };
  }
};
