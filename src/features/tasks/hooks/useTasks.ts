import { useState, useEffect, useCallback } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import type { Task, IssuePriority, IssueStatus, TaskAttachment } from "@/shared/types/db";
import { listenToTasks } from "@/db/tasks/tasks.read";
import {
  updateTaskStatus,
  updateTaskPriority,
  updateTaskAssignees,
  updateTaskTitle,
  updateTaskDescription,
  updateTaskDates,
  updateTaskAttachments,
} from "@/db/tasks/tasks.update";
import { deleteTask as deleteTaskFromDb } from "@/db/tasks/tasks.delete";

interface UseTasksOptions {
  projectId: string;
}

/**
 * Hook that subscribes to real-time task updates for a specific project.
 *
 * Architecture:
 * - Tasks are project-scoped, NOT stored globally in Zustand
 * - Listener attaches only when workspace AND projectId are valid
 * - Listener auto-cleans on project change or unmount
 * - Optimistic updates for responsive UI
 *
 * Real-time behavior:
 * - Any task created by any member appears immediately
 * - Kanban drag-and-drop status changes sync across all clients
 * - Updates sync in real-time without polling or refetching
 *
 * Update pattern (optimistic UI):
 * 1. Update local state immediately for responsive UI
 * 2. Fire Firestore update (no await needed for UI)
 * 3. Listener automatically syncs state for all clients
 */
export function useTasks({ projectId }: UseTasksOptions) {
  const { activeWorkspace } = useWorkspaceStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to real-time task updates
  useEffect(() => {
    // Guard: require both workspace and project
    if (!activeWorkspace?.id || !projectId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenToTasks(
      activeWorkspace.id,
      projectId,
      (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup listener on project change or unmount
    return () => unsubscribe();
  }, [activeWorkspace?.id, projectId]);

  // =========================================================================
  // Optimistic update helpers
  // =========================================================================

  const updateStatus = useCallback(
    (taskId: string, newStatus: IssueStatus) => {
      if (!activeWorkspace?.id) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Fire and forget - listener will sync
      updateTaskStatus(activeWorkspace.id, projectId, taskId, newStatus);
    },
    [activeWorkspace?.id, projectId]
  );

  const updatePriority = useCallback(
    (taskId: string, newPriority: IssuePriority) => {
      if (!activeWorkspace?.id) return;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, priority: newPriority } : task
        )
      );

      updateTaskPriority(activeWorkspace.id, projectId, taskId, newPriority);
    },
    [activeWorkspace?.id, projectId]
  );

  const updateAssignees = useCallback(
    (taskId: string, assignees: string[]) => {
      if (!activeWorkspace?.id) return;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, assignees } : task
        )
      );

      updateTaskAssignees(activeWorkspace.id, projectId, taskId, assignees);
    },
    [activeWorkspace?.id, projectId]
  );

  const updateTitle = useCallback(
    (taskId: string, title: string) => {
      if (!activeWorkspace?.id) return;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, title } : task
        )
      );

      updateTaskTitle(activeWorkspace.id, projectId, taskId, title);
    },
    [activeWorkspace?.id, projectId]
  );

  const updateDescription = useCallback(
    (taskId: string, description: string) => {
      if (!activeWorkspace?.id) return;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, description } : task
        )
      );

      updateTaskDescription(activeWorkspace.id, projectId, taskId, description);
    },
    [activeWorkspace?.id, projectId]
  );

  const updateDates = useCallback(
    (taskId: string, dates: { startDate?: Date | null; targetDate?: Date | null }) => {
      if (!activeWorkspace?.id) return;

      // No optimistic update for dates - listener syncs immediately
      // Date types differ between local (Date) and Firestore (Timestamp)
      updateTaskDates(activeWorkspace.id, projectId, taskId, dates);
    },
    [activeWorkspace?.id, projectId]
  );

  const updateAttachments = useCallback(
    (taskId: string, attachments: TaskAttachment[]) => {
      if (!activeWorkspace?.id) return;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, attachments } : task
        )
      );

      updateTaskAttachments(activeWorkspace.id, projectId, taskId, attachments);
    },
    [activeWorkspace?.id, projectId]
  );

  const removeTask = useCallback(
    (taskId: string) => {
      if (!activeWorkspace?.id) return;

      // Optimistic removal
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      // Fire and forget
      deleteTaskFromDb(activeWorkspace.id, projectId, taskId);
    },
    [activeWorkspace?.id, projectId]
  );

  // =========================================================================
  // Computed values
  // =========================================================================

  // Group tasks by status for Kanban board
  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      const status = task.status || "backlog";
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    },
    {} as Record<IssueStatus, Task[]>
  );

  return {
    // State
    tasks,
    tasksByStatus,
    loading,
    error,

    // Update methods (all optimistic)
    updateStatus,
    updatePriority,
    updateAssignees,
    updateTitle,
    updateDescription,
    updateDates,
    updateAttachments,
    removeTask,
  };
}
