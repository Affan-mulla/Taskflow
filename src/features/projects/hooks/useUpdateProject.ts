import { useState } from "react";
import type { ProjectPriority, ProjectStatus } from "../components";
import { 
  updateProjectPriority, 
  updateProjectStatus, 
  updateProjectLead, 
  updateProjectTargetDate 
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

  return { 
    loading, 
    updatePriority,
    updateStatus,
    updateLead,
    updateTargetDate
  };
};
