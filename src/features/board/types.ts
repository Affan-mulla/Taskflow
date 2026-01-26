import type { ProjectStatus, ProjectPriority } from "@/features/projects/components/projects.types";

export type BoardItemStatus = ProjectStatus;
export type BoardItemPriority = ProjectPriority;

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
  id: BoardItemStatus;
  title: string;
}
