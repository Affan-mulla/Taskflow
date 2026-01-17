
import { AppSidebar } from "@/components/Sidebar/SidebarWrapper"
import { Outlet } from "react-router"
import { useWorkspaceResolve } from "../hooks/useGetWorkspaces";
import { WorkspaceProvider } from "../components/WorkspaceProvider";

const WorkspaceLayout = () => {
  useWorkspaceResolve();
  return (
    <WorkspaceProvider>
    <div className="flex max-h-screen w-full p-1">
      <AppSidebar/>
      <div className=" w-full min-h-full rounded-lg border border-border">
        <Outlet/>
      </div>
    </div>
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout