
import {  CubeFreeIcons, Layers01Icon, Task02Icon, UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLocation, useNavigate } from "react-router"
import { useWorkspaceStore } from "@/shared/store/store.workspace";

export function NavMain() {

  const {pathname} = useLocation();
  const bgActive = "bg-sidebar-accent border border-sidebar-border shadow text-foreground";
  const navigate = useNavigate();
  const {activeWorkspace} = useWorkspaceStore()

  // Check if we're at workspace level (not in project details)
  const isWorkspaceLevel = () => {
    const pathParts = pathname.split("/").filter(Boolean);
    return pathParts.length === 2; // /workspace-url/items (e.g., /axon-123/tasks)
  };

  const isItemActive = (itemUrl: string) => {
    if (!isWorkspaceLevel()) return false;
    const pathParts = pathname.split("/");
    return pathParts[2] === itemUrl.split("/")[1];
  };

  const items = [
   {
    icon: CubeFreeIcons,
    label: "Projects",
    url: "/projects",
   },
   {
    icon: Task02Icon,
    label: "Task",
    url: "/tasks",
   },
   {
    icon: Layers01Icon,
    label: "Board",
    url: "/board",
   },
   {
    icon : UserGroupIcon,
    label: "Team",
    url: "/team",
   }
  ]
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
          <SidebarMenuButton className={isItemActive(item.url) ? bgActive : "text-muted-foreground"} onClick={() => navigate(`/${activeWorkspace?.workspaceUrl}${item.url}`)}>
            <HugeiconsIcon icon={item.icon} className="size-5" strokeWidth={2} />
            <span className="font-medium">{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}