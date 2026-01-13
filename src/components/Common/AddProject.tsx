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
  UserGroupIcon,
  Calendar01Icon,
  TargetIcon,
  Close,
  Progress03Icon,
  Progress01FreeIcons,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  LowSignalIcon,
  MediumSignalIcon,
  FullSignalIcon,
  AlertSquareIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Separator } from "../ui/separator";
import { ComboboxActionButton } from "./ComboBoxActionButton";
import { CalendarButton } from "./CalendarButton";


const AddProject = () => {
    const status = [
    {value: "planned", label: "Planned", icon: Progress01FreeIcons},
    {value: "in-progress", label: "In Progress", icon: Progress03Icon},
    {value: "completed", label: "Completed", icon: CheckmarkCircle01Icon },
    {value: "cancelled", label: "Cancelled", icon: CancelCircleIcon},
    ]
    const Priority = [
    {value: "urgent", label: "Urgent", icon: AlertSquareIcon },
    {value: "low", label: "Low", icon: LowSignalIcon },
    {value: "medium", label: "Medium", icon: MediumSignalIcon},
    {value: "high", label: "High", icon: FullSignalIcon},
    ]
    const lead = [
    {value: "john-doe", label: "John Doe", icon: UserIcon},
    {value: "jane-smith", label: "Jane Smith", icon: UserIcon},
    {value: "bob-johnson", label: "Bob Johnson", icon: UserIcon},
    {value: "alice-brown", label: "Alice Brown", icon: UserIcon},
    ]
    const members = [
    {value: "john-doe", label: "John Doe", icon: UserGroupIcon},
    {value: "jane-smith", label: "Jane Smith", icon: UserGroupIcon},
    {value: "bob-johnson", label: "Bob Johnson", icon: UserGroupIcon},
    {value: "alice-brown", label: "Alice Brown", icon: UserGroupIcon},
    {value: "charlie-wilson", label: "Charlie Wilson", icon: UserGroupIcon},
    ]
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="gap-2" size="sm">
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
          Add Project
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-2xl! w-full overflow-hidden border border-border bg-card"
        showCloseButton={false}
      >
        <DialogHeader className=" flex flex-row justify-between items-center w-full gap-2">
          {/* Custom Header / Breadcrumbs */}
          <div className="flex items-center w-fit">
            <div className="flex items-center gap-1 text-xs font-medium tracking-tight">
              <div className="flex items-center px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
                <span className="uppercase text-[10px] font-bold">Axo</span>
              </div>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">New project</span>
            </div>
          </div>
          <DialogClose>
          <Button
            variant={"ghost"}
            className={"text-muted-foreground"}
            size={"icon"}
          >
            <HugeiconsIcon icon={Close} strokeWidth={2} className="size-4" />
          </Button>
          </DialogClose>
        </DialogHeader>
        <Separator />
        <div className=" space-y-4">
          {/* Project Icon Selector */}
          <Button variant="outline" size="icon-lg" className={"text-muted-foreground"}>
            <HugeiconsIcon
              icon={PackageIcon}
              className="size-5"
            />
          </Button>

          {/* Title and Summary Inputs */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Project name"
              className="w-full bg-transparent text-2xl font-semibold outline-none border-none p-0"
              autoFocus
            />
            <input
              type="text"
              placeholder="Add a short summary..."
              className="w-full bg-transparent text-sm outline-none border-none p-0"
            />
          </div>

          {/* Action Row Buttons */}
          <div className="flex flex-wrap gap-2">
            <ComboboxActionButton menu={status} label="Status"/>
            <ComboboxActionButton menu={Priority} label="Priority"/>
            <ComboboxActionButton menu={lead} label="Lead" />
            <ComboboxActionButton menu={members} label="Members" />
            <CalendarButton type="Start"/>
            <CalendarButton type="Target"/>
          </div>

          <Separator />

          {/* Description Area */}
          <textarea
            placeholder="Write a description, a project brief, or collect ideas..."
            className="w-full h-40 bg-transparent  outline-none border-none p-0 resize-none leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <DialogFooter>
          <div className="flex items-center justify-end gap-3 ">
            <Button variant="ghost" size="sm" onClick={() => {}}>
              Cancel
            </Button>
            <Button size="sm">Create project</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProject;
