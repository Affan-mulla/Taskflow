import { useMemo } from "react";
import { useParams } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CubeFreeIcons,
  Folder01Icon,
  ArrowRight01Icon,
  User,
} from "@hugeicons/core-free-icons";

import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUpdateProject } from "@/features/projects/hooks/useUpdateProject";
import { useProjectResources } from "@/features/projects/hooks/useProjectResources";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createSlugUrl } from "@/shared/utils/createSlugUrl";
import { toDate } from "../components/projects.utils";
import { AddTask } from "@/features/tasks";
import { EntityOverviewPage } from "@/features/shared/components/EntityOverviewPage";

// ============================================================================
// Main Component
// ============================================================================

export default function ProjectOverviewPage() {
  const { projectSlug: projectId } = useParams();
  const { projects, members, projectsLoading } = useWorkspaceStore();
  const { updatePriority, updateStatus, updateLead, updateTargetDate, updateSummary, updateDescription } = useUpdateProject();
  const { addResource, removeResource } = useProjectResources();

  const project = useMemo(
    () => projects.find((p) => createSlugUrl(p.name) === projectId),
    [projects, projectId],
  );

  if (!project) {
    return null;
  }

  // Member options
  const memberOptions = members.map((m) => ({
    value: m.userId,
    label: m.userName,
    avatarUrl: m.avatarUrl,
    email: m.email,
    icon: User,
  }));

  // Handlers
  const handleAddResource = async (title: string, url: string) => {
    return await addResource(project.id!, title, url);
  };

  const handleRemoveResource = async (item: any) => {
    await removeResource(project.id!, item);
  };

  const handleDateChange = (field: "startDate" | "targetDate", date: Date | null) => {
    if (field === "targetDate") {
      updateTargetDate(project.id!, date?.toISOString());
    }
    // Note: startDate update not implemented in hook
  };

  return (
    <EntityOverviewPage
      entityType="project"
      loading={projectsLoading}
      icon={CubeFreeIcons}
      title={project.name}
      summary={project.summary}
      status={project.status || ""}
      priority={project.priority || ""}
      lead={project.lead}
      startDate={toDate(project.startDate) || null}
      targetDate={toDate(project.targetDate) || null}
      description={project.description}
      items={project.resources || []}
      members={memberOptions}
      onStatusChange={(val) => updateStatus(project.id!, val as any)}
      onPriorityChange={(val) => updatePriority(project.id!, val as any)}
      onLeadChange={(val) => updateLead(project.id!, val)}
      onDateChange={handleDateChange}
      onSummaryChange={(val) => updateSummary(project.id!, val)}
      onDescriptionChange={(val) => updateDescription(project.id!, val)}
      onAddItem={handleAddResource}
      onRemoveItem={handleRemoveResource}
      navbar={
        <ProjectOverviewPageNavbar 
          projectName={project.name} 
          projectId={project.id!} 
        />
      }
    />
  );
}

// ============================================================================
// Navbar
// ============================================================================

const ProjectOverviewPageNavbar = ({
  projectName,
  projectId,
}: {
  projectName: string;
  projectId: string;
}) => {

  return (
    <div className="px-3 sm:px-4 md:px-6 py-3 w-full flex items-center justify-between gap-3">
      {/* Left Section */}
      <div className="min-w-0 flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />

        <div className="flex items-center gap-2 min-w-0">
          {/* Project Icon */}
          <div className="shrink-0 size-6 rounded-md bg-primary/40 ring-1 ring-border/50 grid place-items-center">
            <HugeiconsIcon
              icon={Folder01Icon}
              strokeWidth={2}
              className="size-4 text-primary fill-current"
            />
          </div>

          <h1 className="font-semibold text-sm">
            Projects
          </h1>

          <HugeiconsIcon  
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />

          {/* Project Name */}
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {projectName}
            </h1>
          </div>
        </div>
      </div>

      {/* Right Section - Create Task Button */}
      <div className="shrink-0 flex items-center gap-2">
        <AddTask defaultProjectId={projectId} triggerVariant="outline" />
      </div>
    </div>
  );
};
