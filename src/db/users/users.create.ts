import { db } from "@/lib/firebase";
import type { UserProfileData } from "@/shared/types/db";
import {  doc, setDoc } from "firebase/firestore";

export async function createUserProfile(userId: string, profileData: UserProfileData) {
    // Implementation for creating a user profile in the database
    try {
        if (!userId || !profileData) {
            throw new Error("Invalid user ID or profile data");
        }
        await setDoc(doc(db, "users", userId), {
            name: profileData.name,
            email: profileData.email,
            createdAt: profileData.createdAt,
            avatar : profileData.avatar || null
        });

        return true;
    } catch (error) {
        console.error("Error creating user profile: ", error);
    }
}