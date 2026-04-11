import { auth, db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

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
 * Update workspace logo URL in Firestore
 */
export const updateWorkspaceLogo = async (workspaceId: string, logoUrl: string) => {
  try {
    await updateDoc(doc(db, "workspaces", workspaceId), {
      logoUrl,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating workspace logo:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update workspace logo",
      success: false,
    };
  }
};

/**
 * Delete workspace and all its subcollections
 */
export const deleteWorkspace = async (workspaceId: string) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return {
        error: "User not authenticated",
        success: false,
      };
    }

    const memberRef = doc(db, "workspaces", workspaceId, "members", currentUser.uid);
    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {
      return {
        error: "You are not a member of this workspace",
        success: false,
      };
    }

    const normalizedRole = String(memberSnap.data().role ?? "").toLowerCase();

    if (normalizedRole === "member") {
      return {
        error: "Members cannot delete this workspace",
        success: false,
      };
    }

    if (normalizedRole !== "owner" && normalizedRole !== "admin") {
      return {
        error: "You do not have permission to delete this workspace",
        success: false,
      };
    }

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
