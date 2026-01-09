import { db } from "@/lib/firebase";
import {
  collectionGroup,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export async function checkUserWorkspaces(userId: string): Promise<(string | undefined)[]> {
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
