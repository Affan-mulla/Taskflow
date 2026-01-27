import { useState, useMemo } from "react";
import { useParams } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File02Icon,
  PlusSignIcon,
  Folder01Icon,
  CubeFreeIcons,
  ArrowRight02Icon,
  ArrowRight01Icon,
  Link04Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUpdateProject } from "@/features/projects/hooks/useUpdateProject";
import { useProjectResources } from "@/features/projects/hooks/useProjectResources";
import type { ProjectResource } from "@/shared/types/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Inline Editors
import { InlineStatusSelect } from "../components/inline/InlineStatusSelect";
import { InlinePrioritySelect } from "../components/inline/InlinePrioritySelect";
import { InlineLeadSelect } from "../components/inline/InlineLeadSelect";
import type {
  ProjectPriority,
  ProjectStatus,
} from "../components/projects.types";
import { toDate } from "../components/projects.utils";
import { User } from "@hugeicons/core-free-icons";
import { createSlugUrl } from "@/shared/utils/createSlugUrl";
import { CalendarButton } from "@/components/Common/CalendarButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AddTask } from "@/features/tasks";

// ============================================================================
// types
// ============================================================================

// ============================================================================
// Styles
// ============================================================================

// Consistent label style for section headers
const SectionTitle = ({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-3 min-h-8">
    <h3 className="text-sm font-medium text-muted-foreground">{children}</h3>
    {action}
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export default function ProjectOverviewPage() {
  const { projectId } = useParams();
  const { projects, members, projectsLoading } = useWorkspaceStore();
  const { updatePriority, updateStatus, updateLead } = useUpdateProject();

  const project = useMemo(
    () => projects.find((p) => createSlugUrl(p.name) === projectId),
    [projects, projectId],
  );


  if (projectsLoading) {
    return <PageSkeleton />;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
        <HugeiconsIcon icon={File02Icon} className="size-12 opacity-20" />
        <p>Project not found</p>
      </div>
    );
  }

  const {
    id,
    name,
    summary,
    description,
    status,
    priority,
    lead,
    targetDate,
    startDate,
  } = project;

  // Convert Firestore Timestamps to Date objects
  const startDateObj = toDate(startDate);
  const targetDateObj = toDate(targetDate);

  // Member options for the Lead select
  const memberOptions = members.map((m) => ({
    value: m.userId,
    label: m.userName,
    avatarUrl: m.avatarUrl,
    email: m.email,
    icon: User,
  }));

  return (
    <div className="w-full h-full">
      <ProjectOverviewPageNavbar projectName={name} projectId={id as string} />
      <Separator />
      <ScrollArea className="h-full w-full">
        <div className="flex justify-center w-full bg-background">
          <div className="w-full max-w-220 px-6 py-10 pb-20 flex flex-col gap-10">
            {/* 1. Header Section */}
            <header className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                {/* Optional Project Icon */}
                <div className="mt-1.5 grid place-items-center size-8 rounded-lg bg-secondary/50 text-muted-foreground">
                  <HugeiconsIcon
                    icon={CubeFreeIcons}
                    className="size-5"
                    strokeWidth={2}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                    {name}
                  </h1>
                  {summary && (
                    <p className="text-md text-muted-foreground leading-relaxed">
                      {summary}
                    </p>
                  )}
                </div>
              </div>
            </header>

            {/* 2. Properties Row */}
            <section className="flex flex-wrap items-center gap-x-2 gap-y-3 pb-4 border-b border-border/40">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mr-2 select-none">
                Properties
              </span>

              {/* Status */}
              <div className="flex items-center">
                <InlineStatusSelect
                  value={status as ProjectStatus}
                  onChange={(val) =>
                    val && updateStatus(id!, val as ProjectStatus)
                  }
                  showLabel={false}
                />
              </div>

              {/* Priority */}
              <div className="flex items-center">
                <InlinePrioritySelect
                  value={priority as ProjectPriority}
                  onChange={(val) =>
                    val && updatePriority(id!, val as ProjectPriority)
                  }
                  showLabel={false}
                />
              </div>

              {/* Lead */}
              <div className="flex items-center">
                <InlineLeadSelect
                  value={lead}
                  onChange={(val) => val && updateLead(id!, val)}
                  members={memberOptions}
                  showLabel={false}
                />
              </div>

              {/* Date Range */}
              <div className="flex items-center text-sm text-foreground/80 px-2 py-1 rounded-md cursor-pointer transition-colors group">
                <CalendarButton
                  type="Start"
                  date={startDateObj}
                  btnVariant="ghost"
                />
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  className="size-4 text-muted-foreground"
                />
                <CalendarButton
                  type="Target"
                  date={targetDateObj}
                  btnVariant="ghost"
                />
              </div>
            </section>

            <ProjectResourcesSection 
              projectId={id!} 
              resources={project.resources || []} 
            />

            {/* 3. Description Section (Long-form Context) */}
            <section className="group/desc">
              <SectionTitle>Description</SectionTitle>
              <div className="relative min-h-30 text-base leading-7 text-foreground/90 max-w-none">
                {description ? (
                  <div className="whitespace-pre-wrap">{description}</div>
                ) : (
                  <textarea
                    placeholder="Write a description, a project brief, or collect ideas..."
                    className="w-full h-60 bg-transparent outline-none border-none p-0 resize-none leading-relaxed"
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================================================
// Skeleton
// ============================================================================

function PageSkeleton() {
  return (
    <div className="flex justify-center w-full min-h-full">
      <div className="w-full max-w-220 px-6 py-10 flex flex-col gap-10">
        <div className="space-y-4">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-2 mt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

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

interface ProjectResourcesSectionProps {
  projectId: string;
  resources: ProjectResource[];
}

const ProjectResourcesSection = ({ projectId, resources }: ProjectResourcesSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const { loading, addResource, removeResource } = useProjectResources();

  // Extract hostname from URL for display
  const getHostname = (urlString: string) => {
    try {
      return new URL(urlString).hostname.replace("www.", "");
    } catch {
      return "Link";
    }
  };

  const handleAddResource = async () => {
    if (!title.trim() || !url.trim()) return;
    
    const success = await addResource(projectId, title, url);
    if (success) {
      setTitle("");
      setUrl("");
      setIsDialogOpen(false);
    }
  };

  const handleRemoveResource = async (resource: ProjectResource) => {
    await removeResource(projectId, resource);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* 4. Resources Section */}
      <section>
        <SectionTitle>Resources</SectionTitle>

        <div className="flex flex-col gap-1">
          {/* Resource Items */}
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/40 group transition-colors -mx-2"
            >
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div className="size-8 rounded grid place-items-center bg-secondary/50 text-muted-foreground group-hover:text-foreground group-hover:bg-secondary shrink-0">
                  <HugeiconsIcon icon={Link04Icon} className="size-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground/90 truncate">
                    {resource.title}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {getHostname(resource.url)} • Added {formatDistanceToNow(new Date(resource.addedAt), { addSuffix: true })}
                  </span>
                </div>
              </a>
              <button
                onClick={() => handleRemoveResource(resource)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0"
                disabled={loading}
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
              </button>
            </div>
          ))}

          {/* Add Resource */}
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger>
              <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary/40 group transition-colors -mx-2 mt-1 text-left">
                <div className="size-8 rounded grid place-items-center border border-dashed border-muted-foreground/30 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:border-muted-foreground/50">
                  <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  Add link
                </span>
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader className="space-y-1">
                <AlertDialogTitle className="text-base font-semibold">
                  Add resource
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  Paste a link to help your team.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {/* Form */}
              <div className="mt-4 space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input 
                    placeholder="e.g. PRD, Design specs, API doc" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Link */}
                <div className="space-y-1">
                  <Label className="text-xs">Link</Label>
                  <Input 
                    placeholder="https://…" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Paste a Google Doc, Notion, Figma, or any public URL
                  </p>
                </div>

              </div>

              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel onClick={() => { setTitle(""); setUrl(""); }}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleAddResource}
                  disabled={loading || !title.trim() || !url.trim()}
                >
                  {loading ? "Adding..." : "Add resource"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      {/* 5. Latest Update Section */}
      <section>
        <SectionTitle
          action={
            <Button
              variant="link"
              className="h-auto p-0 text-primary font-normal text-xs"
            >
              New update
            </Button>
          }
        >
          Latest Update
        </SectionTitle>

        <Card className="bg-linear-to-br from-card to-card/50 border-border/40 shadow-sm overflow-hidden">
          <div className="p-4 space-y-3">
            {/* Header of card */}
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-green-500/20 font-normal"
              >
                On track
              </Badge>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>2h ago</span>
              </div>
            </div>

            {/* Update Content */}
            <p className="text-sm text-foreground/90 leading-relaxed">
              We've completed the initial design phase and are moving into
              development. All core requirements have been finalized.
            </p>

            {/* Footer */}
            <div className="pt-2 flex items-center gap-2">
              <Avatar className="size-5">
                <AvatarImage src="" />
                <AvatarFallback className="text-[10px]">AC</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground font-medium">
                Alex Chen
              </span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
