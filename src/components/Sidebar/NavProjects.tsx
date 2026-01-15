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
  ArrowDown01Icon,
  Task02Icon,
  Layers01Icon,
  Layout,
  Folder01Icon,
  FolderOpen,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { useLocation, useNavigate, useParams } from "react-router";
import { useState } from "react";
import AddProject from "../Common/AddProject";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { Skeleton } from "../ui/skeleton";
import { createSlugUrl } from "@/shared/utils/createSlugUrl";

interface ProjectItem {
  icon: IconSvgElement;
  label: string;
  url: string;
}

interface ProjectUI {
  id: string;
  workspaceUrl: string;
  name: string;
  icon: IconSvgElement;
  items: ProjectItem[];
}

const NavProjects = () => {
  const { workspaceUrl } = useParams();
  const {
    projects: storeProjects,
    projectsLoading,
    activeWorkspace,
  } = useWorkspaceStore();
  const [isMainOpen, setIsMainOpen] = useState(true);

  const projects: ProjectUI[] = storeProjects.map((project) => ({
    id: project.id || "",
    workspaceUrl: activeWorkspace?.workspaceUrl || workspaceUrl || "",
    name: project.name,
    icon: Folder01Icon,
    items: [
      {
        icon: Layout,
        label: "Overview",
        url: "overview",
      },
      {
        icon: Task02Icon,
        label: "Tasks",
        url: "tasks",
      },
      {
        icon: Layers01Icon,
        label: "Board",
        url: "board",
      },
    ],
  }));

  if (projectsLoading) {
    return (
      <SidebarGroup>
        <SidebarContent className="px-2 space-y-2">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </SidebarContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarContent>
        <Collapsible
          defaultOpen={true}
          onOpenChange={setIsMainOpen}
          disabled={projects.length === 0}
        >
          <CollapsibleTrigger
            className={"w-full flex justify-between items-center"}
          >
            <SidebarGroupLabel className="w-full hover:bg-accent">
              Your Projects
              {projects.length > 0 && (
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className={`size-2 ml-auto text-muted-foreground transition-transform ${
                    isMainOpen ? "rotate-90" : ""
                  }`}
                  strokeWidth={2}
                />
              )}
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="space-y-1 mt-2 w-full">
              {projects &&
                projects.map((project) => (
                  <SidebarMenuItem key={project.id} className="w-full">
                    <CollapsibleProject project={project} />
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
        {projects.length === 0 && !projectsLoading && <NoProjectPlaceholder />}
      </SidebarContent>
    </SidebarGroup>
  );
};

const CollapsibleProject = ({ project }: { project: ProjectUI }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});
  const bgActive =
    "bg-sidebar-accent border border-sidebar-border shadow text-foreground";
  const isItemActive = (
    workspaceUrl: string,
    projectName: string,
    itemUrl: string
  ) => {
    const projectSlug = createSlugUrl(projectName);
    return pathname === `/${workspaceUrl}/projects/${projectSlug}/${itemUrl}`;
  };

  return (
    <Collapsible
      className={"w-full"}
      onOpenChange={(open) =>
        setOpenProjects((prev) => ({ ...prev, [project.id]: open }))
      }
    >
      <CollapsibleTrigger className={"w-full"}>
        <SidebarMenuButton className=" w-full">
          <HugeiconsIcon
            icon={openProjects[project.id] ? FolderOpen : Folder01Icon}
            strokeWidth={2}
            className="size-5 text-muted-foreground"
          />
          <span className="font-medium">{project.name}</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className={`size-2 ml-auto text-muted-foreground transition-transform ${
              openProjects[project.id] ? "rotate-90" : ""
            }`}
          />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenu className="space-y-1 mt-2">
          {project.items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                className={`pl-6 ${
                  isItemActive(project.workspaceUrl, project.name, item.url)
                    ? bgActive
                    : "text-muted-foreground"
                }`}
                onClick={() =>
                  navigate(
                    `/${project.workspaceUrl}/projects/${createSlugUrl(project.name)}/${item.url}`
                  )
                }
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
  );
};

const NoProjectPlaceholder = () => {
  return (
    <div className="mx-2 mt-2 rounded-lg border-[1.5px] border-dashed border-border bg-muted/40 p-3 text-center">
      <p className="text-sm font-medium">No projects yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        Create a project to organize tasks and boards.
      </p>
      <div className="mt-2 w-full">
        <AddProject />
      </div>
    </div>
  );
};

export default NavProjects;
