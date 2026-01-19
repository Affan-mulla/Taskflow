import type { Project } from "@/shared/types/db";
import { ProjectTableHeader } from "./ProjectTableHeader";
import { ProjectRow } from "./ProjectRow";
import { ProjectCard } from "./ProjectCard";

interface ProjectListContainerProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

/**
 * Container that renders projects as a table (desktop/tablet) or cards (mobile).
 * Handles responsive layout switching.
 */
export function ProjectListContainer({ projects, onProjectClick }: ProjectListContainerProps) {
  return (
    <div className="w-full">
      {/* Desktop/Tablet grid list */}
      <div className="hidden md:block">
        <div className="rounded-lg bg-muted/10 ring-1 ring-border/50 overflow-hidden">
          <ProjectTableHeader />
          <div className="divide-y divide-border/40">
            {projects.map((project) => (
              <ProjectRow 
                key={project.id} 
                project={project} 
                onClick={onProjectClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={onProjectClick}
          />
        ))}
      </div>
    </div>
  );
}
