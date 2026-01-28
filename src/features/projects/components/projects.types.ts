import {
  AlertSquareIcon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  DashedLine01Icon,
  FullSignalIcon,
  LowSignalIcon,
  MediumSignalIcon,
  Progress01FreeIcons,
  Progress03Icon,
  TaskDaily01Icon,
  View,
  Circle,
} from "@hugeicons/core-free-icons";

// ============================================================================
// Types
// ============================================================================

export type EntityType = "project" | "task";

export type ProjectPriority = "no-priority" | "urgent" | "high" | "medium" | "low";
export type ProjectStatus = "planned" | "in-progress" | "completed" | "cancelled";

export interface MemberOption {
  value: string;
  label: string;
  icon: any;
  avatarUrl?: string;
  email: string;
}

export interface MenuOption {
  value: string;
  label: string;
  icon: any;
  color?: string;
}

// ============================================================================
// Constants
// ============================================================================

/** Grid column template for medium screens (tablet) */
export const GRID_MD = "md:grid-cols-[minmax(0,2.6fr)_160px_180px_170px]";

/** Grid column template for large screens (desktop) */
export const GRID_LG = "lg:grid-cols-[minmax(0,2.6fr)_160px_180px_170px_140px]";

/** Task grid: [Task] [Project?] [Assignees] [Status] [Priority] [Target] */
export const TASK_GRID_WITH_PROJECT = "md:grid-cols-[minmax(200px,1.5fr)_minmax(120px,1.5fr)_minmax(100px,auto)_minmax(100px,auto)_minmax(100px,auto)_minmax(100px,.5fr)]";
export const TASK_GRID_WITHOUT_PROJECT = "md:grid-cols-[minmax(200px,2fr)_minmax(100px,auto)_minmax(100px,auto)_minmax(100px,auto)_minmax(100px,auto)]";

/** Status options for project inline editing */
export const STATUS_OPTIONS: MenuOption[] = [
  { value: "planned", label: "Planned", icon: Progress01FreeIcons },
  { value: "in-progress", label: "In Progress", icon: Progress03Icon },
  { value: "completed", label: "Completed", icon: CheckmarkCircle01Icon },
  { value: "cancelled", label: "Cancelled", icon: CancelCircleIcon },
];

/** Status options for task inline editing */
export const TASK_STATUS_OPTIONS: MenuOption[] = [
  { value: "backlog", label: "Backlog", icon: Circle },
  { value: "todo", label: "To Do", icon: TaskDaily01Icon },
  { value: "in-progress", label: "In Progress", icon: Progress03Icon },
  { value: "in-review", label: "In Review", icon: View },
  { value: "done", label: "Done", icon: CheckmarkCircle01Icon },
  { value: "cancelled", label: "Cancelled", icon: CancelCircleIcon },
];

/** Priority options for inline editing (shared by projects and tasks) */
export const PRIORITY_OPTIONS: MenuOption[] = [
  {value: "no-priority", label: "No Priority", icon: DashedLine01Icon},
  { value: "urgent", label: "Urgent", icon: AlertSquareIcon },
  { value: "high", label: "High", icon: FullSignalIcon },
  { value: "medium", label: "Medium", icon: MediumSignalIcon },
  { value: "low", label: "Low", icon: LowSignalIcon },
];

/** Priority config for display pills */
export const PRIORITY_CONFIG: Record<ProjectPriority, { label: string; icon: any }> = {
  "no-priority": { label: "No Priority", icon: DashedLine01Icon },
  urgent: { label: "Urgent", icon: AlertSquareIcon },
  high: { label: "High", icon: FullSignalIcon },
  medium: { label: "Medium", icon: MediumSignalIcon },
  low: { label: "Low", icon: LowSignalIcon },
};

/** Status config for display indicators */
export const STATUS_CONFIG: Record<ProjectStatus, { label: string; icon: any }> = {
  planned: { label: "Planned", icon: Progress01FreeIcons },
  "in-progress": { label: "In Progress", icon: Progress03Icon },
  completed: { label: "Completed", icon: CheckmarkCircle01Icon },
  cancelled: { label: "Cancelled", icon: CancelCircleIcon },
};
