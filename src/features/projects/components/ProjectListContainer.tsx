import type { Project, Task } from "@/shared/types/db";
import type { EntityType } from "./projects.types";
import { ProjectTableHeader } from "./ProjectTableHeader";
import { EntityRow } from "./EntityRow";

interface ProjectListContainerProps {
  projects?: Project[];
  tasks?: Task[];
  entityType?: EntityType;
  projectsMap?: Record<string, string>; // For task view: projectId -> projectName
  showProjectColumn?: boolean; // Whether to show project column (all-tasks view)
  onProjectClick?: (project: Project) => void;
  onTaskClick?: (task: Task) => void;
}

/**
 * Container that renders projects or tasks as a responsive table.
 * Uses unified EntityRow for consistent behavior.
 */
export function ProjectListContainer({ 
  projects = [],
  tasks = [],
  entityType = "project",
  projectsMap = {},
  showProjectColumn = false,
  onProjectClick,
  onTaskClick,
}: ProjectListContainerProps) {
  const isTask = entityType === "task";
  
  return (
    <div className="w-full">
      <div className="rounded-lg bg-muted/10 ring-1 ring-border/50 overflow-hidden">
        <ProjectTableHeader 
          entityType={entityType} 
          showProjectColumn={showProjectColumn}
        />
        
          <div className="divide-y divide-border/40">
            {isTask ? (
              tasks.map((task) => (
                <EntityRow 
                  key={task.id} 
                  entity={task}
                  entityType="task"
                  projectName={projectsMap[task.projectId]}
                  showProjectColumn={showProjectColumn}
                  onClick={(e) => onTaskClick?.(e as Task)}
                />
              ))
            ) : (
              projects.map((project) => (
                <EntityRow 
                  key={project.id} 
                  entity={project}
                  entityType="project"
                  onClick={(e) => onProjectClick?.(e as Project)}
                />
              ))
            )}
          </div>
      </div>
    </div>
  );
}
