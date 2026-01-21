import type { ProjectPriority, ProjectStatus } from "@/features/projects/components";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function updateProjectPriority(
  workspaceId: string,
  projectId: string,
  newPriority: ProjectPriority,
) {
  try {
    const projectRef = doc(db, "workspaces", workspaceId, "projects", projectId);
    await updateDoc(projectRef, {
      priority: newPriority,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update project priority:", error);
    throw error;
  }
}

export async function updateProjectStatus(
  workspaceId: string,
  projectId: string,
  newStatus: ProjectStatus,
) {
  try {
    const projectRef = doc(db, "workspaces", workspaceId, "projects", projectId);
    await updateDoc(projectRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update project status:", error);
    throw error;
  }
}

export async function updateProjectLead(
  workspaceId: string,
  projectId: string,
  newLeadId: string,
) {
  try {
    const projectRef = doc(db, "workspaces", workspaceId, "projects", projectId);
    await updateDoc(projectRef, {
      lead: newLeadId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update project lead:", error);
    throw error;
  }
}

export async function updateProjectTargetDate(
  workspaceId: string,
  projectId: string,
  newTargetDate: string | undefined,
) {
  try {
    const projectRef = doc(db, "workspaces", workspaceId, "projects", projectId);
    await updateDoc(projectRef, {
      targetDate: newTargetDate ?? null,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update project target date:", error);
    throw error;
  }
}

// Legacy export for backward compatibility
export const updateProject = updateProjectPriority;
