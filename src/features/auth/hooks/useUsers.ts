import { createUserProfile } from "@/db";
import type { UserProfileData } from "@/shared/types/db";

type UseUserReturn = {
    createUser: (userId: string, profileData: UserProfileData) => Promise<{ data?: any, success: boolean, error?: string }>;
}

export function useUser(): UseUserReturn {
    const createUser = async (userId: string, profileData: UserProfileData) =>  {
        // Implementation for creating a user profile in the database
        try {
            if (!userId || !profileData) {
                return {
                    error: "Invalid user ID or profile data",
                    success: false
                }
            }
            const customName = profileData.email.split('@')[0];
            const userProfile = await createUserProfile(userId, {
                ...profileData,
                name: profileData.name || customName,
            });

            if (!userProfile) {
                return {
                    error: "Failed to create user profile",
                    success: false
                }
            }
            return {
                data: userProfile,
                success: true
            };
        } catch (error) {
            console.error("Error creating user profile: ", error);
            return {
                error: "An unexpected error occurred",
                success: false
            }
        }
    }

    return { createUser };
}