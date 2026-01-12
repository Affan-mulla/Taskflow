import { create } from "zustand";

interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    avatar: string | undefined;
    activeWorkspaceId?: string;
}

interface UserStore {
  user: User | null;
  loading : boolean;
  setUser: (user: User) => void;
  setLoading : (value : boolean) => void
  clearUser: () => void;
  setActiveWorkspaceId:(workspaceId: string) => void
}
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading:false,
  setUser: (user: User) =>
    set(() => ({
      user: user,
    })),
    clearUser: () =>
    set(() => ({
      user: null,
    })),
    setLoading:(value : boolean) => {
        set(() => ({
            loading : value
        }))
    },
    setActiveWorkspaceId:(workspaceId: string) =>
    set((state) => ({
      user: state.user ? { ...state.user, activeWorkspaceId: workspaceId } : null,
    })),
    
}));