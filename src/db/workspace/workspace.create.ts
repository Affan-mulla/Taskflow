import { auth, db } from "@/lib/firebase";
import type { workspaceSchemaType } from "@/validation/createWorkspace";
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

    const uniqueSlug = query(
      collection(db, "workspaces"),
      where("workspaceUrl", "==", data.workspaceUrl)
    );

    const snapshot = await getDocs(uniqueSlug);
    if (snapshot.docs.length > 0)
      return {
        error: "Workspace URL already exists",
        success: false
      };

    // Create workspace (auto ID)
    const workspaceRef = await addDoc(collection(db, "workspaces"), {
      name: data.workspaceName,
      workspaceUrl: data.workspaceUrl,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    });

    // Add creator as OWNER in members subcollection
    await setDoc(doc(db, "workspaces", workspaceRef.id, "members", user.uid), {
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
