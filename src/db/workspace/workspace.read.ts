import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getWorkspace() {
    const snapshot = await getDocs(collection(db, "workspace"));
    const workspace = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return workspace;
}