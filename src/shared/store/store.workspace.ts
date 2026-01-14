import type { Timestamp } from "firebase/firestore";
import { create } from "zustand";

interface Workspace {
  id: string;
  workspaceName: string;
  workspaceUrl: string;
  createdAt: string;
}

interface Members {
  userId: string;
  role: string;
  userName: string;
  avatarUrl?: string;
  email: string;
  joinedAt: Timestamp;
}

interface WorkspaceStore {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  members: Members[];
  membersLoading: boolean;
  setActiveWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setMembers: (members: Members[]) => void;
  setMembersLoading: (loading: boolean) => void;
  resetMembers: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  members: [],
  membersLoading: false,
  activeWorkspace: null,

  setMembers: (members: Members[]) =>
    set(() => ({
      members: members,
    })),
  setMembersLoading: (loading: boolean) =>
    set(() => ({
      membersLoading: loading,
    })),
  resetMembers: () => set(() => ({})),
  setActiveWorkspace: (workspace: Workspace) =>
    set(() => ({
      activeWorkspace: workspace,
    })),
  setWorkspaces: (workspaces: Workspace[]) =>
    set(() => ({
      workspaces: workspaces,
    })),
}));
