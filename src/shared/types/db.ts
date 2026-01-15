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