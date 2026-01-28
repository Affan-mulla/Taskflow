import AddProject from "@/components/Common/AddProject";
import AddTask from "@/features/tasks/components/AddTask";
import { ProjectFilter, FilterSummary } from "./ProjectFilter";
import type { FilterValue, FilterCategory } from "./ProjectFilter";
import type { MemberOption } from "./projects.types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CubeIcon,
  Folder01Icon,
  CheckmarkSquare02Icon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ============================================================================
// ProjectNavbar
// ============================================================================

type EntityType = "project" | "task";

interface ProjectNavbarProps {
  title?: string;
  onAddProject?: () => void;
  entityType?: EntityType;
}

function ProjectNavbar({ title, entityType = "project" }: ProjectNavbarProps) {
  const isTask = entityType === "task";
  const defaultTitle = isTask ? "All Tasks" : "Projects";
  const icon = isTask ? TaskDone01Icon : Folder01Icon;
  const buttonIcon = isTask ? CheckmarkSquare02Icon : CubeIcon;
  const buttonLabel = isTask ? "All tasks" : "All projects";
  
  return (
    <div className="px-3 sm:px-4 md:px-6 py-3 w-full flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-3">
        <div>
          <SidebarTrigger className={"text-muted-foreground"}/>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 size-6 rounded-md bg-primary/40 ring-1 ring-border/50 grid place-items-center">
            <HugeiconsIcon
              icon={icon}
              strokeWidth={2}
              className="size-4 text-primary fill-current"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
                {title ?? defaultTitle}
              </h1>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <HugeiconsIcon icon={buttonIcon} strokeWidth={2} className="size-4" />
            {buttonLabel}
          </Button>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {isTask ? (
          <AddTask triggerVariant="outline" />
        ) : (
          <AddProject btnVariant="outline"/>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ProjectFilterBar
// ============================================================================

interface ProjectFilterBarProps {
  itemCount: number;
  members?: MemberOption[];
  projects?: Array<{ value: string; label: string }>;
  filters?: FilterValue[];
  onFiltersChange?: (filters: FilterValue[]) => void;
  onRemoveFilter?: (category: FilterCategory, value: string | Date) => void;
  onRemoveCategory?: (category: FilterCategory) => void;
  entityType?: EntityType;
}

function ProjectFilterBar({ 
  itemCount, 
  members = [],
  projects = [],
  filters = [],
  onFiltersChange,
  onRemoveFilter,
  onRemoveCategory,
  entityType = "project",
}: ProjectFilterBarProps) {
  const itemLabel = entityType === "task" ? "tasks" : "projects";
  
  return (
    <div className="px-3 sm:px-4 md:px-6 py-2 w-full flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-2">
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          <span className="truncate">{itemCount} {itemLabel}</span>
          <span className="hidden sm:inline mx-1.5">•</span>
          <span className="hidden sm:inline truncate">Click a row to open</span>
        </div>
        
        {filters.length > 0 && onRemoveFilter && (
          <>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <FilterSummary 
              filters={filters} 
              members={members}
              onRemoveFilter={onRemoveFilter}
              onRemoveCategory={onRemoveCategory}
            />
          </>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <ProjectFilter 
          filters={filters} 
          members={members} 
          projects={projects}
          onFiltersChange={onFiltersChange}
          entityType={entityType}
        />
      </div>
    </div>
  );
}

// ============================================================================
// ProjectListHeader (Combined)
// ============================================================================

export interface ProjectListHeaderProps {
  itemCount: number;
  title?: string;
  members?: MemberOption[];
  projects?: Array<{ value: string; label: string }>;
  filters?: FilterValue[];
  onAddProject?: () => void;
  onFiltersChange?: (filters: FilterValue[]) => void;
  onRemoveFilter?: (category: FilterCategory, value: string | Date) => void;
  onRemoveCategory?: (category: FilterCategory) => void;
  entityType?: EntityType;
  /** Whether to show project filter in task view (only relevant for all-tasks) */
  showProjectFilter?: boolean;
}

/**
 * Header section for the list page (projects or tasks).
 * Contains the navbar with title/actions and the filter bar.
 */
export function ProjectListHeader({
  itemCount,
  title,
  members,
  projects,
  filters,
  onAddProject,
  onFiltersChange,
  onRemoveFilter,
  onRemoveCategory,
  entityType = "project",
  showProjectFilter = true,
}: ProjectListHeaderProps) {
  // Only pass projects for filter when showProjectFilter is true
  const filterProjects = showProjectFilter ? projects : [];
  
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <ProjectNavbar title={title} onAddProject={onAddProject} entityType={entityType} />
      <Separator className="bg-border/60" />
      <ProjectFilterBar
        itemCount={itemCount}
        members={members}
        projects={filterProjects}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onRemoveFilter={onRemoveFilter}
        onRemoveCategory={onRemoveCategory}
        entityType={entityType}
      />
      <Separator className="bg-border/60" />
    </div>
  );
}
