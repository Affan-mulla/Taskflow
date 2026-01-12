
import { AppSidebar } from "@/components/Sidebar/SidebarWrapper"
import { Outlet } from "react-router"
import { useWorkspaceResolve } from "../hooks/useGetWorkspaces";

const WorkspaceLayout = () => {
  useWorkspaceResolve();
  return (
    <div className="flex w-full h-screen">
      <AppSidebar/>
      <Outlet/>
    </div>
  )
}

export default WorkspaceLayout