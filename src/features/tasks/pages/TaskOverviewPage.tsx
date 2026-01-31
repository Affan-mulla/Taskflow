import { useMemo } from "react";
import { useParams, Link } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Task01FreeIcons,
  Folder01Icon,
  ArrowRight01Icon,
  FileEditIcon,
} from "@hugeicons/core-free-icons";

import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUserStore } from "@/shared/store/store.user";
import { useTasks } from "../hooks/useTasks";
import { useTaskUpdates } from "../hooks/useTaskUpdates";
import type { MemberOption } from "@/features/projects/components/projects.types";
import { toDate } from "@/features/projects/components/projects.utils";
import { createSlugUrl } from "@/shared/utils/createSlugUrl";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { EntityOverviewPage } from "@/features/shared/components/EntityOverviewPage";
import UpdateNavigationBtn from "@/features/updates/components/UpdateNavigationBtn";

// ============================================================================
// Main Component
// ============================================================================

export default function TaskOverviewPage() {
  const { projectSlug, taskSlug, workspaceUrl } = useParams<{
    projectSlug: string;
    taskSlug: string;
    workspaceUrl: string;
  }>();
  const { projects, members } = useWorkspaceStore();
  const { user } = useUserStore();

  // Find the project first
  const project = useMemo(
    () => projects?.find((p) => createSlugUrl(p.name) === projectSlug),
    [projects, projectSlug],
  );

  // Get tasks for this project
  const {
    tasks,
    loading,
    updateStatus,
    updatePriority,
    updateAssignees,
    updateDates,
    updateAttachments,
    updateSummary,
    updateDescription,
  } = useTasks({
    projectId: project?.id || "",
  });

  // Find the specific task
  const task = useMemo(
    () => tasks.find((t) => createSlugUrl(t.title) === taskSlug),
    [tasks, taskSlug],
  );

  // Get real-time updates for this task
  const {
    updates,
    loading: updatesLoading,
    addUpdate,
    removeUpdate,
  } = useTaskUpdates({
    projectId: project?.id || "",
    taskId: task?.id || "",
  });

  if (!task || !project) {
    return null;
  }

  // Member options
  const memberOptions: MemberOption[] =
    members?.map((m) => ({
      value: m.userId,
      label: m.userName,
      avatarUrl: m.avatarUrl,
      email: m.email,
      icon: null,
    })) || [];

  // Link to dedicated updates page
  const updatesLink = `/${workspaceUrl}/projects/${projectSlug}/tasks/${taskSlug}/updates`;

  // Handlers
  const handleAddAttachment = async (title: string, url: string) => {
    const newAttachments = [...(task.attachments || []), { title, url }];
    await updateAttachments(task.id!, newAttachments);
    return true;
  };

  const handleRemoveAttachment = async (_item: any, index: number) => {
    const newAttachments = (task.attachments || []).filter(
      (_, i) => i !== index,
    );
    await updateAttachments(task.id!, newAttachments);
  };

  const handleDateChange = (
    field: "startDate" | "targetDate",
    date: Date | null,
  ) => {
    updateDates(task.id!, { [field]: date });
  };

  return (
    <EntityOverviewPage
      entityType="task"
      loading={loading}
      icon={Task01FreeIcons}
      title={task.title}
      summary={task.summary}
      status={task.status}
      priority={task.priority}
      assignees={task.assignees}
      startDate={toDate(task.startDate) || null}
      targetDate={toDate(task.targetDate) || null}
      description={task.description}
      createdBy={task.createdBy}
      createdAt={toDate(task.createdAt)}
      items={task.attachments || []}
      updates={updates}
      updatesLoading={updatesLoading}
      onAddUpdate={addUpdate}
      onRemoveUpdate={removeUpdate}
      currentUserId={user?.id}
      viewAllUpdatesLink={updatesLink}
      members={memberOptions}
      onStatusChange={(val) => updateStatus(task.id!, val as any)}
      onPriorityChange={(val) => updatePriority(task.id!, val as any)}
      onAssigneesChange={(val) => updateAssignees(task.id!, val)}
      onDateChange={handleDateChange}
      onSummaryChange={(val) => updateSummary(task.id!, val)}
      onDescriptionChange={(val) => updateDescription(task.id!, val)}
      onAddItem={handleAddAttachment}
      onRemoveItem={handleRemoveAttachment}
      navbar={
        <TaskOverviewNavbar
          taskTitle={task.title}
          projectName={project.name}
          updatesLink={updatesLink}
        />
      }
    />
  );
}

// ============================================================================
// Navbar
// ============================================================================

const TaskOverviewNavbar = ({
  taskTitle,
  projectName,
  updatesLink,
}: {
  taskTitle: string;
  projectName: string;
  updatesLink: string;
}) => {
  return (
    <div className="px-3 sm:px-4 md:px-6 py-3 w-full flex items-center justify-between gap-3">
      {/* Left Section */}
      <div className="min-w-0 w-full flex items-center gap-3">
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

          <h1 className="font-semibold text-sm">Projects</h1>

          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />

          {/* Project Name */}
          <div className="min-w-0">
            <h1 className="truncate text-sm font-medium tracking-tight text-muted-foreground">
              {projectName}
            </h1>
          </div>

          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />

          {/* Task Icon */}
          <div className="shrink-0 size-5 rounded grid place-items-center">
            <HugeiconsIcon
              icon={Task01FreeIcons}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </div>

          {/* Task Title */}
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {taskTitle}
            </h1>
          </div>
        </div>

        <div className="ml-auto">
          <UpdateNavigationBtn updatesLink={updatesLink} />
        </div>
      </div>
    </div>
  );
};
