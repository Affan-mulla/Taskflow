import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ArrowLeft,
  Briefcase,
  Building01Icon,
  Building02Icon,
  Settings03Icon,
  User02Icon,
  Users,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/shared/store/store.workspace";

interface SettingNavItem {
  label: string;
  icon: any;
  path: string;
}

const SettingSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeWorkspace } = useWorkspaceStore();

  const settingItems: SettingNavItem[] = [
    {
      label: "Profile",
      icon: User02Icon,
      path: "profile",
    },
    {
      label: "Workspace",
      icon: Building02Icon,
      path: "workspace",
    },
    {
      label: "Team",
      icon: Users,
      path: "team",
    },
  ];
  const bgActive = "bg-sidebar-accent border border-sidebar-border shadow text-foreground";

  const isActive = (path: string) => {
    return location.pathname.endsWith(`/settings/${path}`);
  };

  return (
    <Sidebar {...props} className="bg-background border-r ">
      <SidebarHeader className="border-b px-4 py-3 flex w-full items-center justify-between flex-row">
          <div className=" flex items-center gap-2 ">
              <HugeiconsIcon
                icon={Settings03Icon}
                strokeWidth={2}
                className="size-4"
              />
              <span>Settings</span>
            </div>
        <Button
          variant="ghost"
          className="justify-start w-fit text-muted-foreground hover:text-foreground"
          size="sm"
          onClick={() => navigate(`/${activeWorkspace?.workspaceUrl}`)}
        >
          <HugeiconsIcon icon={ArrowLeft} strokeWidth={2} className="size-4" />
          <span>Back</span>
        </Button>
             
         
      </SidebarHeader>

      <SidebarContent className="px-0">
        <div className="space-y-1 p-2">

          <nav className="space-y-1">
            {settingItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  className={
                    isActive(item.path) ? bgActive :"text-muted-foreground" 
                  }
                  onClick={() =>
                    navigate(`/${activeWorkspace?.workspaceUrl}/settings/${item.path}`)
                  }
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    className="size-5"
                    strokeWidth={2}
                  />
                  <span className="font-medium">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </nav>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default SettingSidebar;
