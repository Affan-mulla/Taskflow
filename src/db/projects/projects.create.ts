import type { AddProjectPayload } from "@/features/projects/validation/addProject";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function createProject(data: AddProjectPayload) {
  try {
    // Validate workspaceId
    if (!data.workspaceId) {
      throw new Error("Workspace ID is required");
    }

    // Format project data for Firestore
    const projectData = {
      workspaceId: data.workspaceId,
      name: data.name,
      summary: data.summary || "",
      description: data.description || "",
      status: data.status || "planned",
      priority: data.priority || "none",
      startDate: data.startDate,
      targetDate: data.targetDate,
      lead: data.lead,
      members: data.access.type === "restricted" ? data.access.members : [],
      // Metadata
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add document to Firestore
    const projectsRef = collection(
      db,
      "workspaces",
      data.workspaceId,
      "projects"
    );
    const docRef = await addDoc(projectsRef, projectData);

    console.log("Project created successfully with ID:", docRef.id);

    return {
      success: true,
      projectId: docRef.id,
    };
  } catch (error) {
    console.error("Error creating project:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to create project";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
