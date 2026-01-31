import { useMemo } from "react";
import { useParams, Link } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Task01FreeIcons,
  Folder01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUserStore } from "@/shared/store/store.user";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useTaskUpdates } from "@/features/tasks/hooks/useTaskUpdates";
import { UpdatesSection } from "@/features/shared/components/UpdatesSection";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { createSlugUrl } from "@/shared/utils/createSlugUrl";

// ============================================================================
// Main Component
// ============================================================================

export default function TaskUpdatesPage() {
  const { workspaceUrl, projectSlug, taskSlug } = useParams();
  const { projects, members } = useWorkspaceStore();
  const { user } = useUserStore();

  // Find the project first
  const project = useMemo(
    () => projects?.find((p) => createSlugUrl(p.name) === projectSlug),
    [projects, projectSlug]
  );

  // Get tasks for this project
  const { tasks, loading: tasksLoading } = useTasks({
    projectId: project?.id || "",
  });

  // Find the specific task
  const task = useMemo(
    () => tasks.find((t) => createSlugUrl(t.title) === taskSlug),
    [tasks, taskSlug]
  );

  // Get real-time updates for this task
  const { updates, loading: updatesLoading, addUpdate, removeUpdate } = useTaskUpdates({
    projectId: project?.id || "",
    taskId: task?.id || "",
  });

  if (!task || !project) {
    return null;
  }

  // Member options
  const memberOptions = members?.map((m) => ({
    value: m.userId,
    label: m.userName,
    avatarUrl: m.avatarUrl,
    email: m.email,
    icon: null as any,
  })) || [];

  const taskOverviewPath = `/${workspaceUrl}/projects/${projectSlug}/tasks/${taskSlug}/overview`;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Navbar */}
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

            <h1 className="font-semibold text-sm">Projects</h1>

            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />

            {/* Project Name */}
            <div className="min-w-0">
              <h1 className="truncate text-sm font-medium tracking-tight text-muted-foreground">
                {project.name}
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
                {task.title}
              </h1>
            </div>

            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />

            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Updates
            </h1>
          </div>
        </div>

        {/* Right Section - Back to Overview */}
        <Link to={taskOverviewPath}>
          <Button variant="ghost" size="sm" className="gap-2">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back to Overview
          </Button>
        </Link>
      </div>

      <Separator />

      {/* Main Content */}
      <ScrollArea className="h-full w-full">
        <div className="flex justify-center w-full bg-background">
          <div className="w-full max-w-220 px-6 py-10 pb-20">
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
                Task Updates
              </h1>
              <p className="text-sm text-muted-foreground">
                Track progress and share updates for this task
              </p>
            </header>

            {/* Updates Section */}
            <UpdatesSection
              updates={updates}
              loading={tasksLoading || updatesLoading}
              members={memberOptions}
              onAddUpdate={addUpdate}
              onRemoveUpdate={removeUpdate}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
