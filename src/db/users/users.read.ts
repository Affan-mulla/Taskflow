
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";


export const getUserProfile = async() => {
    try {
        const {currentUser} = auth;
        if(currentUser == null ) {
            return {
                error: "No authenticated user found",
                success: false
            };
        }
       
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if(!snap.exists()) {
            return {
                error: "User profile does not exist",
                success: false
            };
        }
        return {
            data: snap.data(),
            success: true
        };
    } catch (error) {
        throw error;
    }
}