import { useState } from "react";
import type { ProjectPriority, ProjectStatus } from "../components";
import { 
  updateProjectPriority, 
  updateProjectStatus, 
  updateProjectLead, 
  updateProjectTargetDate,
  updateProjectSummary,
  updateProjectDescription,
} from "@/db";
import { useWorkspaceStore } from "@/shared/store/store.workspace";

export const useUpdateProject = () => {
  const [loading, setLoading] = useState(false);
  const { activeWorkspace } = useWorkspaceStore();

  const getWorkspaceId = () => {
    if (!activeWorkspace?.id) {
      throw new Error("No active workspace selected");
    }
    return activeWorkspace.id;
  };

  const updatePriority = async (projectId: string, newPriority: ProjectPriority) => {
    setLoading(true);
    try {
      await updateProjectPriority(getWorkspaceId(), projectId, newPriority);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (projectId: string, newStatus: ProjectStatus) => {
    setLoading(true);
    try {
      await updateProjectStatus(getWorkspaceId(), projectId, newStatus);
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (projectId: string, newLeadId: string) => {
    setLoading(true);
    try {
      await updateProjectLead(getWorkspaceId(), projectId, newLeadId);
    } finally {
      setLoading(false);
    }
  };

  const updateTargetDate = async (projectId: string, newTargetDate: string | undefined) => {
    setLoading(true);
    try {
      await updateProjectTargetDate(getWorkspaceId(), projectId, newTargetDate);
    } finally {
      setLoading(false);
    }
  };

  const updateSummary = async (projectId: string, summary: string) => {
    try {
      await updateProjectSummary(getWorkspaceId(), projectId, summary);
    } catch (error) {
      console.error("Failed to update summary:", error);
    }
  };

  const updateDescription = async (projectId: string, description: string) => {
    try {
      await updateProjectDescription(getWorkspaceId(), projectId, description);
    } catch (error) {
      console.error("Failed to update description:", error);
    }
  };

  return { 
    loading, 
    updatePriority,
    updateStatus,
    updateLead,
    updateTargetDate,
    updateSummary,
    updateDescription,
  };
};
