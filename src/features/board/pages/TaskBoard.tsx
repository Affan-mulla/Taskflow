import { useMemo } from "react";
import { useParams } from "react-router";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { createSlugUrl } from "@/shared/utils/createSlugUrl";
import Board from "./Board";

/**
 * TaskBoard - Wrapper component for the Task Board within a project.
 * 
 * This component extracts the projectId from the URL params and passes
 * it to the generic Board component with entityType="task".
 */
const TaskBoard = () => {
  const { projectSlug } = useParams<{ projectSlug?: string }>();
  const { projects } = useWorkspaceStore();

  // Find project by slug
  const projectId = useMemo(() => {
    if (!projectSlug || !projects) return undefined;
    const project = projects.find(p => createSlugUrl(p.name) === projectSlug);
    return project?.id;
  }, [projectSlug, projects]);

  return <Board entityType="task" projectId={projectId} />;
};

export default TaskBoard;
