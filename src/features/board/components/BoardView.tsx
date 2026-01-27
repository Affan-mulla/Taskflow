import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FullSignalFreeIcons,
  StatusFreeIcons,
  User,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useBoardView } from "../context/BoardViewContext";
import type { BoardViewMode } from "../types";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ViewOption {
  value: BoardViewMode;
  label: string;
  icon: typeof StatusFreeIcons;
}

// ============================================================================
// Constants
// ============================================================================

const VIEW_OPTIONS: ViewOption[] = [
  { value: "status", label: "Status", icon: StatusFreeIcons },
  { value: "priority", label: "Priority", icon: FullSignalFreeIcons },
  { value: "lead", label: "Lead", icon: User },
];

// ============================================================================
// Component
// ============================================================================

const BoardView = () => {
  const { viewMode, setViewMode } = useBoardView();

  const currentView = VIEW_OPTIONS.find((opt) => opt.value === viewMode);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="gap-2 group">
            {currentView && (
              <HugeiconsIcon
                icon={currentView.icon}
                strokeWidth={2}
                className="size-3.5 text-muted-foreground group-hover:text-foreground"
              />
            )}
            {currentView?.label ?? "View"}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Group by</DropdownMenuLabel>
          {VIEW_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setViewMode(option.value)}
              className={cn(
                "flex items-center justify-between cursor-pointer",
                viewMode === option.value && "bg-accent"
              )}
            >
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={option.icon}
                  strokeWidth={2}
                  className="size-4"
                />
                {option.label}
              </div>
              {viewMode === option.value && (
                <HugeiconsIcon
                  icon={Tick01Icon}
                  strokeWidth={2}
                  className="size-4 text-primary"
                />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BoardView;