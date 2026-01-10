import z from "zod";

export const workspaceSchema  = z.object({
    workspaceName : z.string().min(1, "Workspace name is required").max(50, "Workspace name must not exceed 50 characters"),
    workspaceUrl : z.string().min(1, "Workspace URL is required").max(12, "Workspace URL must not exceed 12 characters"),
})

export type workspaceSchemaType = z.infer<typeof workspaceSchema>