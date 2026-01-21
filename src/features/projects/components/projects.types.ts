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
} from "@hugeicons/core-free-icons";

// ============================================================================
// Types
// ============================================================================

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

/** Status options for inline editing */
export const STATUS_OPTIONS: MenuOption[] = [
  { value: "planned", label: "Planned", icon: Progress01FreeIcons },
  { value: "in-progress", label: "In Progress", icon: Progress03Icon },
  { value: "completed", label: "Completed", icon: CheckmarkCircle01Icon },
  { value: "cancelled", label: "Cancelled", icon: CancelCircleIcon },
];

/** Priority options for inline editing */
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
