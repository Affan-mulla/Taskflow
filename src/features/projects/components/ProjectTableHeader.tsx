import { GRID_MD, GRID_LG } from "./projects.types";

/**
 * Column headers for the project table.
 * Desktop: shows all columns
 * Tablet (md): hides Status column
 */
export function ProjectTableHeader() {
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
}
