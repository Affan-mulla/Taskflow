
import { AppSidebar } from "@/components/Sidebar/SidebarWrapper"
import { Outlet } from "react-router"

const WorkspaceLayout = () => {
  return (
    <div className="flex w-full h-screen">
      <AppSidebar/>
      <Outlet/>
    </div>
  )
}

export default WorkspaceLayout