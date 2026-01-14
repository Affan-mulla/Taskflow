
import { AppSidebar } from "@/components/Sidebar/SidebarWrapper"
import { Outlet } from "react-router"
import { useWorkspaceResolve } from "../hooks/useGetWorkspaces";
import { WorkspaceProvider } from "../components/WorkspaceProvider";

const WorkspaceLayout = () => {
  useWorkspaceResolve();
  return (
    <WorkspaceProvider>
    <div className="flex w-full h-screen">
      <AppSidebar/>
      <Outlet/>
    </div>
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout