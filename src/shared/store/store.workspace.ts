import { create } from "zustand";

interface Workspace {
  id: string;
  workspaceName: string;
  workspaceUrl: string;
  createdAt: string;
}

interface WorkspaceStore {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  activeWorkspace: null,
  
  setActiveWorkspace: (workspace: Workspace) =>
    set(() => ({
      activeWorkspace: workspace,
    })),
  setWorkspaces: (workspaces: Workspace[]) =>
    set(() => ({
      workspaces: workspaces,
    })),
}));
