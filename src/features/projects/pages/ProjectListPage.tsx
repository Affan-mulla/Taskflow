import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { 
  ProjectListHeader, 
  ProjectListContainer, 
  ProjectListSkeleton 
} from "../components";

/**
 * ProjectListPage - Main page for displaying all projects in a workspace.
 * 
 * Responsibilities:
 * - Read project data from workspace store
 * - Handle loading and empty states
 * - Compose child components (header, list container)
 * 
 * Does NOT contain:
 * - Row-level UI logic (delegated to ProjectRow/ProjectCard)
 * - Inline editing logic (delegated to useProjectInlineEdit hook)
 */
const ProjectListPage = () => {
  const { projects, projectsLoading } = useWorkspaceStore();

  // Early return for null/undefined projects
  if (!projects) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleProjectClick = (project: { id?: string; name: string }) => {
    // TODO: Navigate to project detail page
    console.log("Navigate to project:", project.id);
  };

  const handleAddProject = () => {
    // TODO: Open add project dialog
    console.log("Open add project dialog");
  };

  const handleFilter = () => {
    // TODO: Open filter panel
    console.log("Open filter panel");
  };

  const handleDisplaySettings = () => {
    // TODO: Open display settings
    console.log("Open display settings");
  };

  return (
    <div className="h-full w-full">
      <ProjectListHeader
        projectCount={projects.length}
        onAddProject={handleAddProject}
        onFilter={handleFilter}
        onDisplaySettings={handleDisplaySettings}
      />

      <div className="px-3 sm:px-4 md:px-6 py-3">
        {projectsLoading ? (
          <ProjectListSkeleton />
        ) : projects.length === 0 ? (
          <EmptyState onAddProject={handleAddProject} />
        ) : (
          <ProjectListContainer 
            projects={projects} 
            onProjectClick={handleProjectClick}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Empty state when no projects exist in the workspace.
 */
function EmptyState({ onAddProject }: { onAddProject?: () => void }) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-12 gap-3 cursor-pointer"
      onClick={onAddProject}
    >
      <div className="text-sm text-muted-foreground">
        No projects yet. Create one to get started.
      </div>
    </div>
  );
}

export default ProjectListPage;
