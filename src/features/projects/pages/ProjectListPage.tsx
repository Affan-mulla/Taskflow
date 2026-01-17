import AvatarImg from "@/components/Common/AvatarImage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Add01Icon,
  AlertSquareIcon,
  Calendar02Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  CubeIcon,
  Filter,
  FilterHorizontalIcon,
  Folder01Icon,
  FullSignalIcon,
  LowSignalIcon,
  MediumSignalIcon,
  Progress01FreeIcons,
  Progress03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type ProjectPriority = "urgent" | "high" | "medium" | "low";
type ProjectStatus = "planned" | "in-progress" | "completed" | "cancelled";

type Project = {
  id: string;
  name: string;
  priority: ProjectPriority;
  lead: {
    name: string;
    avatarSrc?: string;
  };
  targetDate?: Date;
  status: ProjectStatus;
};

const DEMO_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Real-Time Collaborative Task Management System using React and Firebase",
    priority: "urgent",
    lead: { name: "Axon", avatarSrc: "/Taskflow.svg" },
    targetDate: new Date("2026-01-20"),
    status: "in-progress",
  },
  {
    id: "p2",
    name: "Workspace onboarding + permissions model",
    priority: "high",
    lead: { name: "Mariam" },
    targetDate: new Date("2026-02-03"),
    status: "planned",
  },
  {
    id: "p3",
    name: "Notifications: digest, mention, and assignment rules",
    priority: "medium",
    lead: { name: "Ibrahim" },
    targetDate: new Date("2026-02-15"),
    status: "completed",
  },
  {
    id: "p4",
    name: "Performance pass: list virtualization + optimistic updates",
    priority: "low",
    lead: { name: "Sara" },
    targetDate: new Date("2026-03-01"),
    status: "planned",
  },
];

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

const GRID_MD = "md:grid-cols-[minmax(0,2.6fr)_160px_180px_170px]";
const GRID_LG = "lg:grid-cols-[minmax(0,2.6fr)_160px_180px_170px_140px]";

const ProjectListPage = () => {
  return (
    <div className="h-full w-full">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <ProjectNavbar />
        <Separator className="bg-border/60" />
        <ProjectFilterBar projectCount={DEMO_PROJECTS.length} />
        <Separator className="bg-border/60" />
      </div>

      <div className="px-3 sm:px-4 md:px-6 py-3">
        <ProjectsView projects={DEMO_PROJECTS} />
      </div>
    </div>
  );
};

const ProjectNavbar = ({ projectName }: { projectName?: string }) => {
  return (
    <div className="px-3 sm:px-4 md:px-6 py-3 w-full flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 size-6 rounded-md bg-primary/40 ring-1 ring-border/50 grid place-items-center">
            <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-4 text-primary fill-current" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
                {projectName ?? "Projects"}
              </h1>
              
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <HugeiconsIcon icon={CubeIcon} strokeWidth={2} className="size-4" />
            All projects
          </Button>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
};

const ProjectFilterBar = ({ projectCount }: { projectCount: number }) => {
  return (
    <div className="px-3 sm:px-4 md:px-6 py-2 w-full flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="truncate">{projectCount} projects</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline truncate">Click a row to open</span>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <Button size="sm" variant="ghost" className="group gap-2">
          <HugeiconsIcon
            icon={Filter}
            strokeWidth={2}
            className="size-4 text-muted-foreground group-hover:text-foreground"
          />
          Filter
        </Button>
        <Button size="sm" variant="outline" className="group gap-2">
          <HugeiconsIcon
            icon={FilterHorizontalIcon}
            strokeWidth={2}
            className="size-4 text-muted-foreground group-hover:text-foreground"
          />
          Display
        </Button>
      </div>
    </div>
  );
};

const ProjectsView = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="w-full">
      {/* Desktop/Tablet grid list */}
      <div className="hidden md:block">
        <div className="rounded-lg bg-muted/10 ring-1 ring-border/50 overflow-hidden">
          <ProjectHeader />
          <div className="divide-y divide-border/40">
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

const ProjectHeader = () => {
  return (
    <div
      className={
        "grid " +
        GRID_MD +
        " " +
        GRID_LG +
        " items-center px-3 py-2 text-[11px] font-medium text-muted-foreground"
      }
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="truncate">Project</span>
      </div>
      <div className="hidden md:flex items-center">Priority</div>
      <div className="hidden md:flex items-center">Lead</div>
      <div className="hidden md:flex items-center">Target</div>
      <div className="hidden lg:flex items-center">Status</div>
    </div>
  );
};

const ProjectRow = ({ project }: { project: Project }) => {
  return (
    <button
      type="button"
      className={
        "group w-full text-left grid " +
        GRID_MD +
        " " +
        GRID_LG +
        " items-center px-3 py-2.5 transition-colors " +
        "hover:bg-accent/30 focus-visible:bg-accent/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60"
      }
      aria-label={`Open project ${project.name}`}
    >
      {/* Project */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 size-7 rounded-md bg-background/40 ring-1 ring-border/50 grid place-items-center">
          <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-foreground">
            {project.name}
          </div>
          <div className="md:hidden mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <ProjectPriorityPill priority={project.priority} compact />
            <StatusIndicator status={project.status} compact />
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon icon={Calendar02Icon} strokeWidth={2} className="size-3" />
              {project.targetDate ? formatDate(project.targetDate) : "No date"}
            </span>
          </div>
        </div>
      </div>

      {/* Priority */}
      <div className="hidden md:flex items-center">
        <ProjectPriorityPill priority={project.priority} />
      </div>

      {/* Lead */}
      <div className="hidden md:flex items-center gap-2 min-w-0">
        <div className="shrink-0 size-5 rounded-full ring-1 ring-border/50 overflow-hidden bg-muted/40">
          {project.lead.avatarSrc ? (
            <AvatarImg src={project.lead.avatarSrc} alt={project.lead.name} />
          ) : (
            <div className="size-full grid place-items-center text-[10px] font-semibold text-muted-foreground">
              {project.lead.name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <span className="truncate text-sm text-foreground/90">{project.lead.name}</span>
      </div>

      {/* Target date */}
      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground min-w-0">
        <HugeiconsIcon icon={Calendar02Icon} strokeWidth={2} className="size-4" />
        <span className="truncate">{project.targetDate ? formatDate(project.targetDate) : "—"}</span>
      </div>

      {/* Status */}
      <div className="hidden lg:flex items-center gap-2">
        <StatusIndicator status={project.status} />
      </div>
    </button>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <button
      type="button"
      className={
        "w-full text-left rounded-lg bg-muted/10 ring-1 ring-border/50 px-3 py-3 " +
        "transition-colors hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60"
      }
      aria-label={`Open project ${project.name}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="shrink-0 size-7 rounded-md bg-background/40 ring-1 ring-border/50 grid place-items-center">
              <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">{project.name}</div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <ProjectPriorityPill priority={project.priority} compact />
                <StatusIndicator status={project.status} compact />
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <StatusIndicator status={project.status} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 size-5 rounded-full ring-1 ring-border/50 overflow-hidden bg-muted/40">
            {project.lead.avatarSrc ? (
              <AvatarImg src={project.lead.avatarSrc} alt={project.lead.name} />
            ) : (
              <div className="size-full grid place-items-center text-[10px] font-semibold text-muted-foreground">
                {project.lead.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <span className="truncate">{project.lead.name}</span>
        </div>
        <div className="flex items-center justify-end gap-2 min-w-0">
          <HugeiconsIcon icon={Calendar02Icon} strokeWidth={2} className="size-4" />
          <span className="truncate">{project.targetDate ? formatDate(project.targetDate) : "No date"}</span>
        </div>
      </div>
    </button>
  );
};

const ProjectPriorityPill = ({ priority, compact }: { priority: ProjectPriority; compact?: boolean }) => {
  const config: Record<
    ProjectPriority,
    { label: string; icon: any }
  > = {
    urgent: {
      label: "Urgent",
      icon: AlertSquareIcon,
    },
    high: {
      label: "High",
      icon: FullSignalIcon,
    },
    medium: {
      label: "Medium",
      icon: MediumSignalIcon,
    },
    low: {
      label: "Low",
      icon: LowSignalIcon,
    },
  };

  const c = config[priority];
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted-foreground " +
        "hover:text-foreground transition-colors"
      }
    >
      <HugeiconsIcon icon={c.icon} strokeWidth={2} className="size-4" />
      {!compact && <span className="text-xs font-medium">{c.label}</span>}
    </span>
  );
};

const StatusIndicator = ({ status, compact }: { status: ProjectStatus; compact?: boolean }) => {
  const config: Record<ProjectStatus, { label: string; icon: any }> = {
    planned: {
      label: "Planned",
      icon: Progress01FreeIcons,
    },
    "in-progress": {
      label: "In Progress",
      icon: Progress03Icon,
    },
    completed: {
      label: "Completed",
      icon: CheckmarkCircle01Icon,
    },
    cancelled: {
      label: "Cancelled",
      icon: CancelCircleIcon,
    },
  };

  const c = config[status];
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted-foreground " +
        "hover:text-foreground transition-colors"
      }
    >
      <HugeiconsIcon icon={c.icon} strokeWidth={2} className="size-4" />
      {!compact && <span className="text-xs font-medium">{c.label}</span>}
    </span>
  );
};

export default ProjectListPage;
