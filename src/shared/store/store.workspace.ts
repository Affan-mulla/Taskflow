import type { Timestamp } from "firebase/firestore";
import { create } from "zustand";
import type { Project } from "@/shared/types/db";

// =============================================================================
// Types
// =============================================================================

export interface Workspace {
  id: string;
  workspaceName: string;
  workspaceUrl: string;
  createdAt: string;
}

export interface Member {
  userId: string;
  role: string;
  userName: string;
  avatarUrl?: string;
  email: string;
  joinedAt: Timestamp;
}

interface WorkspaceStore {
  // --- State ---
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  members: Member[];
  membersLoading: boolean;
  projects: Project[];
  projectsLoading: boolean;

  // --- Actions: Workspaces ---
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;

  // --- Actions: Members ---
  setMembers: (members: Member[]) => void;
  setMembersLoading: (loading: boolean) => void;
  resetMembers: () => void;

  // --- Actions: Projects ---
  setProjects: (projects: Project[]) => void;
  setProjectsLoading: (loading: boolean) => void;
  resetProjects: () => void;

  // --- Actions: Workspace Switching ---
  /**
   * Resets all workspace-scoped data when switching workspaces.
   * Called automatically before attaching new listeners.
   */
  resetWorkspaceData: () => void;

  /**
   * Finds a workspace by its URL slug.
   * Used for URL-driven workspace resolution.
   */
  getWorkspaceByUrl: (workspaceUrl: string) => Workspace | undefined;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  // --- Initial State ---
  workspaces: [],
  activeWorkspace: null,
  members: [],
  membersLoading: false,
  projects: [],
  projectsLoading: true,

  // --- Workspaces ---
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),

  // --- Members ---
  setMembers: (members) => set({ members }),
  setMembersLoading: (membersLoading) => set({ membersLoading }),
  resetMembers: () => set({ members: [], membersLoading: false }),

  // --- Projects ---
  setProjects: (projects) => set({ projects }),
  setProjectsLoading: (projectsLoading) => set({ projectsLoading }),
  resetProjects: () => set({ projects: [], projectsLoading: true }),

  // --- Workspace Switching ---
  resetWorkspaceData: () =>
    set({
      members: [],
      membersLoading: false,
      projects: [],
      projectsLoading: true,
    }),

  getWorkspaceByUrl: (workspaceUrl: string) => {
    const { workspaces } = get();
    return workspaces.find(
      (w) => w.workspaceUrl.toLowerCase() === workspaceUrl.toLowerCase()
    );
  },
}));
