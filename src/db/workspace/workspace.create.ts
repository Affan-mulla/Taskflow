import { auth, db } from "@/lib/firebase";
import { createSlugUrl } from "@/shared/utils/createSlugUrl";
import type { workspaceSchemaType } from "@/features/workspace/validation/createWorkspace";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const createWorkspace = async (data: workspaceSchemaType) : Promise<{ workspaceId?: string; success: boolean, error?: string } | undefined > =>  {
  try {
    const user = auth.currentUser;
    if (!user) return {
      error: "User not authenticated",
      success: false
    };

    // Slugify the URL for consistency
    const slugifiedUrl = createSlugUrl(data.workspaceUrl);

    const uniqueSlug = query(
      collection(db, "workspaces"),
      where("workspaceUrl", "==", slugifiedUrl)
    );

    const snapshot = await getDocs(uniqueSlug);
    if (snapshot.docs.length > 0)
      return {
        error: "Workspace URL already exists",
        success: false
      };

    // Create workspace (auto ID)
    const workspaceRef = await addDoc(collection(db, "workspaces"), {
      workspaceName: data.workspaceName,
      workspaceUrl: slugifiedUrl,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    });

    // Add creator as OWNER in members subcollection
    await setDoc(doc(db, "workspaces", workspaceRef.id, "members", user.uid), {
      userId: user.uid,
      role: "OWNER",
      joinedAt: serverTimestamp(),
    });

    return {
      workspaceId: workspaceRef.id,
      success: true
    }
  } catch (error) {
    console.error("Error while creating workspace: ", error);
  }
};
