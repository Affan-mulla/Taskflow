import {
  UserIcon,
  UserGroupIcon,
  Settings02Icon,
  Logout01Icon,
  PlusSignIcon,
  UnfoldMoreIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Button } from "../ui/button";

import ThemeToggler from "../Common/ThemeToggler";
import AvatarImg from "../Common/AvatarImage";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useNavigate, useLocation } from "react-router";
import { useIsMobile } from "@/shared/hooks/use-mobile";

const UserDropdown = ({userName, avatar }: {userName: string, avatar?: string}) => {

  const {activeWorkspace, workspaces} = useWorkspaceStore();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    // Implement logout functionality here
    await signOut(auth);
  }

  /**
   * Handles workspace switching via URL navigation.
   * Preserves the current sub-path (e.g., /projects, /board) when switching.
   */
  const handleWorkspaceSwitch = (workspaceUrl: string) => {
    if (activeWorkspace?.workspaceUrl === workspaceUrl) return;

    // Extract sub-path from current location (everything after /:workspaceUrl)
    const pathParts = location.pathname.split("/").filter(Boolean);
    const subPath = pathParts.slice(1).join("/");

    // Navigate to new workspace with same sub-path
    const newPath = `/${workspaceUrl}${subPath ? `/${subPath}` : ""}`;
    navigate(newPath);
  };
  return (
    <SidebarMenu className="w-full">
      <SidebarMenuItem className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger className={"w-full"}>
            <SidebarMenuButton
              size="lg"
              className="
      relative w-full h-14 px-3
      bg-linear-to-b from-background/50 to-background/80
      backdrop-blur-md
      border border-foreground/20
      rounded-xl
      hover:bg-accent/50 hover:border-border
      transition-all duration-200 ease-in-out
      data-[state=open]:bg-accent 
      data-[state=open]:shadow-inner
      flex items-center gap-3
    "
            >
              {/* Avatar with its own subtle depth */}
              <div className="relative flex aspect-square size-9 items-center justify-center rounded-lg border border-border/50 bg-background shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                <AvatarImg
                  variant="workspace"
                  fallbackText={activeWorkspace?.workspaceName || "No Workspace"}
                />
              </div>

              {/* Typography with improved weight and spacing */}
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold text-[10px] tracking-tight text-muted-foreground">
                  WORKSPACE
                </span>
                <span className="truncate text-sm font-medium uppercase tracking-wider ">
                  {activeWorkspace ? activeWorkspace.workspaceName : "No Workspace"}
                </span>
              </div>

              {/* Icon with refined placement */}
              <div className="flex items-center justify-center text-muted-foreground/60 group-hover:text-foreground transition-colors">
                <HugeiconsIcon icon={UnfoldMoreIcon} className="size-4" />
              </div>

              {/* Subtle Inner Glow (Optional for Dark Mode) */}
              <div className="absolute inset-px rounded-[10px] shadow-[inset_0_0_2px_1px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_0_2px_2px_rgba(255,255,255,0.1)]" aria-hidden="true" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="
            before:absolute before:inset-0  before:rounded-lg before:border-foreground/20 before:pointer-events-none
             md:w-60 rounded-lg p-2 shadow-xl  bg-linear-to-br from-card to-background backdrop-blur-xl"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "start" : "end"}
            sideOffset={isMobile ? 8 : 12}
          >
            {/* Header Profile Section */}
            <div className="flex items-center gap-3 px-2 py-1 mb-2">
              <div className="size-8">
                <AvatarImg src={avatar} fallbackText={userName} />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold">{userName}</span>
                <span className="text-xs text-muted-foreground">{activeWorkspace?.workspaceName}</span>
              </div>
              <div className="ml-auto">
                <ThemeToggler />
              </div>
            </div>
            <DropdownMenuSeparator className="my-2 " />

            {/* Switch Workspaces Section (The Inset Box) */}
            <div className="mx-1 mb-2 rounded-xl bg-background border border-border p-2">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                Switch Workspaces
              </p>

              <div className="space-y-1">
                {workspaces.map((workspace) => {
                  const isActive = activeWorkspace?.id === workspace.id;
                  return (
                    <DropdownMenuItem
                      className={`flex items-center gap-3 p-1 rounded-lg cursor-pointer transition-colors ${
                        isActive
                          ? "bg-accent/50 border border-border"
                          : "hover:bg-card/80"
                      }`}
                      key={workspace.id}
                      onClick={() => handleWorkspaceSwitch(workspace.workspaceUrl)}
                    >
                      <div className="size-6">
                        <AvatarImg
                          variant="workspace"
                          fallbackText={workspace.workspaceName}
                        />
                      </div>
                      <span className="flex-1 font-medium text-sm">
                        {workspace.workspaceName}
                      </span>
                      {isActive && (
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          className="size-4 text-primary"
                        />
                      )}
                    </DropdownMenuItem>
                  );
                })} 
                <div className="flex items-center justify-between gap-2 p-1 pt-2">
                  <Button className=" w-full " size="sm" onClick={() => navigate('/onboarding/workspace')}>
                    <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                    Create new
                  </Button>
                </div>
              </div>
            </div>

            {/* General Navigation */}
            <DropdownMenuGroup className="space-y-1">
              <DropdownItem icon={UserIcon} label="Personal info" />
              <DropdownItem icon={UserGroupIcon} label="Manage Users" />
              <DropdownItem icon={Settings02Icon} label="Settings" />
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <HugeiconsIcon
                icon={Logout01Icon}
                className="size-5 text-muted-foreground"
              />
              <span className="font-medium">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

// --- Helper Components ---

const DropdownItem = ({ icon, label }: { icon: any; label: string }) => (
  <DropdownMenuItem className={"text-sm"}>
    <HugeiconsIcon icon={icon} className="size-4 text-muted-foreground" strokeWidth={2} />
    <span className="font-medium">{label}</span>
  </DropdownMenuItem>
);


export default UserDropdown;
