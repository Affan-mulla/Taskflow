import { useState, useMemo, useCallback, useEffect } from "react";
import { UserIcon } from "@hugeicons/core-free-icons";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import type { Project, Task, IssueStatus, IssuePriority } from "@/shared/types/db";
import type { ProjectPriority, ProjectStatus, MemberOption, EntityType } from "./projects.types";
import { useUpdateProject } from "../hooks/useUpdateProject";
import { 
  updateTaskStatus, 
  updateTaskPriority, 
  updateTaskAssignees,
  updateTaskDates,
} from "@/db/tasks/tasks.update";

// ============================================================================
// Types
// ============================================================================

interface ProjectHandlers {
  onStatusChange: (value: string | null) => void;
  onPriorityChange: (value: string | null) => void;
  onLeadChange: (value: string | null) => void;
  onTargetDateChange: (date: Date | undefined) => void;
}

interface TaskHandlers {
  onStatusChange: (value: string | null) => void;
  onPriorityChange: (value: string | null) => void;
  onAssigneesChange: (value: string[]) => void;
  onTargetDateChange: (date: Date | undefined) => void;
  onProjectChange?: (value: string | null) => void;
}

interface UseEntityInlineEditReturn<T extends EntityType> {
  /** Local entity state with optimistic updates */
  localEntity: T extends "project" ? Project : Task;
  /** Workspace members formatted for ComboboxActionButton */
  membersOptions: MemberOption[];
  /** Projects formatted for inline select (tasks only) */
  projectOptions: Array<{ value: string; label: string }>;
  /** Currently selected lead member (projects only) */
  currentLead: MemberOption | undefined;
  /** Currently selected assignee members (tasks only) */
  assigneeMembers: MemberOption[];
  /** Loading state for any update operation */
  isUpdating: boolean;
  /** Handlers for inline field updates */
  handlers: T extends "project" ? ProjectHandlers : TaskHandlers;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Unified hook for managing inline entity editing state.
 * Works for both projects and tasks, providing appropriate handlers.
 * 
 * @param entity - The project or task to edit
 * @param entityType - Whether this is a "project" or "task"
 * @param showProjectColumn - Whether to show project column (for all-tasks view)
 */
export function useEntityInlineEdit<T extends EntityType>(
  entity: T extends "project" ? Project : Task,
  entityType: T,
  showProjectColumn = false
): UseEntityInlineEditReturn<T> {
  const [localEntity, setLocalEntity] = useState(entity);
  const { members: workspaceMembers, activeWorkspace, projects } = useWorkspaceStore();
  const { updatePriority, updateStatus, updateLead, updateTargetDate, loading } = useUpdateProject();

  // CRITICAL: Sync localEntity when prop changes (real-time updates from other users)
  useEffect(() => {
    setLocalEntity(entity);
  }, [entity]);

  // Transform workspace members for selectors
  const membersOptions = useMemo<MemberOption[]>(
    () =>
      workspaceMembers.map((member) => ({
        value: member.userId,
        label: member.userName,
        icon: UserIcon,
        avatarUrl: member.avatarUrl,
        email: member.email,
      })),
    [workspaceMembers]
  );

  // Transform projects for inline select (tasks only)
  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({
        value: project.id ?? "",
        label: project.name,
      })),
    [projects]
  );

  // Find current lead member (projects only)
  const currentLead = useMemo(() => {
    if (entityType !== "project") return undefined;
    const project = localEntity as Project;
    return membersOptions.find((m) => m.value === project.lead);
  }, [membersOptions, localEntity, entityType]);

  // Find current assignee members (tasks only)
  const assigneeMembers = useMemo(() => {
    if (entityType !== "task") return [];
    const task = localEntity as Task;
    return membersOptions.filter((m) => task.assignees?.includes(m.value));
  }, [membersOptions, localEntity, entityType]);

  // =========================================================================
  // Project Handlers
  // =========================================================================

  const onProjectStatusChange = useCallback(
    (newStatus: string | null) => {
      if (newStatus && (localEntity as Project).id) {
        setLocalEntity((prev) => ({ ...prev, status: newStatus as ProjectStatus }));
        updateStatus((localEntity as Project).id!, newStatus as ProjectStatus);
      }
    },
    [(localEntity as Project).id, updateStatus]
  );

  const onProjectPriorityChange = useCallback(
    (newPriority: string | null) => {
      if (newPriority && (localEntity as Project).id) {
        setLocalEntity((prev) => ({ ...prev, priority: newPriority as ProjectPriority }));
        updatePriority((localEntity as Project).id!, newPriority as ProjectPriority);
      }
    },
    [(localEntity as Project).id, updatePriority]
  );

  const onLeadChange = useCallback(
    (newLeadId: string | null) => {
      if (newLeadId && (localEntity as Project).id) {
        setLocalEntity((prev) => ({ ...prev, lead: newLeadId }));
        updateLead((localEntity as Project).id!, newLeadId);
      }
    },
    [(localEntity as Project).id, updateLead]
  );

  const onProjectTargetDateChange = useCallback(
    (newDate: Date | undefined) => {
      if ((localEntity as Project).id) {
        const isoDate = newDate?.toISOString();
        setLocalEntity((prev) => ({ ...prev, targetDate: isoDate }));
        updateTargetDate((localEntity as Project).id!, isoDate);
      }
    },
    [(localEntity as Project).id, updateTargetDate]
  );

  // =========================================================================
  // Task Handlers
  // =========================================================================

  const onTaskStatusChange = useCallback(
    (newStatus: string | null) => {
      const task = localEntity as Task;
      if (newStatus && task.id && activeWorkspace?.id) {
        setLocalEntity((prev) => ({ ...prev, status: newStatus as IssueStatus }));
        updateTaskStatus(activeWorkspace.id, task.projectId, task.id, newStatus as IssueStatus);
      }
    },
    [(localEntity as Task).id, (localEntity as Task).projectId, activeWorkspace?.id]
  );

  const onTaskPriorityChange = useCallback(
    (newPriority: string | null) => {
      const task = localEntity as Task;
      if (newPriority && task.id && activeWorkspace?.id) {
        setLocalEntity((prev) => ({ ...prev, priority: newPriority as IssuePriority }));
        updateTaskPriority(activeWorkspace.id, task.projectId, task.id, newPriority as IssuePriority);
      }
    },
    [(localEntity as Task).id, (localEntity as Task).projectId, activeWorkspace?.id]
  );

  const onAssigneesChange = useCallback(
    (newAssignees: string[]) => {
      const task = localEntity as Task;
      if (task.id && activeWorkspace?.id) {
        setLocalEntity((prev) => ({ ...prev, assignees: newAssignees }));
        updateTaskAssignees(activeWorkspace.id, task.projectId, task.id, newAssignees);
      }
    },
    [(localEntity as Task).id, (localEntity as Task).projectId, activeWorkspace?.id]
  );

  const onTaskTargetDateChange = useCallback(
    (newDate: Date | undefined) => {
      const task = localEntity as Task;
      if (task.id && activeWorkspace?.id) {
        setLocalEntity((prev) => ({ ...prev, targetDate: newDate ?? null }));
        updateTaskDates(activeWorkspace.id, task.projectId, task.id, { targetDate: newDate ?? null });
      }
    },
    [(localEntity as Task).id, (localEntity as Task).projectId, activeWorkspace?.id]
  );

  const onProjectChange = useCallback(
    (newProjectId: string | null) => {
      // Note: Changing a task's project is a complex operation
      // that requires moving the task document. For now, this is read-only display.
      // Implement full project move functionality if needed.
    },
    []
  );

  // =========================================================================
  // Return appropriate handlers based on entity type
  // =========================================================================

  const handlers = entityType === "project"
    ? {
        onStatusChange: onProjectStatusChange,
        onPriorityChange: onProjectPriorityChange,
        onLeadChange,
        onTargetDateChange: onProjectTargetDateChange,
      }
    : {
        onStatusChange: onTaskStatusChange,
        onPriorityChange: onTaskPriorityChange,
        onAssigneesChange,
        onTargetDateChange: onTaskTargetDateChange,
        ...(showProjectColumn && { onProjectChange }),
      };

  return {
    localEntity,
    membersOptions,
    projectOptions,
    currentLead,
    assigneeMembers,
    isUpdating: loading,
    handlers,
  } as UseEntityInlineEditReturn<T>;
}
