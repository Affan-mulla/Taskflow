import { z } from "zod";
import type { IssuePriority, IssueStatus } from "@/shared/types/db";

/**
 * Zod schema for AddTask form validation
 * Note: Attachments are handled separately via local state (not in form)
 * because File objects can't be serialized in form state
 */
export const addTaskSchema = z.object({
  // Required field
  title: z
    .string()
    .min(2, "Task title must be at least 2 characters")
    .max(120, "Task title must be at most 120 characters"),

  // Required field - project context
  projectId: z.string().min(1, "Please select a project"),

  // Optional fields
  summary: z
    .string()
    .max(200, "Summary must be at most 200 characters")
    .optional()
    .transform((val) => val ?? ""),

  description: z
    .string()
    .optional()
    .transform((val) => val ?? ""),

  status: z
    .enum(["backlog", "todo", "in-progress", "in-review", "done", "cancelled"] as const)
    .optional()
    .transform((val) => val ?? "backlog"),

  priority: z
    .enum(["no-priority", "urgent", "high", "medium", "low"] as const)
    .optional()
    .transform((val) => val ?? "no-priority"),

  // Assignees - array of userIds (multi-select)
  assignees: z
    .array(z.string())
    .optional()
    .transform((val) => val ?? []),

  startDate: z
    .date()
    .nullable()
    .optional()
    .transform((val) => val ?? null),

  targetDate: z
    .date()
    .nullable()
    .optional()
    .transform((val) => val ?? null),
});

/**
 * Form input type (what the form provides)
 */
export type AddTaskFormInput = z.input<typeof addTaskSchema>;

/**
 * Form output type (after validation/transformation)
 */
export type AddTaskFormValues = z.output<typeof addTaskSchema>;

/**
 * Transform form values into task payload (without workspaceId/createdBy)
 */
export function transformTaskPayload(formValues: AddTaskFormValues) {
  return {
    projectId: formValues.projectId,
    title: formValues.title,
    summary: formValues.summary || undefined,
    description: formValues.description || undefined,
    status: formValues.status as IssueStatus,
    priority: formValues.priority as IssuePriority,
    assignees: formValues.assignees,
    startDate: formValues.startDate,
    targetDate: formValues.targetDate,
  };
}

export type AddTaskPayload = ReturnType<typeof transformTaskPayload>;
export type TransformedTaskPayload = AddTaskPayload;

/**
 * Default form values for initialization and reset
 */
export const defaultTaskFormValues: AddTaskFormValues = {
  title: "",
  projectId: "",
  summary: "",
  description: "",
  status: "backlog",
  priority: "no-priority",
  assignees: [],
  startDate: null,
  targetDate: null,
};

/**
 * Create default form values with optional projectId preset
 */
export function createDefaultTaskFormValues(
  defaultProjectId?: string
): AddTaskFormValues {
  return {
    ...defaultTaskFormValues,
    projectId: defaultProjectId ?? "",
  };
}
