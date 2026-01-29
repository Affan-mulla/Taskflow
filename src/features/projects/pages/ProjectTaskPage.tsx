

import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useWorkspaceTasks } from "@/features/tasks/hooks/useWorkspaceTasks";
import { ProjectListHeader } from "@/features/projects/components/ProjectListHeader";
import { ProjectListContainer } from "@/features/projects/components/ProjectListContainer";
import { ProjectListSkeleton } from "@/features/projects/components";
import type { FilterValue, FilterCategory } from "@/features/projects/components/ProjectFilter";
import type { Task } from "@/shared/types/db";
import { createSlugUrl } from "@/shared/utils/createSlugUrl";

/**
 * ProjectTaskPage - Displays tasks from workspace or a specific project.
 *
 * Routes:
 * - `/taskflow/tasks` → All tasks (showProjectColumn=true)
 * - `/taskflow/projects/:projectId/tasks` → Project tasks (showProjectColumn=false)
 * 
 * Responsibilities:
 * - Fetch tasks (all or project-specific)
 * - Handle loading and empty states
 * - Manage filter state and apply filters to task list
 * - Compose child components (header, list container)
 */
const ProjectTaskPage = () => {
  const navigate = useNavigate();
  const { projectSlug, workspaceUrl } = useParams<{ projectSlug?: string; workspaceUrl: string }>();
  const { projects, projectsLoading, members } = useWorkspaceStore();
  const { tasks, loading: tasksLoading } = useWorkspaceTasks();
  const [filters, setFilters] = useState<FilterValue[]>([]);

  // Determine if we're in all-tasks view or project-specific view
  const isAllTasksView = !projectSlug;
  const showProjectColumn = isAllTasksView;
  const projectId = isAllTasksView
    ? undefined
    : projects?.find(p => createSlugUrl(p.name) === projectSlug)?.id;

  // Filter tasks by project if we're in project-specific view
  const projectTasks = useMemo(() => {
    if (!tasks) return [];
    if (isAllTasksView) return tasks;
    return tasks.filter(task => task.projectId === projectId);
  }, [tasks, projectId, isAllTasksView]);

  // Transform members for filter
  const memberOptions = useMemo(() => {
    if (!members) return [];
    return members.map((member) => ({
      value: member.userId || member.email,
      label: member.userName || member.email,
      icon: null,
      avatarUrl: member.avatarUrl || undefined,
      email: member.email,
    }));
  }, [members]);

  // Transform projects for filter
  const projectOptions = useMemo(() => {
    if (!projects) return [];
    return projects.map((project) => ({
      value: project.id!,
      label: project.name,
    }));
  }, [projects]);

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    if (!projectTasks) return [];
    if (filters.length === 0) return projectTasks;

    return projectTasks.filter((task) => {
      // Group filters by category
      const filtersByCategory = filters.reduce(
        (acc, filter) => {
          if (!acc[filter.category]) {
            acc[filter.category] = [];
          }
          acc[filter.category].push(filter);
          return acc;
        },
        {} as Record<FilterCategory, FilterValue[]>
      );

      // For each category, check if task matches ANY value in that category (OR within category)
      // All categories must match (AND between categories)
      return Object.entries(filtersByCategory).every(
        ([category, categoryFilters]) => {
          const cat = category as FilterCategory;

          return categoryFilters.some((filter) => {
            switch (cat) {
              case "status":
                return task.status === filter.value;

              case "priority":
                return task.priority === filter.value;

              case "assignee":
                return task.assignees?.includes(String(filter.value));

              case "project":
                return task.projectId === filter.value;

              default:
                return true;
            }
          });
        }
      );
    });
  }, [projectTasks, filters]);

  const handleTaskClick = (task: Task) => {
    if (!workspaceUrl || !task.title || !task.projectId) return;
    
    // Find the project to get its name/slug
    const project = projects?.find(p => p.id === task.projectId);
    if (!project) return;
    
    const projectSlug = createSlugUrl(project.name);
    const taskSlug = createSlugUrl(task.title);
    navigate(`/${workspaceUrl}/projects/${projectSlug}/tasks/${taskSlug}/overview`);
  };

  const handleFiltersChange = (newFilters: FilterValue[]) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (
    category: FilterCategory,
    value: string | Date
  ) => {
    setFilters(
      filters.filter((f) => !(f.category === category && f.value === value))
    );
  };

  const handleRemoveCategory = (category: FilterCategory) => {
    setFilters(filters.filter((f) => f.category !== category));
  };

  // Early return for null/undefined
  if (!tasks && !tasksLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Get current project name for display
  const currentProject = projectId 
    ? projects?.find(p => p.id === projectId) 
    : undefined;
  return (
    <div className="h-full w-full">
      <ProjectListHeader
        itemCount={filteredTasks.length}
        members={memberOptions}
        projects={projectOptions}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRemoveFilter={handleRemoveFilter}
        onRemoveCategory={handleRemoveCategory}
        entityType="task"
        showProjectFilter={isAllTasksView}
      />

      <div className="px-3 sm:px-4 md:px-6 py-3">
        {tasksLoading || projectsLoading ? (
          <ProjectListSkeleton />
        ) : filteredTasks.length === 0 && filters.length > 0 ? (
          <EmptyFilterState onClearFilters={() => setFilters([])} />
        ) : filteredTasks.length === 0 ? (
          <EmptyState projectName={currentProject?.name} />
        ) : (
          <ProjectListContainer
            tasks={filteredTasks}
            projectsMap={(projects ?? []).reduce((acc, p) => {
              if (p.id) acc[p.id] = p.name;
              return acc;
            }, {} as Record<string, string>)}
            onTaskClick={handleTaskClick}
            entityType="task"
            showProjectColumn={showProjectColumn}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Empty state when no tasks exist.
 */
function EmptyState({ projectName }: { projectName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="text-sm text-muted-foreground">
        {projectName 
          ? `No tasks yet in ${projectName}. Create one to get started.`
          : "No tasks yet. Create one to get started."
        }
      </div>
    </div>
  );
}

/**
 * Empty state when filters return no results.
 */
function EmptyFilterState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="text-sm text-muted-foreground">
        No tasks match your filters.
      </div>
      <button
        onClick={onClearFilters}
        className="text-xs text-primary hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}

export default ProjectTaskPage;