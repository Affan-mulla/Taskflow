import {
  UserIcon,
  UserGroupIcon,
  Settings02Icon,
  Logout01Icon,
  PlusSignIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

const UserDropdown = ({userName, avatar }: {userName: string, avatar?: string}) => {

  const {activeWorkspace,workspaces} = useWorkspaceStore();

  const handleLogout = async () => {
    // Implement logout functionality here
    await signOut(auth);
  }
  
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
                <AvatarImg src={avatar} alt={userName} />
              </div>

              {/* Typography with improved weight and spacing */}
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold text-sm tracking-tight text-foreground/90">
                  {userName}
                </span>
                <span className="truncate text-[11px] font-medium uppercase tracking-wider opacity-50">
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
            before:absolute before:inset-0  before:border-t before:border-l before:rounded-xl before:border-foreground/20 before:pointer-events-none
            w-70 rounded-xl p-2 shadow-[0_1px_2px_rgba(0,0,0,0.2)]  bg-linear-to-br from-card to-background backdrop-blur-xl"
            side="right"
            align="end"
            sideOffset={12}
          >
            {/* Header Profile Section */}
            <div className="flex items-center gap-3 p-3 mb-2">
              <div className="size-10">
                <AvatarImg src={avatar} alt={userName} />
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
            <div className="mx-1 mb-4 rounded-xl bg-background border border-border p-2">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                Switch Workspaces
              </p>

              <div className="space-y-1">
                {workspaces.map((workspace) => (
                  <DropdownMenuItem className="flex items-center gap-3 p-1 rounded-lg hover:bg-card/80 cursor-pointer transition-colors" key={workspace.id}>
                  <div className="size-8">
                    <AvatarImg
                      src={"/Taskflow.svg"} // Use workspace logo here
                      alt={workspace.workspaceName}  
                    />
                  </div>
                  <span className="flex-1 font-medium text-sm">
                    {workspace.workspaceName}
                  </span>
                </DropdownMenuItem>
                ))} 
                <div className="flex items-center justify-between gap-2 p-1 pt-2">
                  <Button className=" w-full " size="sm">
                    <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                    Create new
                  </Button>
                </div>
              </div>
            </div>

            {/* General Navigation */}
            <DropdownMenuGroup className="space-y-1">
              <DropdownItem icon={UserIcon} label="Personal info" />
              <DropdownItem icon={UserGroupIcon} label="Manage users" />
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
  <DropdownMenuItem>
    <HugeiconsIcon icon={icon} className="size-5 text-muted-foreground" />
    <span className="font-medium text-[15px]">{label}</span>
  </DropdownMenuItem>
);



export default UserDropdown;
