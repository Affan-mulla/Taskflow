import { getUserWorkspacesIds, isWorkspaceUrlUnique, getWorkspacesByIds ,getWorkspaceMembers } from "./workspace/workspace.read";
import { createUserProfile } from "./users/users.create";
import { createWorkspace } from "./workspace/workspace.create";
import { getUserProfile } from "./users/users.read";
import { createProject } from "./projects/projects.create";
import { listenToProjects } from "./projects/projects.read";
import { 
  updateProject, 
  updateProjectPriority, 
  updateProjectStatus, 
  updateProjectLead, 
  updateProjectTargetDate 
} from "./projects/projects.update";

// Issues
import { createIssue, type CreateIssuePayload } from "./issues/issues.create";
import { listenToIssues } from "./issues/issues.read";
import {
  updateIssueStatus,
  updateIssuePriority,
  updateIssueAssignee,
  updateIssueTitle,
  updateIssueDescription,
} from "./issues/issues.update";
import { deleteIssue } from "./issues/issues.delete";


export { 
  getUserWorkspacesIds, 
  isWorkspaceUrlUnique, 
  createUserProfile, 
  createWorkspace, 
  getWorkspacesByIds, 
  getUserProfile, 
  getWorkspaceMembers, 
  createProject, 
  listenToProjects, 
  updateProject,
  updateProjectPriority,
  updateProjectStatus,
  updateProjectLead,
  updateProjectTargetDate,
  // Issues
  createIssue,
  listenToIssues,
  updateIssueStatus,
  updateIssuePriority,
  updateIssueAssignee,
  updateIssueTitle,
  updateIssueDescription,
  deleteIssue,
};

// Types
export type { CreateIssuePayload };