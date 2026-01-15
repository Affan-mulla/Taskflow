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
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Add01Icon,
  PackageIcon,
  UserIcon,
  Close,
  Progress03Icon,
  Progress01FreeIcons,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  LowSignalIcon,
  MediumSignalIcon,
  FullSignalIcon,
  AlertSquareIcon,
  DashedLine01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Separator } from "../ui/separator";
import { ComboboxActionButton } from "./ComboBoxActionButton";
// NOTE: ComboboxMultiSelect import removed - project-level member selection disabled
// import { ComboboxMultiSelect } from "./ComboBoxActionButton";
import { CalendarButton } from "./CalendarButton";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import {
  addProjectSchema,
  type AddProjectFormInput,
  type AddProjectFormValues,
  defaultFormValues,
  transformToPayload,
} from "@/features/projects/validation/addProject";
import { useCreateProject } from "@/features/projects/hooks/useCreateProject";
import { Spinner } from "../ui/spinner";

// Status options configuration
const STATUS_OPTIONS = [
  { value: "planned", label: "Planned", icon: Progress01FreeIcons },
  { value: "in-progress", label: "In Progress", icon: Progress03Icon },
  { value: "completed", label: "Completed", icon: CheckmarkCircle01Icon },
  { value: "cancelled", label: "Cancelled", icon: CancelCircleIcon },
] as const;

// Priority options configuration
const PRIORITY_OPTIONS = [
  { value: "none", label: "No Priority", icon: DashedLine01Icon },
  { value: "urgent", label: "Urgent", icon: AlertSquareIcon },
  { value: "high", label: "High", icon: FullSignalIcon },
  { value: "medium", label: "Medium", icon: MediumSignalIcon },
  { value: "low", label: "Low", icon: LowSignalIcon },
] as const;

const AddProject = () => {
  const [open, setOpen] = useState(false);
  const { members: workspaceMembers, activeWorkspace } = useWorkspaceStore();
  const { loading: createLoading, createProject } = useCreateProject();

  // Transform workspace members into menu options
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

  // Initialize React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    reset,
    // NOTE: watch and setValue preserved for future project-level member selection
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    watch: _watch,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setValue: _setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddProjectFormInput, unknown, AddProjectFormValues>({
    resolver: zodResolver(addProjectSchema),
    defaultValues: defaultFormValues,
  });

  // NOTE: leadValue watch removed - project-level member selection disabled
  // Uncomment if re-enabling project-level members:
  // const leadValue = watch("lead");

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
  const onSubmit = async (data: AddProjectFormValues) => {
    // Validate workspace is selected
    if (!activeWorkspace?.id) {
      toast.error("No workspace selected", {
        description: "Please select a workspace before creating a project.",
      });
      return;
    }

    const payload = transformToPayload(data);
    
    // Add workspaceId to payload
    const fullPayload = {
      ...payload,
      workspaceId: activeWorkspace.id,
    };

    const result = await createProject(fullPayload);

    // Only reset and close on success
    if (result.success) {
      reset(defaultFormValues);
      setOpen(false);
    }
  };

  // Handle modal close - reset form
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset(defaultFormValues);
    }
  };

  // NOTE: handleLeadRemove disabled - project-level member selection disabled
  // Uncomment if re-enabling project-level members:
  // const handleLeadRemove = () => {
  //   setValue("lead", null);
  // };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className={"w-full"}>
        <Button className="gap-2 w-full" size="sm">
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
          Add Project
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-2xl! w-full overflow-hidden border border-border bg-card"
        showCloseButton={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="flex flex-row justify-between items-center w-full gap-2">
            {/* Custom Header / Breadcrumbs */}
            <div className="flex items-center w-fit">
              <div className="flex items-center gap-1 text-xs font-medium tracking-tight">
                <div className="flex items-center px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
                  <span className="uppercase text-[10px] font-bold">{activeWorkspace?.workspaceName}</span>
                </div>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">New project</span>
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

          <div className="space-y-4">
            {/* Project Icon Selector */}
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="text-muted-foreground"
            >
              <HugeiconsIcon icon={PackageIcon} className="size-5" />
            </Button>

            {/* Title Input - Required */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Project name"
                  className="w-full bg-transparent text-2xl font-semibold outline-none border-none p-0"
                  autoFocus
                  autoComplete="off"
                />
              )}
            />

            {/* Summary Input - Optional */}
            <Controller
              name="summary"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value ?? ""}
                  type="text"
                  placeholder="Add a short summary..."
                  className="w-full bg-transparent text-sm outline-none border-none p-0"
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
                    menu={STATUS_OPTIONS as unknown as Array<{ value: string; label: string; icon: any }>}
                    label="Status"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Priority - single select */}
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <ComboboxActionButton
                    menu={PRIORITY_OPTIONS as unknown as Array<{ value: string; label: string; icon: any }>}
                    label="Priority"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Lead - single select, can be null */}
              <Controller
                name="lead"
                control={control}
                render={({ field }) => (
                  <ComboboxActionButton
                    menu={membersOptions}
                    label="Lead"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* 
                PROJECT-LEVEL MEMBER SELECTION - DISABLED
                ==========================================
                Project-level access control has been disabled in favor of 
                workspace-level access. All workspace members can access all projects.
                
                To re-enable project-level member selection:
                1. Uncomment the Controller below
                2. Update transformToPayload in addProject.ts to use membersTouched logic
                3. Update projects.create.ts to write members array to Firestore
                4. Re-enable access field handling in the data model
              */}
              {/* <Controller
                name="members"
                control={control}
                render={({ field }) => (
                  <ComboboxMultiSelect
                    menu={membersOptions}
                    label="Members"
                    value={field.value ?? []}
                    onChange={(newMembers) => {
                      // Mark membersTouched when user interacts
                      setValue("membersTouched", true);
                      field.onChange(newMembers);
                    }}
                    leadId={leadValue}
                    onLeadRemove={handleLeadRemove}
                  />
                )}
              /> */}

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

              {/* Target Date */}
              <Controller
                name="targetDate"
                control={control}
                render={({ field }) => (
                  <CalendarButton
                    type="Target"
                    date={field.value ?? undefined}
                    onDateChange={(date) => field.onChange(date ?? null)}
                  />
                )}
              />
            </div>

            <Separator />

            {/* Description Area - Optional */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Write a description, a project brief, or collect ideas..."
                  className="w-full h-60 bg-transparent outline-none border-none p-0 resize-none leading-relaxed"
                />
              )}
            />
          </div>

          {/* Footer Actions */}
          <DialogFooter className="mt-4">
            <div className="flex items-center justify-end gap-3">
              <DialogClose>
                <Button type="button" variant="ghost" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size="sm" disabled={isSubmitting || createLoading}>
                {isSubmitting || createLoading ? <><Spinner /> Creating...</> : "Create project"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProject;
