import { db } from "@/lib/firebase";
import type { Project } from "@/shared/types/db";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";

export async function getWorkspaceProjects(workspaceId: string) {
  const q = query(
    collectionGroup(db, "projects"),
    where("workspaceId", "==", workspaceId)
  );
  const snap = await getDocs(q);
  
  const projects = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  
  return projects as Project[];
}
