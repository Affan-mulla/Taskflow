import { GRID_MD, GRID_LG } from "./projects.types";

const SKELETON_ROWS = [1, 2, 3] as const;

// ============================================================================
// Desktop/Tablet Skeleton
// ============================================================================

/**
 * Skeleton loading state for the project table (desktop/tablet).
 * Matches the exact layout of ProjectTableHeader + ProjectRow.
 */
export function ProjectTableSkeleton() {
  return (
    <div className="rounded-lg bg-muted/10 ring-1 ring-border/50 overflow-hidden">
      {/* Header */}
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

      {/* Skeleton rows */}
      <div className="divide-y divide-border/40">
        {SKELETON_ROWS.map((i) => (
          <div
            key={i}
            className={"grid " + GRID_MD + " " + GRID_LG + " items-center px-3 py-2.5"}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 size-7 rounded-md bg-muted animate-pulse" />
              <div className="min-w-0 space-y-2 flex-1">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>
            <div className="hidden md:block h-4 bg-muted rounded animate-pulse w-20" />
            <div className="hidden md:block h-4 bg-muted rounded animate-pulse w-24" />
            <div className="hidden md:block h-4 bg-muted rounded animate-pulse w-28" />
            <div className="hidden lg:block h-4 bg-muted rounded animate-pulse w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Mobile Skeleton
// ============================================================================

/**
 * Skeleton loading state for project cards (mobile).
 * Matches the exact layout of ProjectCard.
 */
export function ProjectCardSkeleton() {
  return (
    <div className="space-y-2">
      {SKELETON_ROWS.map((i) => (
        <div
          key={i}
          className="w-full rounded-lg bg-muted/10 ring-1 ring-border/50 px-3 py-3"
        >
          <div className="flex items-center gap-2">
            <div className="shrink-0 size-7 rounded-md bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Combined Loading State
// ============================================================================

/**
 * Responsive skeleton that shows table on desktop and cards on mobile.
 */
export function ProjectListSkeleton() {
  return (
    <div className="w-full">
      {/* Desktop/Tablet */}
      <div className="hidden md:block">
        <ProjectTableSkeleton />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}
