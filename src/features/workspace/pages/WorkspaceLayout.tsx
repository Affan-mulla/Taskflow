import { AppSidebar } from "@/components/Sidebar/SidebarWrapper";
import { Outlet } from "react-router";
import { useWorkspacesFetcher } from "../hooks/useGetWorkspaces";
import { useWorkspaceResolver } from "../hooks/useWorkspaceResolver";
import { WorkspaceProvider } from "../components/WorkspaceProvider";
import { Spinner } from "@/components/ui/spinner";
import { SidebarInset } from "@/components/ui/sidebar";

/**
 * Top-level layout for workspace-scoped routes.
 *
 * Responsibilities:
 * 1. Fetch user's workspaces (useWorkspacesFetcher)
 * 2. Resolve active workspace from URL (useWorkspaceResolver)
 * 3. Provide workspace context to children (WorkspaceProvider)
 *
 * The URL is the SINGLE SOURCE OF TRUTH for active workspace.
 * Switching workspaces = navigating to a different URL.
 */
const WorkspaceLayout = () => {
  // Step 1: Fetch user's workspaces into store
  useWorkspacesFetcher();

  // Step 2: Resolve active workspace from URL param
  const { isResolving } = useWorkspaceResolver();

  // Show loading state while resolving workspace
  if (isResolving) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <WorkspaceProvider>
      <div className="flex h-screen w-full overflow-hidden p-1 bg-background">
        <AppSidebar />

        {/* <div className="flex-1 flex flex-col h-full overflow-hidden rounded-lg border border-border bg-background shadow-sm"> */}
        <SidebarInset>
          <Outlet />
        </SidebarInset>
        {/* </div> */}
      </div>
    </WorkspaceProvider>
  );
};

export default WorkspaceLayout;
