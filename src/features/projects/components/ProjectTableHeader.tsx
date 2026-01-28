import { 
  GRID_MD, 
  GRID_LG, 
  TASK_GRID_WITH_PROJECT, 
  TASK_GRID_WITHOUT_PROJECT,
  type EntityType,
} from "./projects.types";

interface ProjectTableHeaderProps {
  entityType?: EntityType;
  /** Whether to show project column (for all-tasks view) */
  showProjectColumn?: boolean;
}

/**
 * Column headers for the table.
 * Adapts columns based on entity type and route context.
 * 
 * Project columns: [Name] [Priority] [Lead] [Target] [Status (lg)]
 * Task columns (project context): [Title] [Assignees] [Status] [Priority] [Target]
 * Task columns (all-tasks): [Title] [Project] [Assignees] [Status] [Priority] [Target]
 */
export function ProjectTableHeader({ 
  entityType = "project",
  showProjectColumn = false,
}: ProjectTableHeaderProps) {
  const isTask = entityType === "task";
  
  // Determine grid class
  const gridClass = isTask 
    ? (showProjectColumn ? TASK_GRID_WITH_PROJECT : TASK_GRID_WITHOUT_PROJECT)
    : GRID_MD + " " + GRID_LG;
  
  return (
    <div
      className={
        "grid " + gridClass +
        " items-center px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/70 bg-muted/20"
      }
    >
      {/* Name/Title Column */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="truncate">{isTask ? "Task" : "Project"}</span>
      </div>

      {isTask ? (
        <>
          {/* Project Column (only in all-tasks view) */}
          {showProjectColumn && (
            <div className="hidden md:flex items-center">Project</div>
          )}
          <div className="hidden md:flex items-center">Assignees</div>
          <div className="hidden md:flex items-center">Status</div>
          <div className="hidden md:flex items-center">Priority</div>
          <div className="hidden md:flex items-center">Target</div>
        </>
      ) : (
        <>
          <div className="hidden md:flex items-center">Priority</div>
          <div className="hidden md:flex items-center">Lead</div>
          <div className="hidden md:flex items-center">Target</div>
          <div className="hidden lg:flex items-center">Status</div>
        </>
      )}
    </div>
  );
}
