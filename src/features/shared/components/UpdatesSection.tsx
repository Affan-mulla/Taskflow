import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link04Icon, Delete02Icon, Add01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import AvatarImg from "@/components/Common/AvatarImage";
import type { Update, UpdateStatus, UpdateLink } from "@/shared/types/db";
import type { MemberOption } from "@/features/projects/components/projects.types";

// ============================================================================
// Types
// ============================================================================

export interface UpdatesSectionProps {
  updates: Update[];
  loading: boolean;
  members: MemberOption[];
  onAddUpdate: (content: string, status: UpdateStatus, links: UpdateLink[]) => Promise<{ success: boolean; error?: string }>;
  onRemoveUpdate?: (updateId: string) => Promise<{ success: boolean; error?: string }>;
  currentUserId?: string;
  viewAllLink?: string; // Optional link to dedicated updates page
  maxPreviewUpdates?: number; // Limit updates shown in overview (undefined = show all)
}

// ============================================================================
// Status Config
// ============================================================================

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

// ============================================================================
// Section Title (matches existing style)
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
// Update Composer
// ============================================================================

interface UpdateComposerProps {
  onSubmit: (content: string, status: UpdateStatus, links: UpdateLink[]) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

function UpdateComposer({ onSubmit, onCancel, isSubmitting }: UpdateComposerProps) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<UpdateStatus>("on-track");
  const [links, setLinks] = useState<UpdateLink[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const handleAddLink = () => {
    if (linkTitle.trim() && linkUrl.trim()) {
      setLinks([...links, { title: linkTitle.trim(), url: linkUrl.trim() }]);
      setLinkTitle("");
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await onSubmit(content, status, links);
  };

  return (
    <Card className="bg-card border-border/40 shadow-sm">
      <div className="p-4 space-y-4">
        {/* Status Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(statusConfig) as UpdateStatus[]).map((s) => {
              const config = statusConfig[s];
              const isSelected = status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
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

        {/* Update Content */}
        <textarea
          placeholder="What's the latest? Share progress, blockers, or next steps..."
          className="w-full min-h-24 bg-transparent outline-none border border-border/40 rounded-md p-3 text-sm resize-none focus:border-primary/50 transition-colors"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />

        {/* Links Section */}
        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-2 py-1 bg-secondary/50 rounded-md text-xs"
              >
                <HugeiconsIcon icon={Link04Icon} className="size-3" />
                <span className="text-foreground/80">{link.title}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Link Input */}
        {showLinkInput ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Link title"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              className="text-sm h-8"
            />
            <Input
              placeholder="https://..."
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="text-sm h-8"
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkTitle("");
                  setLinkUrl("");
                }}
                className="h-8"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddLink}
                disabled={!linkTitle.trim() || !linkUrl.trim()}
                className="h-8"
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowLinkInput(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={Add01Icon} className="size-3" />
            Add link
          </button>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post update"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// Update Item
// ============================================================================

interface UpdateItemProps {
  update: Update;
  member?: MemberOption;
  onDelete?: () => void;
  canDelete: boolean;
}

function UpdateItem({ update, member, onDelete, canDelete }: UpdateItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const config = statusConfig[update.status] || statusConfig["on-track"];

  // Convert Firestore Timestamp to Date
  const createdAt = update.createdAt instanceof Timestamp
    ? update.createdAt.toDate()
    : new Date(update.createdAt as any);

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Link";
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.();
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="bg-card border-border/40 shadow-sm overflow-hidden">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-6 shrink-0">
              <AvatarImg
                src={member?.avatarUrl}
                fallbackText={member?.label?.charAt(0) || "?"}
              />
            </div>
            <span className="text-sm font-medium text-foreground/90 truncate">
              {member?.label || "Unknown"}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="secondary"
              className={`${config.bgClass} ${config.textClass} ${config.borderClass} border font-normal text-xs`}
            >
              {config.label}
            </Badge>
            {canDelete && onDelete && (
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger>
                  <button
                    className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-3.5" strokeWidth={2} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Update</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The update will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                      variant={"destructive"}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {update.content}
        </p>

        {/* Links */}
        {update.links && update.links.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {update.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2 py-1 bg-secondary/50 hover:bg-secondary rounded-md text-xs transition-colors group"
              >
                <HugeiconsIcon
                  icon={Link04Icon}
                  className="size-3 text-muted-foreground group-hover:text-foreground"
                />
                <span className="text-foreground/80 group-hover:text-foreground">
                  {link.title}
                </span>
                <span className="text-muted-foreground">
                  · {getHostname(link.url)}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================================================
// Update List
// ============================================================================

interface UpdateListProps {
  updates: Update[];
  members: MemberOption[];
  currentUserId?: string;
  onRemoveUpdate?: (updateId: string) => Promise<{ success: boolean; error?: string }>;
}

function UpdateList({ updates, members, currentUserId, onRemoveUpdate }: UpdateListProps) {
  const getMember = (userId: string) => members.find((m) => m.value === userId);

  if (updates.length === 0) {
    return (
      <Card className="bg-card/50 border-border/40 shadow-sm">
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground/70 italic">
            No updates yet. Click "New update" to share progress.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {updates.map((update) => (
        <UpdateItem
          key={update.id}
          update={update}
          member={getMember(update.createdBy)}
          canDelete={update.createdBy === currentUserId}
          onDelete={
            onRemoveUpdate
              ? () => onRemoveUpdate(update.id)
              : undefined
          }
        />
      ))}
    </div>
  );
}

// ============================================================================
// Main Component: UpdatesSection
// ============================================================================

export function UpdatesSection({
  updates,
  loading,
  members,
  onAddUpdate,
  onRemoveUpdate,
  currentUserId,
  viewAllLink,
  maxPreviewUpdates,
}: UpdatesSectionProps) {
  const [isComposing, setIsComposing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    content: string,
    status: UpdateStatus,
    links: UpdateLink[]
  ) => {
    setIsSubmitting(true);
    const result = await onAddUpdate(content, status, links);
    setIsSubmitting(false);

    if (result.success) {
      setIsComposing(false);
    }
  };

  // Limit updates displayed if maxPreviewUpdates is set
  const displayedUpdates = maxPreviewUpdates
    ? updates.slice(0, maxPreviewUpdates)
    : updates;

  const hasMoreUpdates = maxPreviewUpdates && updates.length > maxPreviewUpdates;

  if (loading) {
    return (
      <section>
        <SectionTitle>Updates</SectionTitle>
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionTitle
        action={
          <Button
            variant="link"
            className="h-auto p-0 text-primary font-normal text-xs"
            onClick={() => setIsComposing(!isComposing)}
          >
            {isComposing ? "Cancel" : "New update"}
          </Button>
        }
      >
        Updates {updates.length > 0 && `(${updates.length})`}
      </SectionTitle>

      <div className="space-y-4">
        {isComposing && (
          <UpdateComposer
            onSubmit={handleSubmit}
            onCancel={() => setIsComposing(false)}
            isSubmitting={isSubmitting}
          />
        )}

        <UpdateList
          updates={displayedUpdates}
          members={members}
          currentUserId={currentUserId}
          onRemoveUpdate={onRemoveUpdate}
        />

        {/* View All Updates Link */}
        {viewAllLink && hasMoreUpdates && (
          <div className="pt-2">
            <Link to={viewAllLink}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2 text-muted-foreground hover:text-foreground"
              >
                View all {updates.length} updates
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Or just a simple link if showing all updates */}
        {viewAllLink && !hasMoreUpdates && updates.length > 3 && (
          <div className="pt-2">
            <Link to={viewAllLink}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2 text-muted-foreground hover:text-foreground"
              >
                View all updates
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default UpdatesSection;
