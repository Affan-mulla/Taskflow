import type { ProjectStatus, ProjectPriority, MenuOption } from "@/features/projects/components/projects.types";
import type { IssueStatus, IssuePriority } from "@/shared/types/db";

// ============================================================================
// Entity Types
// ============================================================================

/** The type of entity the board is displaying */
export type BoardEntityType = "project" | "task";

// ============================================================================
// Status & Priority Types
// ============================================================================

export type BoardItemStatus = ProjectStatus | IssueStatus;
export type BoardItemPriority = ProjectPriority | IssuePriority;

// View mode types for the Kanban board
// "lead" is for projects, "assignee" is for tasks
export type BoardViewMode = "status" | "priority" | "lead" | "assignee";

// ============================================================================
// Board Item (Unified Entity)
// ============================================================================

export interface BoardItem {
  id: string;
  title: string;
  status: BoardItemStatus;
  priority: BoardItemPriority;
  /** For projects: single lead user */
  lead?: string;
  /** For tasks: multiple assignees */
  assignees?: string[];
  targetDate?: string;
  summary?: string;
}

// ============================================================================
// Column Configuration
// ============================================================================

export interface BoardColumnConfig {
  id: string;
  title: string;
  icon?: MenuOption["icon"];
  color?: string;
}
