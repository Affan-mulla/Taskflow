import type { FieldValue, Timestamp } from "firebase/firestore";

type FirestoreTimestamp = Timestamp | FieldValue;

export interface UserProfileData {
  name?: string | null;
  email: string;
  createdAt: Date | string;
  avatar?: string;
}

// =============================================================================
// Project Resource (Link only)
// =============================================================================

export interface ProjectResource {
  id: string;
  title: string;
  url: string;
  addedBy: string;
  addedAt: string;
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
  resources?: ProjectResource[];
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

// =============================================================================
// Issue Types (Tasks within Projects)
// =============================================================================

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
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

// =============================================================================
// Task Types (Enhanced version of Issues with more fields)
// =============================================================================

export interface TaskAttachment {
  title: string;
  url: string;
}

export interface Task {
  id?: string;
  projectId: string;
  title: string;
  summary?: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignees: string[];
  startDate?: FirestoreTimestamp | null;
  targetDate?: FirestoreTimestamp | null;
  attachments: TaskAttachment[];
  createdBy: string;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}