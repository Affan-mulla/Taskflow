import { z } from "zod";

/**
 * Zod schema for AddProject form validation
 */
export const addProjectSchema = z.object({
  // Required field
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(60, "Project name must be at most 60 characters"),

  // Optional fields
  summary: z
    .string()
    .max(120, "Summary must be at most 120 characters")
    .optional(),

  description: z.string().optional(),

  status: z
    .enum(["planned", "in-progress", "completed", "cancelled"])
    .nullable()
    .optional()
    .transform((val) => val ?? null),

  priority: z
    .enum(["none", "urgent", "high", "medium", "low"])
    .nullable()
    .optional()
    .transform((val) => val ?? null),

  startDate: z.date().nullable().optional().transform((val) => val ?? null),

  targetDate: z.date().nullable().optional().transform((val) => val ?? null),

  // Lead - userId or null
  lead: z.string().nullable().optional().transform((val) => val ?? null),

  // Members - array of userIds
  members: z.array(z.string()).optional().transform((val) => val ?? []),

  // Internal tracking field - not sent to backend
  membersTouched: z.boolean().optional().transform((val) => val ?? false),
});

/**
 * Form input type (what the form provides)
 */
export type AddProjectFormInput = z.input<typeof addProjectSchema>;

/**
 * Form output type (after validation/transformation)
 */
export type AddProjectFormValues = z.output<typeof addProjectSchema>;

/**
 * Access type for project payload
 */
export type ProjectAccess =
  | { type: "all" }
  | { type: "restricted"; members: string[] };

/**
 * Payload shape sent to the backend after form transformation
 */
export interface AddProjectPayload {
  workspaceId: string;
  name: string;
  summary?: string;
  description?: string;
  status: "planned" | "in-progress" | "completed" | "cancelled" | null;
  priority: "none" | "urgent" | "high" | "medium" | "low" | null;
  startDate: Date | null;
  targetDate: Date | null;
  lead: string | null;
  access: ProjectAccess;
}

/**
 * Transform form values into API payload
 * Handles the membersTouched logic for access determination
 */
export function transformToPayload(
  formValues: AddProjectFormValues
): AddProjectPayload {
  const { membersTouched, members, ...rest } = formValues;

  // Determine access based on membersTouched
  const access: ProjectAccess = membersTouched
    ? { type: "restricted", members }
    : { type: "all" };

  return {
    name: rest.name,
    summary: rest.summary || undefined,
    description: rest.description || undefined,
    status: rest.status,
    priority: rest.priority,
    startDate: rest.startDate,
    targetDate: rest.targetDate,
    lead: rest.lead,
    access,
  };
}

/**
 * Default form values for initialization and reset
 */
export const defaultFormValues: AddProjectFormValues = {
  name: "",
  summary: "",
  description: "",
  status: null,
  priority: null,
  startDate: null,
  targetDate: null,
  lead: null,
  members: [],
  membersTouched: false,
};
