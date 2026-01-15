import type { Timestamp } from "firebase/firestore";
import { create } from "zustand";
import type { Project } from "@/shared/types/db";

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
  projects: Project[];
  projectsLoading: boolean;
  setActiveWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setMembers: (members: Members[]) => void;
  setMembersLoading: (loading: boolean) => void;
  resetMembers: () => void;
  setProjects: (projects: Project[]) => void;
  setProjectsLoading: (loading: boolean) => void;
  resetProjects: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  members: [],
  membersLoading: false,
  projects: [],
  projectsLoading: true,
  activeWorkspace: null,

  setMembers: (members: Members[]) =>
    set(() => ({
      members: members,
    })),
  setMembersLoading: (loading: boolean) =>
    set(() => ({
      membersLoading: loading,
    })),
  resetMembers: () =>
    set(() => ({
      members: [],
      membersLoading: false,
    })),
  setProjects: (projects: Project[]) =>
    set(() => ({
      projects: projects,
    })),
  setProjectsLoading: (loading: boolean) =>
    set(() => ({
      projectsLoading: loading,
    })),
  resetProjects: () =>
    set(() => ({
      projects: [],
      projectsLoading: false,
    })),
  setActiveWorkspace: (workspace: Workspace) =>
    set(() => ({
      activeWorkspace: workspace,
    })),
  setWorkspaces: (workspaces: Workspace[]) =>
    set(() => ({
      workspaces: workspaces,
    })),
}));
