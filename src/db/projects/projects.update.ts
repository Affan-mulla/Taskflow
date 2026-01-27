import type { ProjectPriority, ProjectStatus } from "@/features/projects/components";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import type { ProjectResource } from "@/shared/types/db";

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

/**
 * Add a resource (link) to a project
 */
export async function addProjectResource(
  workspaceId: string,
  projectId: string,
  resource: ProjectResource,
) {
  try {
    const projectRef = doc(db, "workspaces", workspaceId, "projects", projectId);
    await updateDoc(projectRef, {
      resources: arrayUnion(resource),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to add project resource:", error);
    throw error;
  }
}

/**
 * Remove a resource from a project
 */
export async function removeProjectResource(
  workspaceId: string,
  projectId: string,
  resource: ProjectResource,
) {
  try {
    const projectRef = doc(db, "workspaces", workspaceId, "projects", projectId);
    await updateDoc(projectRef, {
      resources: arrayRemove(resource),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to remove project resource:", error);
    throw error;
  }
}

// Legacy export for backward compatibility
export const updateProject = updateProjectPriority;
