import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useState, useMemo, useEffect } from "react";
import { 
  ProjectListHeader, 
  ProjectListContainer, 
  ProjectListSkeleton 
} from "../components";
import type { FilterValue, FilterCategory } from "../components/ProjectFilter";
import type { MemberOption } from "../components/projects.types";

/**
 * ProjectListPage - Main page for displaying all projects in a workspace.
 * 
 * Responsibilities:
 * - Read project data from workspace store
 * - Handle loading and empty states
 * - Manage filter state and apply filters to project list
 * - Compose child components (header, list container)
 * 
 * Does NOT contain:
 * - Row-level UI logic (delegated to ProjectRow/ProjectCard)
 * - Inline editing logic (delegated to useProjectInlineEdit hook)
 */
const ProjectListPage = () => {
  const { projects, projectsLoading, members } = useWorkspaceStore();
  const [filters, setFilters] = useState<FilterValue[]>([]);

  // Transform members to MemberOption format for the filter
  const memberOptions: MemberOption[] = useMemo(() => {
    if (!members) return [];
    return members.map(member => ({
      value: member.userId || member.email,
      label: member.userName || member.email,
      icon: null,
      avatarUrl: member.avatarUrl || undefined,
      email: member.email,
    }));
  }, [members]);

  // Apply filters to projects
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (filters.length === 0) return projects;

    return projects.filter(project => {
      // Group filters by category
      const filtersByCategory = filters.reduce((acc, filter) => {
        if (!acc[filter.category]) {
          acc[filter.category] = [];
        }
        acc[filter.category].push(filter);
        return acc;
      }, {} as Record<FilterCategory, FilterValue[]>);

      // For each category, check if project matches ANY value in that category (OR within category)
      // All categories must match (AND between categories)
      return Object.entries(filtersByCategory).every(([category, categoryFilters]) => {
        const cat = category as FilterCategory;
        
        return categoryFilters.some(filter => {
          switch (cat) {
            case "status":
              return project.status === filter.value;

            case "priority":
              return project.priority === filter.value;

            case "lead":
              return project.lead === filter.value;

            case "dates":
              if (!project.targetDate) return false;
              
              // Handle date presets
              if (typeof filter.value === "string") {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const projectDate = typeof project.targetDate === 'object' && 'toDate' in project.targetDate
                  ? (project.targetDate as any).toDate()
                  : new Date(project.targetDate);
                projectDate.setHours(0, 0, 0, 0);

                switch (filter.value) {
                  case "today":
                    return projectDate.getTime() === today.getTime();
                  
                  case "this-week": {
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return projectDate >= weekStart && projectDate <= weekEnd;
                  }
                  
                  case "this-month":
                    return projectDate.getMonth() === today.getMonth() &&
                           projectDate.getFullYear() === today.getFullYear();
                  
                  case "next-week": {
                    const nextWeekStart = new Date(today);
                    nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
                    const nextWeekEnd = new Date(nextWeekStart);
                    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
                    return projectDate >= nextWeekStart && projectDate <= nextWeekEnd;
                  }
                  
                  case "next-month": {
                    const nextMonth = new Date(today);
                    nextMonth.setMonth(today.getMonth() + 1);
                    return projectDate.getMonth() === nextMonth.getMonth() &&
                           projectDate.getFullYear() === nextMonth.getFullYear();
                  }
                  
                  default:
                    return false;
                }
              }
              
              // Handle specific date comparison
              if (filter.value instanceof Date) {
                const projectDate = typeof project.targetDate === 'object' && 'toDate' in project.targetDate
                  ? (project.targetDate as any).toDate()
                  : new Date(project.targetDate);
                return projectDate.toDateString() === filter.value.toDateString();
              }
              
              return false;

            default:
              return true;
          }
        });
      });
    });
  }, [projects, filters]);

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

  const handleFiltersChange = (newFilters: FilterValue[]) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (category: FilterCategory, value: string | Date) => {
    setFilters(filters.filter(f => !(f.category === category && f.value === value)));
  };

  const handleRemoveCategory = (category: FilterCategory) => {
    setFilters(filters.filter(f => f.category !== category));
  };

  return (
    <div className="h-full w-full">
      <ProjectListHeader
        projectCount={filteredProjects.length}
        members={memberOptions}
        filters={filters}
        onAddProject={handleAddProject}
        onFiltersChange={handleFiltersChange}
        onRemoveFilter={handleRemoveFilter}
        onRemoveCategory={handleRemoveCategory}
      />

      <div className="px-3 sm:px-4 md:px-6 py-3">
        {projectsLoading ? (
          <ProjectListSkeleton />
        ) : filteredProjects.length === 0 && filters.length > 0 ? (
          <EmptyFilterState onClearFilters={() => setFilters([])} />
        ) : filteredProjects.length === 0 ? (
          <EmptyState onAddProject={handleAddProject} />
        ) : (
          <ProjectListContainer 
            projects={filteredProjects} 
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

/**
 * Empty state when filters return no results.
 */
function EmptyFilterState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="text-sm text-muted-foreground">
        No projects match your filters.
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

export default ProjectListPage;
