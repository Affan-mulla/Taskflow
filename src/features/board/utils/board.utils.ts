import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  type MemberOption,
} from "@/features/projects/components/projects.types";
import type { BoardColumnConfig, BoardItem, BoardViewMode, BoardEntityType } from "../types";
import {
  UserIcon,
  TaskDaily01Icon,
  Progress03FreeIcons,
  View,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Archive02Icon,
} from "@hugeicons/core-free-icons";
import type { Issue, IssueStatus } from "@/shared/types/db";

// ============================================================================
// Task Status Configuration
// ============================================================================

/** Task status options (different from project status) */
export const TASK_STATUS_OPTIONS = [
  { value: "backlog", label: "Backlog", icon: Archive02Icon },
  { value: "todo", label: "To Do", icon: TaskDaily01Icon },
  { value: "in-progress", label: "In Progress", icon: Progress03FreeIcons },
  { value: "in-review", label: "In Review", icon: View },
  { value: "done", label: "Done", icon: CheckmarkCircle01Icon },
  { value: "cancelled", label: "Cancelled", icon: CancelCircleIcon },
];

export const TASK_STATUS_CONFIG: Record<IssueStatus, { label: string; icon: any }> = {
  backlog: { label: "Backlog", icon: Archive02Icon },
  todo: { label: "To Do", icon: TaskDaily01Icon },
  "in-progress": { label: "In Progress", icon: Progress03FreeIcons },
  "in-review": { label: "In Review", icon: View },
  done: { label: "Done", icon: CheckmarkCircle01Icon },
  cancelled: { label: "Cancelled", icon: CancelCircleIcon },
};

// ============================================================================
// Column Configurations
// ============================================================================

/**
 * Status-based columns configuration (for projects)
 */
export const STATUS_COLUMNS: BoardColumnConfig[] = STATUS_OPTIONS.map((option) => ({
  id: option.value,
  title: option.label,
  icon: option.icon,
}));

/**
 * Task status-based columns configuration
 */
export const TASK_STATUS_COLUMNS: BoardColumnConfig[] = TASK_STATUS_OPTIONS.map((option) => ({
  id: option.value,
  title: option.label,
  icon: option.icon,
}));

/**
 * Priority-based columns configuration
 */
export const PRIORITY_COLUMNS: BoardColumnConfig[] = PRIORITY_OPTIONS.map((option) => ({
  id: option.value,
  title: option.label,
  icon: option.icon,
}));

/**
 * Generates lead-based columns from workspace members (for projects)
 */
export function generateLeadColumns(members: MemberOption[]): BoardColumnConfig[] {
  const unassigned: BoardColumnConfig = {
    id: "unassigned",
    title: "Unassigned",
    icon: UserIcon,
  };

  const memberColumns: BoardColumnConfig[] = members.map((member) => ({
    id: member.value,
    title: member.label,
    icon: UserIcon,
  }));

  return [unassigned, ...memberColumns];
}

/**
 * Generates assignee-based columns from workspace members (for tasks)
 * Same structure as lead columns, but semantically different
 */
export function generateAssigneeColumns(members: MemberOption[]): BoardColumnConfig[] {
  return generateLeadColumns(members);
}

// ============================================================================
// Column Config Getters
// ============================================================================

/**
 * Gets the column configuration based on view mode and entity type
 */
export function getColumnsForViewMode(
  viewMode: BoardViewMode,
  members: MemberOption[] = [],
  entityType: BoardEntityType = "project"
): BoardColumnConfig[] {
  switch (viewMode) {
    case "status":
      return entityType === "task" ? TASK_STATUS_COLUMNS : STATUS_COLUMNS;
    case "priority":
      return PRIORITY_COLUMNS;
    case "lead":
      return generateLeadColumns(members);
    case "assignee":
      return generateAssigneeColumns(members);
    default:
      return PRIORITY_COLUMNS;
  }
}

/**
 * Gets the icon and color config for a column based on view mode
 */
export function getColumnDisplayConfig(
  viewMode: BoardViewMode,
  columnId: string,
  members: MemberOption[] = [],
  entityType: BoardEntityType = "project"
): { icon?: any; color?: string; avatarUrl?: string } {
  switch (viewMode) {
    case "status": {
      // Use task status config for tasks
      if (entityType === "task") {
        const config = TASK_STATUS_CONFIG[columnId as keyof typeof TASK_STATUS_CONFIG];
        return config ? { icon: config.icon } : {};
      }
      const config = STATUS_CONFIG[columnId as keyof typeof STATUS_CONFIG];
      return config ? { icon: config.icon } : {};
    }
    case "priority": {
      const config = PRIORITY_CONFIG[columnId as keyof typeof PRIORITY_CONFIG];
      return config ? { icon: config.icon } : {};
    }
    case "lead":
    case "assignee": {
      if (columnId === "unassigned") {
        return { icon: UserIcon };
      }
      const member = members.find((m) => m.value === columnId);
      return member ? { icon: UserIcon, avatarUrl: member.avatarUrl } : { icon: UserIcon };
    }
    default:
      return {};
  }
}

// ============================================================================
// Grouping Functions
// ============================================================================

type GroupedItems = Record<string, BoardItem[]>;

/**
 * Groups items by their status (for projects)
 */
export function groupByStatus(items: BoardItem[]): GroupedItems {
  const groups: GroupedItems = {
    planned: [],
    "in-progress": [],
    completed: [],
    cancelled: [],
  };

  items.forEach((item) => {
    if (groups[item.status]) {
      groups[item.status].push(item);
    }
  });

  return groups;
}

/**
 * Groups items by their priority
 */
export function groupByPriority(items: BoardItem[]): GroupedItems {
  const groups: GroupedItems = {
    "no-priority": [],
    urgent: [],
    high: [],
    medium: [],
    low: [],
  };

  items.forEach((item) => {
    if (groups[item.priority]) {
      groups[item.priority].push(item);
    }
  });

  return groups;
}

/**
 * Groups items by their lead assignment
 */
export function groupByLead(items: BoardItem[], members: MemberOption[]): GroupedItems {
  const groups: GroupedItems = {
    unassigned: [],
  };

  // Initialize groups for each member
  members.forEach((member) => {
    groups[member.value] = [];
  });

  items.forEach((item) => {
    const leadId = item.lead || "unassigned";
    if (groups[leadId]) {
      groups[leadId].push(item);
    } else {
      // If lead doesn't exist in members list, put in unassigned
      groups.unassigned.push(item);
    }
  });

  return groups;
}

/**
 * Groups items by task status (backlog, todo, in-progress, in-review, done, cancelled)
 */
export function groupByTaskStatus(items: BoardItem[]): GroupedItems {
  const groups: GroupedItems = {
    backlog: [],
    todo: [],
    "in-progress": [],
    "in-review": [],
    done: [],
    cancelled: [],
  };

  items.forEach((item) => {
    if (groups[item.status]) {
      groups[item.status].push(item);
    }
  });

  return groups;
}

/**
 * Groups items by their assignees.
 * Multi-assignee items appear in multiple columns.
 */
export function groupByAssignees(items: BoardItem[], members: MemberOption[]): GroupedItems {
  const groups: GroupedItems = {
    unassigned: [],
  };

  // Initialize groups for each member
  members.forEach((member) => {
    groups[member.value] = [];
  });

  items.forEach((item) => {
    const assignees = item.assignees || [];
    
    if (assignees.length === 0) {
      // No assignees - put in unassigned
      groups.unassigned.push(item);
    } else {
      // Multi-assignee: item appears in each assignee's column
      assignees.forEach((assigneeId) => {
        if (groups[assigneeId]) {
          groups[assigneeId].push(item);
        } else {
          // Assignee not in members list - put in unassigned
          if (!groups.unassigned.includes(item)) {
            groups.unassigned.push(item);
          }
        }
      });
    }
  });

  return groups;
}

/**
 * Groups items based on the view mode and entity type
 */
export function groupItemsByViewMode(
  items: BoardItem[],
  viewMode: BoardViewMode,
  members: MemberOption[] = [],
  entityType: BoardEntityType = "project"
): GroupedItems {
  switch (viewMode) {
    case "status":
      return entityType === "task" ? groupByTaskStatus(items) : groupByStatus(items);
    case "priority":
      return groupByPriority(items);
    case "lead":
      return groupByLead(items, members);
    case "assignee":
      return groupByAssignees(items, members);
    default:
      return groupByPriority(items);
  }
}

/**
 * Gets the field key for the current view mode
 */
export function getGroupKeyField(viewMode: BoardViewMode): keyof BoardItem {
  switch (viewMode) {
    case "status":
      return "status";
    case "priority":
      return "priority";
    case "lead":
      return "lead";
    case "assignee":
      return "assignees";
    default:
      return "priority";
  }
}

// ============================================================================
// Entity Adapters
// ============================================================================

/**
 * Transforms a Task/Issue into a BoardItem
 */
export function taskToBoardItem(task: Issue & { assignees?: string[] }): BoardItem {
  return {
    id: task.id ?? "",
    title: task.title,
    status: task.status || "backlog",
    priority: task.priority || "no-priority",
    // Support both assigneeId (single) and assignees (multiple)
    assignees: task.assignees ?? (task.assigneeId ? [task.assigneeId] : []),
    summary: task.description,
  };
}
