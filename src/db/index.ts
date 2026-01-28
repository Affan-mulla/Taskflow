// =============================================================================
// Users
// =============================================================================
export { createUserProfile } from "./users/users.create";
export { getUserProfile } from "./users/users.read";

// =============================================================================
// Workspaces
// =============================================================================
export { createWorkspace } from "./workspace/workspace.create";
export {
  getUserWorkspacesIds,
  isWorkspaceUrlUnique,
  getWorkspacesByIds,
  getWorkspaceMembers,
} from "./workspace/workspace.read";

// =============================================================================
// Projects
// =============================================================================
export { createProject } from "./projects/projects.create";
export { listenToProjects } from "./projects/projects.read";
export {
  updateProject,
  updateProjectPriority,
  updateProjectStatus,
  updateProjectLead,
  updateProjectTargetDate,
  addProjectResource,
  removeProjectResource,
} from "./projects/projects.update";

// =============================================================================
// Issues
// =============================================================================
export { createIssue, type CreateIssuePayload } from "./issues/issues.create";
export { listenToIssues } from "./issues/issues.read";
export {
  updateIssue,
  updateIssueStatus,
  updateIssuePriority,
  updateIssueAssignee,
  updateIssueTitle,
  updateIssueDescription,
} from "./issues/issues.update";
export { deleteIssue } from "./issues/issues.delete";

// =============================================================================
// Tasks
// =============================================================================
export { createTask, type CreateTaskPayload, type LinkAttachment } from "./tasks/tasks.create";
export { listenToTasks } from "./tasks/tasks.read";
export {
  updateTask,
  updateTaskStatus,
  updateTaskPriority,
  updateTaskAssignees,
  updateTaskTitle,
  updateTaskDescription,
  updateTaskDates,
  updateTaskAttachments,
} from "./tasks/tasks.update";
export { deleteTask } from "./tasks/tasks.delete";