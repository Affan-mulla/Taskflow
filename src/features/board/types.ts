import type { ProjectStatus, ProjectPriority, MenuOption } from "@/features/projects/components/projects.types";

export type BoardItemStatus = ProjectStatus;
export type BoardItemPriority = ProjectPriority;

// View mode types for the Kanban board
export type BoardViewMode = "status" | "priority" | "lead";

export interface BoardItem {
  id: string;
  title: string;
  status: BoardItemStatus;
  priority: BoardItemPriority;
  lead?: string;
  targetDate?: string;
  summary?: string;
}

export interface BoardColumnConfig {
  id: string;
  title: string;
  icon?: MenuOption["icon"];
  color?: string;
}
