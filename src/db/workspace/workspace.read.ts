import { db } from "@/lib/firebase";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export async function getUserWorkspacesIds(userId: string): Promise<(string | undefined)[]> {
  try {
    const q = query(
      collectionGroup(db, "members"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return []; // user has no workspaces
    }

    // extract workspace IDs from path
    const workspaceIds = snapshot.docs.map((doc) => {
      return doc.ref.parent.parent?.id;
    });

    return workspaceIds;
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw new Error('Failed to fetch workspaces. Please try again.');
  }
}

export async function isWorkspaceUrlUnique(workspaceUrl: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, "workspaces"),
      where("workspaceUrl", "==", workspaceUrl)
    );

    const snapshot = await getDocs(q);
    return snapshot.empty; // true if workspaceUrl is unique, false if not
  } catch (error) {
    console.error('Error checking workspace URL:', error);
    throw new Error('Failed to check workspace URL. Please try again.');
  }
}



export async function getWorkspacesByIds(
  workspaceIds: string[]
) : Promise<any[]> {
  console.log(workspaceIds);
  const getAllWorkspaces = Promise.all(
    workspaceIds.map(async (id) => {
      const docRef = doc(db, "workspaces", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    })
  );
  return getAllWorkspaces;
}
