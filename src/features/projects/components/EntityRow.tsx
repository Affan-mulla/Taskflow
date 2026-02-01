import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar02Icon,
  Folder01Icon,
  UserIcon,
  Task01FreeIcons,
} from "@hugeicons/core-free-icons";
import type { Project, Task } from "@/shared/types/db";
import {
  GRID_MD,
  GRID_LG,
  TASK_GRID_WITH_PROJECT,
  TASK_GRID_WITHOUT_PROJECT,
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  TASK_STATUS_OPTIONS,
  type ProjectPriority,
  type ProjectStatus,
  type MemberOption,
  type EntityType,
} from "./projects.types";
import { formatDate } from "./projects.utils";
import { useEntityInlineEdit } from "./useEntityInlineEdit";
import {
  InlineStatusSelect,
  InlinePrioritySelect,
  InlineLeadSelect,
  InlineTargetDate,
  InlineAssigneeSelect,
  InlineProjectSelect,
} from "./inline";
import Avatar from "@/components/Common/AvatarImage";
 

// ============================================================================
// Types
// ============================================================================

interface EntityRowProps {
  /** The entity to display */
  entity: Project | Task;
  /** Type of entity */
  entityType: EntityType;
  /** Project name (only for tasks) */
  projectName?: string;
  /** Whether to show project column (for all-tasks view) */
  showProjectColumn?: boolean;
  /** Click handler */
  onClick?: (entity: Project | Task) => void;
}

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
  entityType,
  compact,
}: {
  status: string;
  entityType: EntityType;
  compact?: boolean;
}) {
  const config = entityType === "project" 
    ? STATUS_CONFIG[status as ProjectStatus]
    : TASK_STATUS_OPTIONS.find(o => o.value === status);
  
  if (!config) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
      <HugeiconsIcon icon={config.icon} strokeWidth={2} className="size-4" />
      {!compact && <span className="text-xs font-medium">{config.label}</span>}
    </span>
  );
}

// ============================================================================
// EntityRow Component
// ============================================================================

/**
 * Unified row component for both projects and tasks.
 * Renders appropriate columns and inline editors based on entity type.
 * 
 * Columns:
 * - Project: [Name] [Priority] [Lead] [Target] [Status]
 * - Task (project context): [Title] [Assignees] [Status] [Priority] [Target]
 * - Task (all tasks): [Title] [Project] [Assignees] [Status] [Priority] [Target]
 */
export function EntityRow({ 
  entity, 
  entityType, 
  projectName,
  showProjectColumn = false,
  onClick,
}: EntityRowProps) {
  const {
    localEntity,
    membersOptions,
    currentLead,
    assigneeMembers,
    projectOptions,
    handlers,
  } = useEntityInlineEdit(entity as any, entityType, showProjectColumn);

  const isProject = entityType === "project";
  const isTask = entityType === "task";

  // Determine grid class based on entity type
  const gridClass = isProject 
    ? GRID_MD + " " + GRID_LG
    : showProjectColumn 
      ? TASK_GRID_WITH_PROJECT 
      : TASK_GRID_WITHOUT_PROJECT;

  // Get display values
  const name = isProject 
    ? (localEntity as Project).name 
    : (localEntity as Task).title;
  
  const summary = isTask ? (localEntity as Task).summary : undefined;
  
  // Note: created date formatting removed (unused) to avoid lint warnings

  return (
    <div
      className={
        "group w-full text-left grid " +
        gridClass +
        " items-center px-3 py-2.5 transition-colors hover:bg-accent/30 cursor-pointer"
      }
      onClick={() => onClick?.(localEntity)}
      role="button"
      tabIndex={0}
    >
      {/* Name/Title Column */}
      <div className="flex items-start md:items-center gap-3 min-w-0">
        <div className="shrink-0 size-7 rounded-md bg-background/40 ring-1 ring-border/50 grid place-items-center mt-0.5 md:mt-0">
          <HugeiconsIcon
            icon={isProject ? Folder01Icon : Task01FreeIcons}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground cursor-pointer hover:text-primary">
            {name}
          </div>
          
          {/* Task summary */}
          {summary && (
            <div className="hidden md:block text-xs text-muted-foreground truncate mt-0.5">
              {summary}
            </div>
          )}

          {/* Mobile-only summary */}
          <MobileRow
            entity={localEntity}
            entityType={entityType}
            currentLead={currentLead || null}
            assigneeMembers={assigneeMembers}
            projectName={projectName}
          />
        </div>
      </div>

      {/* Project Column (Tasks in all-tasks view only) */}
      {isTask && showProjectColumn && (
        <div className="hidden md:flex items-center">
          <InlineProjectSelect
          value={(localEntity as Task).projectId}
            projects={projectOptions}
            onChange={(handlers as any).onProjectChange}
          />
        </div>
      )}

      {/* Priority Column (Projects only - desktop) */}
      {isProject && (
        <div className="hidden md:flex items-center">
          <InlinePrioritySelect
            value={(localEntity as Project).priority}
            onChange={(handlers as any).onPriorityChange}
          />
        </div>
      )}

      {/* Lead Column (Projects) / Assignees Column (Tasks) */}
      <div className="hidden md:flex items-center gap-2 min-w-0">
        {isProject ? (
          <InlineLeadSelect
            value={currentLead?.value}
            onChange={(handlers as any).onLeadChange}
            members={membersOptions}
          />
        ) : (
          <InlineAssigneeSelect
            value={(localEntity as Task).assignees || []}
            onChange={(handlers as any).onAssigneesChange}
            members={membersOptions}
            
          />
        )}
      </div>

      {/* Target Date (Projects) / Status (Tasks) */}
      {isProject ? (
        <div className="hidden md:flex items-center gap-2 min-w-0">
          <InlineTargetDate
            value={(localEntity as Project).targetDate}
            onChange={(handlers as any).onTargetDateChange}
          />
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-2">
          <InlineStatusSelect
            value={(localEntity as Task).status}
            onChange={(handlers as any).onStatusChange}
            entityType="task"
          />
        </div>
      )}

      {/* Status (Projects - lg only) / Priority (Tasks) */}
      {isProject ? (
        <div className="hidden lg:flex items-center gap-2">
          <InlineStatusSelect
            value={(localEntity as Project).status}
            onChange={(handlers as any).onStatusChange}
            entityType="project"
          />
        </div>
      ) : (
        <div className="hidden md:flex items-center">
          <InlinePrioritySelect
            value={(localEntity as Task).priority}
            onChange={(handlers as any).onPriorityChange}
          />
        </div>
      )}

      {/* Target Date (Tasks only) */}
      {isTask && (
        <div className="hidden md:flex items-center gap-2 min-w-0">
          <InlineTargetDate
            value={(localEntity as Task).targetDate as any}
            onChange={(handlers as any).onTargetDateChange}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Mobile Row Component
// ============================================================================

interface MobileRowProps {
  entity: Project | Task;
  entityType: EntityType;
  currentLead: MemberOption | null;
  assigneeMembers: MemberOption[];
  projectName?: string;
}

function MobileRow({
  entity,
  entityType,
  currentLead,
  assigneeMembers,
  projectName,
}: MobileRowProps) {
  const isProject = entityType === "project";
  const targetDate = (entity as Project).targetDate;

  return (
    <div className="md:hidden mt-1.5 flex flex-col gap-y-2 border-l-2 border-transparent px-1">
      {/* 1. Context Row: Project Name (Tasks only) */}
      {!isProject && projectName && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/80">
          <HugeiconsIcon icon={Folder01Icon} className="size-3 opacity-70" />
          <span className="truncate uppercase tracking-wider">{projectName}</span>
        </div>
      )}

      {/* 2. Metadata Row: Status, Priority, Assignees, Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Status Indicator */}
          <StatusIndicator
            status={entity.status as string}
            entityType={entityType}
          />

          {/* Priority */}
          <PriorityPill
            priority={entity.priority as ProjectPriority}
            compact
          />

          <span className="text-muted-foreground/30 text-[10px]">|</span>

          {/* Lead/Assignees */}
          <div className="flex items-center">
            {isProject ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-4.5 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden">
                  {currentLead?.avatarUrl ? (
                    <img src={currentLead.avatarUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <HugeiconsIcon icon={UserIcon} className="size-2.5" />
                  )}
                </div>
                <span className="truncate max-w-[80px] text-[11px]">{currentLead?.label ?? "No lead"}</span>
              </div>
            ) : (
              <div className="flex items-center -space-x-1.5">
                {assigneeMembers.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground/60 italic">Unassigned</span>
                ) : (
                  <>
                    {assigneeMembers.slice(0, 3).map((member) => (
                      <Avatar
                        key={member.value}
                        src={member.avatarUrl}
                        fallbackText={member.label.charAt(0)}
                        className="size-5 ring-[1.5px] ring-background shadow-sm"
                      />
                    ))}
                    {assigneeMembers.length > 3 && (
                      <div className="size-5 rounded-full bg-secondary text-[9px] font-bold flex items-center justify-center ring-[1.5px] ring-background text-secondary-foreground">
                        +{assigneeMembers.length - 3}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date Section */}
        {targetDate && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground whitespace-nowrap bg-muted/40 px-1.5 py-0.5 rounded">
            <HugeiconsIcon icon={Calendar02Icon} className="size-3 opacity-70" />
            {formatDate(targetDate)}
          </div>
        )}
      </div>
    </div>
  );
}
