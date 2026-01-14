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

export async function getWorkspaceMembers(
  workspaceId: string
): Promise<any[]> {
  try {
    const membersRef = collection(db, "workspaces", workspaceId, "members");
    const snapshot = await getDocs(membersRef);
    const members = snapshot.docs.map((doc) => doc.data());
    console.log("Fetched members for workspace", workspaceId, members);

    const userData = await Promise.all(
      members.map(async (member) => {
        const userRef = doc(db, "users", member.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          return { ...member, userName : userSnap.data().name, avatarUrl: userSnap.data().avatar, email: userSnap.data().email };
        } else {
          return member; // return member data even if user data is missing
        }
      })
    );
    console.log("Combined member and user data:", userData);
    return userData;

  } catch (error) {
    console.error("Error fetching workspace members:", error);
    throw new Error("Failed to fetch workspace members. Please try again.");
  }
}