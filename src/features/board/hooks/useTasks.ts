import { useState, useEffect, useCallback } from "react";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import type { IssuePriority, IssueStatus } from "@/shared/types/db";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// ============================================================================
// Types
// ============================================================================

export interface Task {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignees: string[];
  startDate?: string | null;
  targetDate?: string | null;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

interface UseTasksOptions {
  projectId: string;
}

// ============================================================================
// Firestore Helpers
// ============================================================================

const getTaskRef = (workspaceId: string, projectId: string, taskId: string) =>
  doc(db, "workspaces", workspaceId, "projects", projectId, "tasks", taskId);

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook that subscribes to real-time task updates for a specific project.
 * 
 * Real-time behavior:
 * - Any task created by any member appears immediately
 * - Kanban drag-and-drop status changes sync across all clients
 * - Assignee, priority updates sync in real-time
 */
export function useTasks({ projectId }: UseTasksOptions) {
  const { activeWorkspace } = useWorkspaceStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Real-time listener
  useEffect(() => {
    if (!activeWorkspace?.id || !projectId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const tasksRef = collection(
      db,
      "workspaces",
      activeWorkspace.id,
      "projects",
      projectId,
      "tasks"
    );
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updatedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setTasks(updatedTasks);
        setLoading(false);
      },
      (err) => {
        console.error("Tasks listener error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeWorkspace?.id, projectId]);

  // ============================================================================
  // Update Methods (Optimistic UI)
  // ============================================================================

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
      const taskRef = getTaskRef(activeWorkspace.id, projectId, taskId);
      updateDoc(taskRef, { status: newStatus, updatedAt: serverTimestamp() });
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

      const taskRef = getTaskRef(activeWorkspace.id, projectId, taskId);
      updateDoc(taskRef, { priority: newPriority, updatedAt: serverTimestamp() });
    },
    [activeWorkspace?.id, projectId]
  );

  const updateAssignees = useCallback(
    (taskId: string, newAssignees: string[]) => {
      if (!activeWorkspace?.id) return;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, assignees: newAssignees } : task
        )
      );

      const taskRef = getTaskRef(activeWorkspace.id, projectId, taskId);
      updateDoc(taskRef, { assignees: newAssignees, updatedAt: serverTimestamp() });
    },
    [activeWorkspace?.id, projectId]
  );

  const updateTargetDate = useCallback(
    (taskId: string, newDate: string | null | undefined) => {
      if (!activeWorkspace?.id) return;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, targetDate: newDate } : task
        )
      );

      const taskRef = getTaskRef(activeWorkspace.id, projectId, taskId);
      updateDoc(taskRef, { targetDate: newDate ?? null, updatedAt: serverTimestamp() });
    },
    [activeWorkspace?.id, projectId]
  );

  // Group tasks by status for Kanban board
  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      const status = task.status || "backlog";
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    },
    {} as Record<IssueStatus, Task[]>
  );

  return {
    tasks,
    tasksByStatus,
    loading,
    error,
    updateStatus,
    updatePriority,
    updateAssignees,
    updateTargetDate,
  };
}
