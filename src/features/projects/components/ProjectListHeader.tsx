import AddProject from "@/components/Common/AddProject";
import { ProjectFilter, FilterSummary } from "./ProjectFilter";
import type { FilterValue, FilterCategory } from "./ProjectFilter";
import type { MemberOption } from "./projects.types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CubeIcon,
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

function ProjectNavbar({ projectName }: ProjectNavbarProps) {
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
  members?: MemberOption[];
  filters?: FilterValue[];
  onFiltersChange?: (filters: FilterValue[]) => void;
  onRemoveFilter?: (category: FilterCategory, value: string | Date) => void;
  onRemoveCategory?: (category: FilterCategory) => void;
}

function ProjectFilterBar({ 
  projectCount, 
  members = [],
  filters = [],
  onFiltersChange,
  onRemoveFilter,
  onRemoveCategory,
}: ProjectFilterBarProps) {
  return (
    <div className="px-3 sm:px-4 md:px-6 py-2 w-full flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-2">
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          <span className="truncate">{projectCount} projects</span>
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
        <ProjectFilter filters={filters} members={members} onFiltersChange={onFiltersChange}/>
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
  members?: MemberOption[];
  filters?: FilterValue[];
  onAddProject?: () => void;
  onFiltersChange?: (filters: FilterValue[]) => void;
  onRemoveFilter?: (category: FilterCategory, value: string | Date) => void;
  onRemoveCategory?: (category: FilterCategory) => void;
}

/**
 * Header section for the project list page.
 * Contains the navbar with title/actions and the filter bar.
 */
export function ProjectListHeader({
  projectCount,
  projectName,
  members,
  filters,
  onAddProject,
  onFiltersChange,
  onRemoveFilter,
  onRemoveCategory,
}: ProjectListHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <ProjectNavbar projectName={projectName} onAddProject={onAddProject} />
      <Separator className="bg-border/60" />
      <ProjectFilterBar
        projectCount={projectCount}
        members={members}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onRemoveFilter={onRemoveFilter}
        onRemoveCategory={onRemoveCategory}
      />
      <Separator className="bg-border/60" />
    </div>
  );
}
