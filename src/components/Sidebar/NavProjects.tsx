import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { 
  AndroidFreeIcons, 
  ArrowDown01Icon, 
  Task02Icon, 
  Layers01Icon, 
  Layout
} from "@hugeicons/core-free-icons";
import { useLocation, useNavigate, useParams } from "react-router";
import { useState } from "react";

interface ProjectItem {
  icon: IconSvgElement;
  label: string;
  url: string;
}

interface Project {
  id: string;
  workspaceUrl: string;
  name: string;
  icon: IconSvgElement;
  items: ProjectItem[];
}

const NavProjects = () => {
  const { pathname } = useLocation();
  const { workspaceUrl } = useParams(); // Get from URL instead of hardcoding
  const navigate = useNavigate();
  const bgActive = "bg-sidebar-accent border border-sidebar-border shadow text-foreground";
  const [isMainOpen, setIsMainOpen] = useState(true);
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});

  // TODO: Replace with real data from Firestore
  const projects: Project[] = [
    {
      workspaceUrl: workspaceUrl || "axon-123",
      id: "AXO",
      name: "Axon-123",
      icon: AndroidFreeIcons,
      items: [
        {
          icon: Layout,
          label: "Overview",
          url: "overview", // ✅ Fixed
        },
        {
          icon: Task02Icon,
          label: "Tasks",
          url: "tasks", // ✅ Fixed
        },
        {
          icon: Layers01Icon,
          label: "Board",
          url: "board", // ✅ Fixed
        },
      ],
    },
     {
      workspaceUrl: workspaceUrl || "axon-123",
      id: "PJB",
      name: "Project Beta",
      icon: AndroidFreeIcons,
      items: [
        {
          icon: Layout,
          label: "Overview",
          url: "overview", // ✅ Fixed
        },
        {
          icon: Task02Icon,
          label: "Tasks",
          url: "tasks", // ✅ Fixed
        },
        {
          icon: Layers01Icon,
          label: "Board",
          url: "board", // ✅ Fixed
        },
      ],
    },
  ];

  const isItemActive = (workspaceUrl: string, projectId: string, itemUrl: string) => {
    return pathname === `/${workspaceUrl}/projects/${projectId}/${itemUrl}`;
  };

  return (
    <SidebarGroup>
      <SidebarContent>
        <Collapsible defaultOpen={true} onOpenChange={setIsMainOpen}>
          <CollapsibleTrigger className={"w-full flex justify-between items-center"}>
            <SidebarGroupLabel className="w-full hover:bg-accent">
              Your Projects
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className={`size-2 ml-auto text-muted-foreground transition-transform ${isMainOpen ? 'rotate-180' : ''}`}
                strokeWidth={2}
              />
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="space-y-1 mt-2 w-full">
              {projects.map((project) => (
                <SidebarMenuItem key={project.id} className="w-full">
                  <Collapsible 
                    className={"w-full"} 
                    onOpenChange={(open) => setOpenProjects(prev => ({ ...prev, [project.id]: open }))}
                  >
                    <CollapsibleTrigger className={"w-full"}>
                      <SidebarMenuButton className=" w-full">
                        <HugeiconsIcon
                          icon={project.icon}
                          strokeWidth={2}
                          className="size-5 text-muted-foreground"
                        />
                        <span className="font-medium">{project.name}</span>
                        <HugeiconsIcon
                          icon={ArrowDown01Icon}
                          strokeWidth={2}
                          className={`size-2 ml-auto text-muted-foreground transition-transform ${openProjects[project.id] ? 'rotate-180' : ''}`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu className="space-y-1 mt-2">
                        {project.items.map((item) => (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                              className={`pl-6 ${
                                isItemActive(project.workspaceUrl, project.id, item.url)
                                  ? bgActive
                                  : "text-muted-foreground"
                              }`}
                              onClick={() => navigate(`/${project.workspaceUrl}/projects/${project.id}/${item.url}`)}
                            >
                              <HugeiconsIcon
                                icon={item.icon}
                                strokeWidth={2}
                                className="size-5"
                              />
                              <span className="font-medium">{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>
    </SidebarGroup>
  );
};

export default NavProjects;