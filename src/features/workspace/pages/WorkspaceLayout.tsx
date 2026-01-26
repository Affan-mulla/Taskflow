
import { AppSidebar } from "@/components/Sidebar/SidebarWrapper"
import { Outlet } from "react-router"
import { useWorkspaceResolve } from "../hooks/useGetWorkspaces";
import { WorkspaceProvider } from "../components/WorkspaceProvider";

const WorkspaceLayout = () => {
  useWorkspaceResolve();
  return (
    <WorkspaceProvider>
    <div className="flex h-screen w-full overflow-hidden p-1 bg-background">
      <AppSidebar/>
      <div className="flex-1 flex flex-col h-full overflow-hidden rounded-lg border border-border bg-background shadow-sm">
        <Outlet/>
      </div>
    </div>
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout