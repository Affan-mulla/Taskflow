import { getUserProfile } from "@/db";
import { useUserStore } from "@/shared/store/store.user";
import { useEffect, useState } from "react"
import useAuth from "./useAuth";

export const useGetUserProfile = () => {
    const [loading, setLoading] = useState(false);
    const {loading: authLoading, user: currentUser} = useAuth()
    const {setUser, clearUser, setLoading : setStoreLoading} = useUserStore()


    const fetchUserProfile = async() => {
        setLoading(true);
        setStoreLoading(true);
        if(!currentUser && !authLoading) return;
        const result = await getUserProfile();
        
        if(result.success && result.data) {
            setUser({id : currentUser!.uid, ...result.data} as any);
        } else {
            clearUser();
        }
        setLoading(false);
        setStoreLoading(false);
    }

    useEffect(() => {
        fetchUserProfile();
    }, [currentUser, authLoading]);

    return {loading};

}