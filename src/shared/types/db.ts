export interface UserProfileData {
    name?: string | null;
    email: string;
    createdAt: Date | string;
    avatar?: string;
}

export interface Project {
    id?: string;
    workspaceId: string;
    name: string;
    summary?: string;
    description?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    targetDate?: string;
    lead?: string;
    createdAt?: any;
    updatedAt?: any;
}

// ============================================================================
// Issue Types (Tasks within Projects)
// ============================================================================

export type IssuePriority = "no-priority" | "urgent" | "high" | "medium" | "low";
export type IssueStatus = "backlog" | "todo" | "in-progress" | "in-review" | "done" | "cancelled";

export interface Issue {
    id?: string;
    projectId: string;
    title: string;
    description?: string;
    status: IssueStatus;
    priority: IssuePriority;
    assigneeId?: string;
    createdBy: string;
    createdAt?: any;
    updatedAt?: any;
}