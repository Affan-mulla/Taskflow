import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import type { Project } from "@/shared/types/db";
import { useProjectInlineEdit } from "./useProjectInlineEdit";
import {
  InlineStatusSelect,
  InlinePrioritySelect,
  InlineLeadSelect,
  InlineTargetDate,
} from "./inline";

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
}

/**
 * Mobile project card with inline editing.
 * Optimized with Shadcn UI variables and mobile-first spacing.
 */
export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { localProject, membersOptions, currentLead, handlers } = useProjectInlineEdit(project);

  // Prevent card click when interacting with inline selects
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="group relative w-full text-left rounded-xl bg-card border border-border p-4 
                 transition-all duration-200 active:scale-[0.98] active:bg-accent/50
                 hover:border-ring/30 shadow-sm"
      onClick={() => onClick?.(localProject)}
      role="button"
      tabIndex={0}
    >
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="shrink-0 size-10 rounded-lg bg-secondary flex items-center justify-center border border-border">
          <HugeiconsIcon
            icon={Folder01Icon}
            strokeWidth={2}
            className="size-5 text-secondary-foreground"
          />
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-foreground tracking-tight">
            {localProject.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {localProject.summary || "No description provided."}
          </p>
        </div>
      </div>

      {/* Inline Editing Grid */}
      <div 
        className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-border/60"
        onClick={handleActionClick}
      >
        {/* Status & Priority Row */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 ml-1">
            Status
          </span>
          <InlineStatusSelect 
            value={localProject.status} 
            onChange={handlers.onStatusChange} 
          />
        </div>

        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 ml-1">
            Priority
          </span>
          <InlinePrioritySelect 
            value={localProject.priority} 
            onChange={handlers.onPriorityChange} 
          />
        </div>

        {/* Lead & Date Row */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 ml-1">
            Lead
          </span>
          <InlineLeadSelect
            value={currentLead?.value}
            onChange={handlers.onLeadChange}
            members={membersOptions}
          />
        </div>

        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mr-1">
            Target Date
          </span>
          <InlineTargetDate
            value={localProject.targetDate}
            onChange={handlers.onTargetDateChange}
          />
        </div>
      </div>
    </div>
  );
}