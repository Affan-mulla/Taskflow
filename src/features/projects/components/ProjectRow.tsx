import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar02Icon,
  Folder01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { Project } from "@/shared/types/db";
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  type ProjectPriority,
  type ProjectStatus,
  type MemberOption,
  GRID_MD,
  GRID_LG,
} from "./projects.types";
import { formatDate } from "./projects.utils";
import { useProjectInlineEdit } from "./useProjectInlineEdit";
import {
  InlineStatusSelect,
  InlinePrioritySelect,
  InlineLeadSelect,
  InlineTargetDate,
} from "./inline";

// ============================================================================
// Display Components (for mobile summary row)
// ============================================================================

function PriorityPill({
  priority,
  compact,
}: {
  priority: ProjectPriority;
  compact?: boolean;
}) {
  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
      <HugeiconsIcon icon={config.icon} strokeWidth={2} className="size-4" />
      {!compact && <span className="text-xs font-medium">{config.label}</span>}
    </span>
  );
}

function StatusIndicator({
  status,
  compact,
}: {
  status: ProjectStatus;
  compact?: boolean;
}) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
      <HugeiconsIcon icon={config.icon} strokeWidth={2} className="size-4" />
      {!compact && <span className="text-xs font-medium">{config.label}</span>}
    </span>
  );
}

// ============================================================================
// ProjectRow
// ============================================================================

interface ProjectRowProps {
  project: Project;
  onClick?: (project: Project) => void;
}

/**
 * Desktop/tablet project row with inline editing.
 * Uses CSS Grid for column alignment.
 */
export function ProjectRow({ project, onClick }: ProjectRowProps) {
  const { localProject, membersOptions, currentLead, handlers } =
    useProjectInlineEdit(project);

  return (
    <div
      className={
        "group w-full text-left grid " +
        GRID_MD +
        " " +
        GRID_LG +
        " items-center px-3 py-2.5 transition-colors hover:bg-accent/30"
      }
      onClick={() => onClick?.(localProject)}
      role="button"
      tabIndex={0}
    >
      {/* Project Name & Icon */}
      <div className="flex items-start md:items-center gap-3 min-w-0">
        <div className="shrink-0 size-7 rounded-md bg-background/40 ring-1 ring-border/50 grid place-items-center mt-0.5 md:mt-0">
          <HugeiconsIcon
            icon={Folder01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground cursor-pointer hover:text-primary">
            {localProject.name}
          </div>
          {/* Mobile-only summary */}
          <MobileRow
            localProject={localProject}
            currentLead={currentLead || null}
          />
        </div>
      </div>

      {/* Priority (hidden on mobile) */}
      <div className="hidden md:flex items-center">
        <InlinePrioritySelect
          value={localProject.priority}
          onChange={handlers.onPriorityChange}
        />
      </div>

      {/* Lead (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-2 min-w-0">
        <InlineLeadSelect
          value={currentLead?.value}
          onChange={handlers.onLeadChange}
          members={membersOptions}
        />
      </div>

      {/* Target Date (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-2 min-w-0">
        <InlineTargetDate
          value={localProject.targetDate}
          onChange={handlers.onTargetDateChange}
        />
      </div>

      {/* Status (hidden on tablet, shown on lg+) */}
      <div className="hidden lg:flex items-center gap-2">
        <InlineStatusSelect
          value={localProject.status}
          onChange={handlers.onStatusChange}
        />
      </div>
    </div>
  );
}

const MobileRow = ({
  localProject,
  currentLead,
}: {
  localProject: Project;
  currentLead: MemberOption | null;
}) => {
  return (
    <div className="md:hidden mt-2 space-y-2">
      {/* Status + Priority */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <StatusIndicator
          status={localProject.status as ProjectStatus}
        />
        <PriorityPill
          priority={localProject.priority as ProjectPriority}
          compact
        />
      </div>

      {/* Lead + Date */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
           <div className="size-4 rounded-full bg-muted flex items-center justify-center overflow-hidden">
             {currentLead?.avatarUrl ? (
               <img src={currentLead.avatarUrl} alt="" className="size-full object-cover" />
             ) : (
               <HugeiconsIcon icon={UserIcon} className="size-3" />
             )}
           </div>
          {currentLead?.label ?? "No lead"}
        </span>

        {localProject.targetDate && (
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={Calendar02Icon} className="size-3" />
            {formatDate(localProject.targetDate)}
          </span>
        )}
      </div>
    </div>
  );
};
