import { getUserWorkspacesIds, getWorkspacesByIds } from "@/db";
import { useUserStore } from "@/shared/store/store.user";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useEffect } from "react";

export const useWorkspaceResolve = () => {
  // Hook implementation
  const { user } = useUserStore();
  const { setActiveWorkspace, setWorkspaces } = useWorkspaceStore();

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const ids = await getUserWorkspacesIds(user.id);

      if (ids) {
        const workspaces = await getWorkspacesByIds(ids as string[]);

        const active =
          workspaces.find((w) => w.id === user.activeWorkspaceId) ??
          workspaces[0];

        setWorkspaces(workspaces);
        setActiveWorkspace(active);
      }
    };

    init();
  }, [user]);
};
