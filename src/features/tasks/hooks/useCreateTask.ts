import { useState } from "react";
import { toast } from "sonner";
import { createTask, type CreateTaskPayload } from "@/db/tasks/tasks.create";

/**
 * Hook for creating new tasks.
 * Real-time listeners will automatically pick up the new task.
 */
export function useCreateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTask = async (
    payload: CreateTaskPayload
  ): Promise<{ success: boolean; taskId?: string; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createTask(payload);

      if (!result.success || !result.taskId) {
        const errorMsg = result.error || "Failed to create task";
        setError(errorMsg);
        toast.error("Failed to create task", { description: errorMsg });
        return { success: false, error: errorMsg };
      }

      toast.success("Task created", {
        description: `"${payload.title}" has been added.`,
      });

      return { success: true, taskId: result.taskId };
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      toast.error("Failed to create task", { description: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTask: handleCreateTask,
  };
}
