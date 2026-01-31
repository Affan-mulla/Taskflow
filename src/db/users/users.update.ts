import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

/**
 * Update user profile name in Firestore
 */
export const updateUserName = async (name: string) => {
  const { currentUser } = auth;
  if (!currentUser) {
    return {
      error: "No authenticated user found",
      success: false,
    };
  }

  try {
    await updateDoc(doc(db, "users", currentUser.uid), {
      name,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user name:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update name",
      success: false,
    };
  }
};

/**
 * Update user avatar URL in Firestore
 */
export const updateUserAvatar = async (avatarUrl: string) => {
  const { currentUser } = auth;
  if (!currentUser) {
    return {
      error: "No authenticated user found",
      success: false,
    };
  }

  try {
    await updateDoc(doc(db, "users", currentUser.uid), {
      avatar: avatarUrl,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user avatar:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update avatar",
      success: false,
    };
  }
};
