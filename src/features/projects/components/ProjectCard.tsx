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
 * Displays all fields in a compact card layout.
 */
export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { localProject, membersOptions, currentLead, handlers } = useProjectInlineEdit(project);

  return (
    <div
      className="w-full text-left rounded-lg bg-muted/10 ring-1 ring-border/50 px-3 py-3 transition-colors hover:bg-accent/25"
      onClick={() => onClick?.(localProject)}
      role="button"
      tabIndex={0}
    >
      {/* Header row: Project name + Status badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="shrink-0 size-7 rounded-md bg-background/40 ring-1 ring-border/50 grid place-items-center">
              <HugeiconsIcon
                icon={Folder01Icon}
                strokeWidth={2}
                className="size-4 text-muted-foreground"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground cursor-pointer hover:text-primary">
                {localProject.name}
              </div>
              {/* Priority & Status inline selects */}
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <InlinePrioritySelect
                  value={localProject.priority}
                  onChange={handlers.onPriorityChange}
                />
                <InlineStatusSelect
                  value={localProject.status}
                  onChange={handlers.onStatusChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status badge (top right) */}
        <div className="shrink-0">
          <InlineStatusSelect
            value={localProject.status}
            onChange={handlers.onStatusChange}
          />
        </div>
      </div>

      {/* Footer row: Lead & Target date */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 min-w-0">
          <InlineLeadSelect
            value={currentLead?.value}
            onChange={handlers.onLeadChange}
            members={membersOptions}
          />
        </div>
        <div className="flex items-center justify-end gap-2 min-w-0">
          <InlineTargetDate
            value={localProject.targetDate}
            onChange={handlers.onTargetDateChange}
          />
        </div>
      </div>
    </div>
  );
}
