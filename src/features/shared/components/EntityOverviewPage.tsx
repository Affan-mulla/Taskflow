import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Link04Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import AvatarImg from "@/components/Common/AvatarImage";

// Inline Editors
import { InlineStatusSelect } from "@/features/projects/components/inline/InlineStatusSelect";
import { InlinePrioritySelect } from "@/features/projects/components/inline/InlinePrioritySelect";
import { InlineAssigneeSelect } from "@/features/projects/components/inline/InlineAssigneeSelect";
import { InlineLeadSelect } from "@/features/projects/components/inline/InlineLeadSelect";
import type {
  ProjectPriority,
  MemberOption,
} from "@/features/projects/components/projects.types";
import type { IssueStatus, TaskAttachment, ProjectResource } from "@/shared/types/db";

// ============================================================================
// Types
// ============================================================================

export interface EntityOverviewProps {
  // Entity Type
  entityType: "project" | "task";
  
  // Loading State
  loading?: boolean;
  
  // Header
  icon: any; // Hugeicons icon
  title: string;
  summary?: string;
  
  // Properties
  status: string;
  priority: string;
  lead?: string; // For projects
  assignees?: string[]; // For tasks
  startDate: Date | null;
  targetDate: Date | null;
  
  // Content
  description?: string;
  
  // Metadata
  createdBy?: string;
  createdAt?: Date;
  
  // Resources/Attachments
  items?: TaskAttachment[] | ProjectResource[]; // Attachments for tasks, Resources for projects
  
  // Members
  members: MemberOption[];
  
  // Handlers
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onLeadChange?: (value: string) => void; // For projects
  onAssigneesChange?: (value: string[]) => void; // For tasks
  onDateChange: (field: "startDate" | "targetDate", date: Date | null) => void;
  onSummaryChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onAddItem?: (title: string, url: string) => Promise<boolean>;
  onRemoveItem?: (item: TaskAttachment | ProjectResource, index: number) => Promise<void>;
  
  // Navbar
  navbar: React.ReactNode;
}

// ============================================================================
// Styles
// ============================================================================

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

export function EntityOverviewPage({
  entityType,
  loading = false,
  icon,
  title,
  summary,
  status,
  priority,
  lead,
  assignees = [],
  startDate,
  targetDate,
  description,
  createdBy,
  createdAt,
  items = [],
  members,
  onStatusChange,
  onPriorityChange,
  onLeadChange,
  onAssigneesChange,
  onDateChange,
  onSummaryChange,
  onDescriptionChange,
  onAddItem,
  onRemoveItem,
  navbar,
}: EntityOverviewProps) {
  if (loading) {
    return <PageSkeleton />;
  }

  // Get assignee members
  const assigneeMembers = entityType === "task"
    ? members.filter((m) => assignees.includes(m.value))
    : [];

  const creator = members.find((m) => m.value === createdBy);

  return (
    <div className="w-full h-full">
      {navbar}
      <Separator />
      <ScrollArea className="h-full w-full">
        <div className="flex justify-center w-full bg-background">
          <div className="w-full max-w-220 px-6 py-10 pb-20 flex flex-col gap-10">
            {/* 1. Header Section */}
            <header className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                {/* Entity Icon */}
                <div className="mt-1.5 grid place-items-center size-8 rounded-lg bg-secondary/50 text-muted-foreground outline-1">
                  <HugeiconsIcon
                    icon={icon}
                    className="size-5"
                    strokeWidth={2}
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
                    {title}
                  </h1>
                  <input
                    placeholder={`${entityType === "project" ? "Project" : "Task"} Summary...`}
                    className="outline-none border-none p-0 m-0 text-md font-light placeholder:italic text-foreground/90 font-sans w-full"
                    defaultValue={summary}
                    onBlur={(e) => {
                      const newValue = e.target.value.trim();
                      if (newValue !== summary && onSummaryChange) {
                        onSummaryChange(newValue);
                      }
                    }}
                  />
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
                  value={status as IssueStatus}
                  onChange={(val) => val && onStatusChange(val)}
                  entityType={entityType}
                  showLabel={false}
                />
              </div>

              {/* Priority */}
              <div className="flex items-center">
                <InlinePrioritySelect
                  value={priority as ProjectPriority}
                  onChange={(val) => val && onPriorityChange(val)}
                  showLabel={false}
                />
              </div>

              {/* Lead (Projects) or Assignees (Tasks) */}
              {entityType === "project" && onLeadChange ? (
                <div className="flex items-center">
                  <InlineLeadSelect
                    value={lead || ""}
                    onChange={(val) => val && onLeadChange(val)}
                    members={members}
                    showLabel={false}
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <InlineAssigneeSelect
                    value={assignees}
                    onChange={(val) => onAssigneesChange?.(val)}
                    members={members}
                  />
                </div>
              )}

              {/* Date Range */}
              <div className="flex items-center text-sm text-foreground/80 px-2 py-1 rounded-md cursor-pointer transition-colors group">
                <CalendarButton
                  type="Start"
                  date={startDate || undefined}
                  onDateChange={(date) => onDateChange("startDate", date || null)}
                  btnVariant="ghost"
                />
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  className="size-4 text-muted-foreground"
                />
                <CalendarButton
                  type="Target"
                  date={targetDate || undefined}
                  onDateChange={(date) => onDateChange("targetDate", date || null)}
                  btnVariant="ghost"
                />
              </div>
            </section>

            {/* 3. Two-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column: Lead/Assignees or Resources */}
              {entityType === "task" ? (
                <section>
                  <SectionTitle>Assignees</SectionTitle>
                  <div className="flex flex-col gap-2">
                    {assigneeMembers.length === 0 ? (
                      <div className="text-sm text-muted-foreground italic">
                        No assignees yet
                      </div>
                    ) : (
                      assigneeMembers.map((member) => (
                        <div
                          key={member.value}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/40 transition-colors -mx-2"
                        >
                          <div className="size-8">
                            <AvatarImg
                              src={member.avatarUrl}
                              fallbackText={member.label.charAt(0)}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground/90">
                              {member.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              ) : (
                <ItemsSection
                  title="Resources"
                  items={items as ProjectResource[]}
                  onAddItem={onAddItem}
                  onRemoveItem={onRemoveItem}
                  entityType="project"
                />
              )}

              {/* Right Column: Attachments/Resources or Updates */}
              {entityType === "task" ? (
                <ItemsSection
                  title="Attachments"
                  items={items as TaskAttachment[]}
                  onAddItem={onAddItem}
                  onRemoveItem={onRemoveItem}
                  entityType="task"
                />
              ) : (
                <UpdatesSection assigneeMembers={assigneeMembers} />
              )}
            </div>

            {/* Updates Section for Tasks */}
            {entityType === "task" && (
              <UpdatesSection assigneeMembers={assigneeMembers} />
            )}

            {/* 4. Description Section */}
            <section className="group/desc">
              <SectionTitle>Description</SectionTitle>
              <div className="relative min-h-30 text-base leading-7 text-foreground/90 max-w-none">
                <textarea
                  defaultValue={description}
                  placeholder="Add a detailed description..."
                  className="w-full min-h-30 resize-none font-light placeholder:italic bg-transparent outline-none border-none p-0 m-0 text-base leading-7 text-foreground/90 font-sans"
                  onBlur={(e) => {
                    const newValue = e.target.value.trim();
                    if (newValue !== description && onDescriptionChange) {
                      onDescriptionChange(newValue);
                    }
                  }}
                />
              </div>
            </section>

            {/* 5. Metadata Section */}
            <section className="pt-6 border-t border-border/40">
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                {creator && (
                  <div className="flex items-center gap-2">
                    <span>Created by</span>
                    <div className="flex items-center gap-1.5">
                      <div className="size-4">
                        <AvatarImg
                          src={creator.avatarUrl}
                          fallbackText={creator.label.charAt(0)}
                        />
                      </div>
                      <span className="font-medium text-foreground/80">
                        {creator.label}
                      </span>
                    </div>
                    {createdAt && (
                      <span>
                        {formatDistanceToNow(createdAt, { addSuffix: true })}
                      </span>
                    )}
                  </div>
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
// Items Section (Resources/Attachments)
// ============================================================================

interface ItemsSectionProps {
  title: string;
  items: TaskAttachment[] | ProjectResource[];
  onAddItem?: (title: string, url: string) => Promise<boolean>;
  onRemoveItem?: (item: TaskAttachment | ProjectResource, index: number) => Promise<void>;
  entityType: "project" | "task";
}

function ItemsSection({ title, items, onAddItem, onRemoveItem, entityType }: ItemsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const getHostname = (urlString: string) => {
    try {
      return new URL(urlString).hostname.replace("www.", "");
    } catch {
      return "Link";
    }
  };

  const handleAddItem = async () => {
    if (!itemTitle.trim() || !url.trim() || !onAddItem) return;

    setLoading(true);
    const success = await onAddItem(itemTitle, url);
    if (success) {
      setItemTitle("");
      setUrl("");
      setIsDialogOpen(false);
    }
    setLoading(false);
  };

  const handleRemoveItem = async (item: TaskAttachment | ProjectResource, index: number) => {
    if (!onRemoveItem) return;
    setLoading(true);
    await onRemoveItem(item, index);
    setLoading(false);
  };

  const getItemTimestamp = (item: TaskAttachment | ProjectResource) => {
    if ('addedAt' in item) {
      return ` • Added ${formatDistanceToNow(new Date(item.addedAt), { addSuffix: true })}`;
    }
    return '';
  };

  return (
    <section>
      <SectionTitle
        action={
          onAddItem && (
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <HugeiconsIcon icon={Link04Icon} className="size-3.5" />
                  Add
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Add {entityType === "project" ? "Resource" : "Attachment"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {entityType === "project" 
                      ? "Add a link to external resources, documents, or files."
                      : "Add a link to external resources, documents, or files."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder={entityType === "project" ? "e.g., PRD, Design specs" : "e.g., Design Mockup"}
                      value={itemTitle}
                      onChange={(e) => setItemTitle(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => { setItemTitle(""); setUrl(""); }}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddItem} disabled={loading}>
                    Add {entityType === "project" ? "Resource" : "Attachment"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )
        }
      >
        {title}
      </SectionTitle>

      <div className="flex flex-col gap-1">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground italic">
            No {title.toLowerCase()} yet
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/40 group transition-colors -mx-2"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div className="size-8 rounded grid place-items-center bg-secondary/50 text-muted-foreground group-hover:text-foreground group-hover:bg-secondary shrink-0">
                  <HugeiconsIcon icon={Link04Icon} className="size-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground/90 truncate">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {getHostname(item.url)}{getItemTimestamp(item)}
                  </span>
                </div>
              </a>
              {onRemoveItem && (
                <button
                  onClick={() => handleRemoveItem(item, index)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0"
                  disabled={loading}
                >
                  <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// ============================================================================
// Updates Section
// ============================================================================

interface UpdatesSectionProps {
  assigneeMembers: MemberOption[];
}

function UpdatesSection({ assigneeMembers }: UpdatesSectionProps) {
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [updateStatus, setUpdateStatus] = useState<"on-track" | "at-risk" | "off-track" | "completed">("on-track");

  const statusConfig = {
    "on-track": {
      label: "On track",
      bgClass: "bg-green-500/10",
      textClass: "text-green-600 dark:text-green-400",
      hoverClass: "hover:bg-green-500/20",
      borderClass: "border-green-500/20",
    },
    "at-risk": {
      label: "At risk",
      bgClass: "bg-yellow-500/10",
      textClass: "text-yellow-600 dark:text-yellow-400",
      hoverClass: "hover:bg-yellow-500/20",
      borderClass: "border-yellow-500/20",
    },
    "off-track": {
      label: "Off track",
      bgClass: "bg-red-500/10",
      textClass: "text-red-600 dark:text-red-400",
      hoverClass: "hover:bg-red-500/20",
      borderClass: "border-red-500/20",
    },
    "completed": {
      label: "Completed",
      bgClass: "bg-blue-500/10",
      textClass: "text-blue-600 dark:text-blue-400",
      hoverClass: "hover:bg-blue-500/20",
      borderClass: "border-blue-500/20",
    },
  };

  const handleAddUpdate = () => {
    // TODO: Implement add update functionality
    console.log("Adding update:", { updateText, updateStatus });
    setIsAddingUpdate(false);
    setUpdateText("");
    setUpdateStatus("on-track");
  };

  return (
    <section>
      <SectionTitle
        action={
          <Button
            variant="link"
            className="h-auto p-0 text-primary font-normal text-xs"
            onClick={() => setIsAddingUpdate(!isAddingUpdate)}
          >
            {isAddingUpdate ? "Cancel" : "New update"}
          </Button>
        }
      >
        Latest Update
      </SectionTitle>

      {isAddingUpdate ? (
        <Card className="bg-card border-border/40 shadow-sm">
          <div className="p-4 space-y-4">
            {/* Status Selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <div className="flex gap-2">
                {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
                  const config = statusConfig[status];
                  const isSelected = updateStatus === status;
                  return (
                    <button
                      key={status}
                      onClick={() => setUpdateStatus(status)}
                      className={`text-xs px-2 py-1 rounded-md transition-colors ${
                        isSelected
                          ? `${config.bgClass} ${config.textClass} ${config.borderClass} border`
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Update Text */}
            <textarea
              placeholder="What's the latest? Share progress, blockers, or next steps..."
              className="w-full min-h-24 bg-transparent outline-none border border-border/40 rounded-md p-3 text-sm resize-none focus:border-primary/50 transition-colors"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingUpdate(false);
                  setUpdateText("");
                  setUpdateStatus("on-track");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddUpdate}
                disabled={!updateText.trim()}
              >
                Post update
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-linear-to-br from-card to-card/50 border-border/40 shadow-sm overflow-hidden">
          <div className="p-4 space-y-3">
            {/* Header of card */}
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className={`${statusConfig["on-track"].bgClass} ${statusConfig["on-track"].textClass} ${statusConfig["on-track"].hoverClass} ${statusConfig["on-track"].borderClass} border font-normal`}
              >
                On track
              </Badge>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>No updates yet</span>
              </div>
            </div>

            {/* Placeholder Content */}
            <p className="text-sm text-muted-foreground/70 leading-relaxed italic">
              No updates have been posted yet. Click "New update" to share progress.
            </p>

            {/* Footer with assignees */}
            {assigneeMembers.length > 0 && (
              <div className="pt-2 flex items-center gap-2">
                <div className="flex items-center -space-x-2">
                  {assigneeMembers.slice(0, 3).map((member) => (
                    <div key={member.value} className="size-6 ring-2 ring-background rounded-full overflow-hidden">
                      <AvatarImg
                        src={member.avatarUrl}
                        fallbackText={member.label.charAt(0)}
                      />
                    </div>
                  ))}
                  {assigneeMembers.length > 3 && (
                    <div className="size-6 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center ring-2 ring-background text-secondary-foreground">
                      +{assigneeMembers.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {assigneeMembers.length} {assigneeMembers.length === 1 ? 'assignee' : 'assignees'}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
    </section>
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
