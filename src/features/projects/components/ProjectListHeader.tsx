import AddProject from "@/components/Common/AddProject";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Add01Icon,
  CubeIcon,
  Filter,
  FilterHorizontalIcon,
  Folder01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// ============================================================================
// ProjectNavbar
// ============================================================================

interface ProjectNavbarProps {
  projectName?: string;
  onAddProject?: () => void;
}

function ProjectNavbar({ projectName, onAddProject }: ProjectNavbarProps) {
  return (
    <div className="px-3 sm:px-4 md:px-6 py-3 w-full flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 size-6 rounded-md bg-primary/40 ring-1 ring-border/50 grid place-items-center">
            <HugeiconsIcon
              icon={Folder01Icon}
              strokeWidth={2}
              className="size-4 text-primary fill-current"
            />
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
        <AddProject btnVariant="outline"/>
      </div>
    </div>
  );
}

// ============================================================================
// ProjectFilterBar
// ============================================================================

interface ProjectFilterBarProps {
  projectCount: number;
  onFilter?: () => void;
  onDisplaySettings?: () => void;
}

function ProjectFilterBar({ 
  projectCount, 
  onFilter, 
  onDisplaySettings 
}: ProjectFilterBarProps) {
  return (
    <div className="px-3 sm:px-4 md:px-6 py-2 w-full flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="truncate">{projectCount} projects</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline truncate">Click a row to open</span>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <Button size="sm" variant="ghost" className="group gap-2" onClick={onFilter}>
          <HugeiconsIcon
            icon={Filter}
            strokeWidth={2}
            className="size-4 text-muted-foreground group-hover:text-foreground"
          />
          Filter
        </Button>
        <Button size="sm" variant="outline" className="group gap-2" onClick={onDisplaySettings}>
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
}

// ============================================================================
// ProjectListHeader (Combined)
// ============================================================================

export interface ProjectListHeaderProps {
  projectCount: number;
  projectName?: string;
  onAddProject?: () => void;
  onFilter?: () => void;
  onDisplaySettings?: () => void;
}

/**
 * Header section for the project list page.
 * Contains the navbar with title/actions and the filter bar.
 */
export function ProjectListHeader({
  projectCount,
  projectName,
  onAddProject,
  onFilter,
  onDisplaySettings,
}: ProjectListHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <ProjectNavbar projectName={projectName} onAddProject={onAddProject} />
      <Separator className="bg-border/60" />
      <ProjectFilterBar
        projectCount={projectCount}
        onFilter={onFilter}
        onDisplaySettings={onDisplaySettings}
      />
      <Separator className="bg-border/60" />
    </div>
  );
}
