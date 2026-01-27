import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  type MemberOption,
} from "@/features/projects/components/projects.types";
import type { BoardColumnConfig, BoardItem, BoardViewMode } from "../types";
import { UserIcon } from "@hugeicons/core-free-icons";

// ============================================================================
// Column Configurations
// ============================================================================

/**
 * Status-based columns configuration
 */
export const STATUS_COLUMNS: BoardColumnConfig[] = STATUS_OPTIONS.map((option) => ({
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
 * Generates lead-based columns from workspace members
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

// ============================================================================
// Column Config Getters
// ============================================================================

/**
 * Gets the column configuration based on view mode
 */
export function getColumnsForViewMode(
  viewMode: BoardViewMode,
  members: MemberOption[] = []
): BoardColumnConfig[] {
  switch (viewMode) {
    case "status":
      return STATUS_COLUMNS;
    case "priority":
      return PRIORITY_COLUMNS;
    case "lead":
      return generateLeadColumns(members);
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
  members: MemberOption[] = []
): { icon?: any; color?: string; avatarUrl?: string } {
  switch (viewMode) {
    case "status": {
      const config = STATUS_CONFIG[columnId as keyof typeof STATUS_CONFIG];
      return config ? { icon: config.icon } : {};
    }
    case "priority": {
      const config = PRIORITY_CONFIG[columnId as keyof typeof PRIORITY_CONFIG];
      return config ? { icon: config.icon } : {};
    }
    case "lead": {
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
 * Groups items by their status
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
 * Groups items based on the view mode
 */
export function groupItemsByViewMode(
  items: BoardItem[],
  viewMode: BoardViewMode,
  members: MemberOption[] = []
): GroupedItems {
  switch (viewMode) {
    case "status":
      return groupByStatus(items);
    case "priority":
      return groupByPriority(items);
    case "lead":
      return groupByLead(items, members);
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
    default:
      return "priority";
  }
}
