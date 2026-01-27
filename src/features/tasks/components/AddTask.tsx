import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Add01Icon,
  UserIcon,
  Close,
  TaskDaily01Icon,
  Progress03FreeIcons,
  View,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Attachment01Icon,
  Delete02Icon,
  Link04Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Separator } from "@/components/ui/separator";
import { ComboboxActionButton, ComboboxMultiSelect } from "@/components/Common/ComboBoxActionButton";
import { CalendarButton } from "@/components/Common/CalendarButton";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUserStore } from "@/shared/store/store.user";
import {
  addTaskSchema,
  type AddTaskFormInput,
  type AddTaskFormValues,
  createDefaultTaskFormValues,
  transformTaskPayload,
} from "../validation/addTask";
import { useCreateTask } from "../hooks/useCreateTask";
import type { LinkAttachment } from "@/db/tasks/tasks.create";
import { Spinner } from "@/components/ui/spinner";

// ============================================================================
// Constants
// ============================================================================

/** Status options for tasks (different from project status) */
const TASK_STATUS_OPTIONS = [
  { value: "todo", label: "To Do", icon: TaskDaily01Icon },
  { value: "in-progress", label: "In Progress", icon: Progress03FreeIcons },
  { value: "in-review", label: "In Review", icon: View },
  { value: "done", label: "Done", icon: CheckmarkCircle01Icon },
  { value: "cancelled", label: "Cancelled", icon: CancelCircleIcon },
];

/** Priority options (shared with projects) */
import { PRIORITY_OPTIONS } from "@/features/projects/components";

// ============================================================================
// Types
// ============================================================================

interface AddTaskProps {
  /** Pre-select a project when opening the dialog */
  defaultProjectId?: string;
  /** Style variant for the trigger button */
  triggerVariant?: "default" | "outline" | "ghost";
}

// ============================================================================
// Component
// ============================================================================

const AddTask = ({ defaultProjectId, triggerVariant = "default" }: AddTaskProps) => {
  const [open, setOpen] = useState(false);
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  // Store link attachments
  const [attachments, setAttachments] = useState<LinkAttachment[]>([]);
  const [attachmentForm, setAttachmentForm] = useState({ title: "", link: "" });
  
  // Stores
  const { members: workspaceMembers, activeWorkspace, projects } = useWorkspaceStore();
  const { user } = useUserStore();
  
  // Hooks
  const { loading: createLoading, createTask } = useCreateTask();

  // Transform workspace members into menu options for assignees
  const membersOptions = useMemo(
    () =>
      workspaceMembers.map((member) => ({
        value: member.userId,
        label: member.userName,
        icon: UserIcon,
        avatarUrl: member.avatarUrl,
        email: member.email,
      })),
    [workspaceMembers]
  );

  // Transform projects into menu options for project selector
  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({
        value: project.id ?? "",
        label: project.name.length > 25 ? `${project.name.substring(0, 25)}...` : project.name,
        icon: undefined,
      })),
    [projects]
  );

  // Get project name for breadcrumb display
  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name ?? "Select project";
  };

  // Initialize React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddTaskFormInput, unknown, AddTaskFormValues>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: createDefaultTaskFormValues(defaultProjectId),
  });

  // Watch projectId for breadcrumb display
  const watchedProjectId = watch("projectId");

  // Show toast notifications for validation errors
  useEffect(() => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean);

    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        toast.error(message as string);
      });
    }
  }, [errors]);

  // Handle form submission
  const onSubmit = async (data: AddTaskFormValues) => {
    // Validate workspace is selected
    if (!activeWorkspace?.id) {
      toast.error("No workspace selected", {
        description: "Please select a workspace before creating a task.",
      });
      return;
    }

    // Validate user is logged in
    if (!user?.id) {
      toast.error("Not authenticated", {
        description: "Please log in to create a task.",
      });
      return;
    }

    const payload = transformTaskPayload(data);

    // Build full payload with attachments
    const fullPayload = {
      ...payload,
      workspaceId: activeWorkspace.id,
      createdBy: user.id,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    const result = await createTask(fullPayload);

    // Only reset and close on success
    if (result.success) {
      reset(createDefaultTaskFormValues(defaultProjectId));
      setAttachments([]);
      setOpen(false);
    }
  };

  // Handle modal close - reset form
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset(createDefaultTaskFormValues(defaultProjectId));
      setAttachments([]);
      setAttachmentForm({ title: "", link: "" });
    }
  };

  // Handle adding attachment
  const handleAddAttachment = () => {
    if (!attachmentForm.title.trim()) {
      toast.error("Please add a title");
      return;
    }

    if (!attachmentForm.link.trim()) {
      toast.error("Please add a link");
      return;
    }

    // Validate URL format
    try {
      new URL(attachmentForm.link);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    const newAttachment: LinkAttachment = {
      title: attachmentForm.title.trim(),
      url: attachmentForm.link.trim(),
    };

    setAttachments([...attachments, newAttachment]);
    setAttachmentForm({ title: "", link: "" });
    setAttachmentOpen(false);
    toast.success("Link added");
  };

  // Handle removing attachment
  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="w-full">
        <Button className="gap-2 w-full" size="sm" variant={triggerVariant}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
          <span className="hidden sm:inline">Create task</span>
          <span className="sm:hidden">Task</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-2xl! w-full overflow-hidden border border-border bg-card top-70"
        showCloseButton={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="flex flex-row justify-between items-center w-full gap-2">
            {/* Breadcrumb Header */}
            <div className="flex items-center w-fit">
              <div className="flex items-center gap-1 text-xs font-medium tracking-tight">
                <div className="flex items-center px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
                  <span className="uppercase text-[10px] font-bold">
                    {activeWorkspace?.workspaceName}
                  </span>
                </div>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">
                  {getProjectName(watchedProjectId)}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">New task</span>
              </div>
            </div>
            <DialogClose>
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground"
                size="icon"
              >
                <HugeiconsIcon icon={Close} strokeWidth={2} className="size-4" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <Separator className="my-4" />

          <div className="space-y-2">

            {/* Title Input - Required */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Task title"
                  className="w-full bg-transparent text-2xl font-semibold outline-none border-none p-0"
                  autoFocus
                  autoComplete="off"
                />
              )}
            />

            {/* Description Area - Optional */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Write a description..."
                  className="w-full h-20 bg-transparent outline-none border-none p-0 resize-none leading-relaxed text-sm"
                />
              )}
            />

            {/* Action Row Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Status - single select */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <ComboboxActionButton
                    menu={TASK_STATUS_OPTIONS}
                    label="Status"
                    value={field.value}
                    onChange={field.onChange}
                    btnSize="sm"
                  />
                )}
              />

              {/* Priority - single select */}
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <ComboboxActionButton
                    menu={PRIORITY_OPTIONS}
                    label="Priority"
                    value={field.value}
                    onChange={field.onChange}
                    btnSize="sm"
                  />
                )}
              />

              {/* Assignees - multi-select */}
              <Controller
                name="assignees"
                control={control}
                render={({ field }) => (
                  <ComboboxMultiSelect
                    menu={membersOptions}
                    label="Assignees"
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Project Selector - single select, required */}
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <ComboboxActionButton
                    menu={projectOptions}
                    label="Project"
                    value={field.value}
                    onChange={(value) => field.onChange(value ?? "")}
                    btnSize="sm"
                  />
                )}
              />

              {/* Start Date */}
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <CalendarButton
                    type="Start"
                    date={field.value ?? undefined}
                    onDateChange={(date) => field.onChange(date ?? null)}
                  />
                )}
              />

              {/* Due Date */}
              <Controller
                name="targetDate"
                control={control}
                render={({ field }) => (
                  <CalendarButton
                    type="Due"
                    date={field.value ?? undefined}
                    onDateChange={(date) => field.onChange(date ?? null)}
                  />
                )}
              />
            </div>

          

            {/* Display Added Attachments */}
            {attachments.length > 0 && (
              <>
                <Separator />
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">Links</h4>
                <div className="flex flex-col gap-1">
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-md bg-secondary/40 group -mx-2"
                    >
                      <div className="size-8 rounded grid place-items-center bg-secondary/50 text-muted-foreground">
                        <HugeiconsIcon icon={Link04Icon} className="size-4" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground/90 truncate">
                          {attachment.title}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {(() => { try { return new URL(attachment.url).hostname; } catch { return attachment.url; } })()}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <DialogFooter className="mt-4">
            <div className="mr-auto flex items-center gap-2">
              <AlertDialog open={attachmentOpen} onOpenChange={setAttachmentOpen}>
                <AlertDialogTrigger>
                  <Button
                    variant={"ghost"}
                    size="icon"
                    type="button"
                    className={"hover:text-foreground text-muted-foreground"}
                    title="Add resource or attachment"
                  >
                    <HugeiconsIcon
                      icon={Attachment01Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader className="space-y-1">
                    <AlertDialogTitle className="text-base font-semibold">
                      Add link
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                      Add a link to help your team access resources.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  {/* Form */}
                  <div className="mt-4 space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input
                        placeholder="e.g. PRD, Design specs, API doc"
                        value={attachmentForm.title}
                        onChange={(e) =>
                          setAttachmentForm({ ...attachmentForm, title: e.target.value })
                        }
                      />
                    </div>

                    {/* Link */}
                    <div className="space-y-1">
                      <Label className="text-xs">Link</Label>
                      <Input
                        placeholder="https://…"
                        value={attachmentForm.link}
                        onChange={(e) =>
                          setAttachmentForm({ ...attachmentForm, link: e.target.value })
                        }
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Paste a Google Doc, Notion, Figma, or any public URL
                      </p>
                    </div>
                  </div>

                  <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAddAttachment}>
                      Add link
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Show attachment count if any */}
              {attachments.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {attachments.length} link{attachments.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center justify-end gap-3">
              <DialogClose>
                <Button type="button" variant="ghost" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || createLoading}
              >
                {isSubmitting || createLoading ? (
                  <>
                    <Spinner /> Creating...
                  </>
                ) : (
                  "Create task"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTask;