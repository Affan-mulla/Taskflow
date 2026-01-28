import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { BoardColumnConfig, BoardItem, BoardViewMode, BoardEntityType } from "../types";
import { BoardCard } from "./BoardCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { MemberOption } from "@/features/projects/components/projects.types";
import { memo } from "react";
import { getColumnDisplayConfig } from "../utils/board.utils";
import AvatarImg from "@/components/Common/AvatarImage";

// ============================================================================
// Types
// ============================================================================

interface BoardColumnProps {
  column: BoardColumnConfig;
  items: BoardItem[];
  viewMode: BoardViewMode;
  entityType: BoardEntityType;
  membersOptions: MemberOption[];
  onPriorityChange: (itemId: string, value: string | null) => void;
  onLeadChange: (itemId: string, value: string | null) => void;
  onAssigneesChange: (itemId: string, value: string[]) => void;
  onTargetDateChange: (itemId: string, date: Date | undefined) => void;
}

// ============================================================================
// Color Configurations
// ============================================================================

// Project status colors
const projectStatusColors: Record<string, string> = {
  planned: "text-muted-foreground",
  "in-progress": "text-yellow-500",
  completed: "text-green-500",
  cancelled: "text-red-500",
};

// Task/Issue status colors
const taskStatusColors: Record<string, string> = {
  backlog: "text-muted-foreground",
  todo: "text-blue-400",
  "in-progress": "text-yellow-500",
  done: "text-green-500",
  cancelled: "text-red-500",
};

const priorityColors: Record<string, string> = {
  "no-priority": "text-muted-foreground",
  urgent: "text-red-500",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
};

// ============================================================================
// Helper Functions
// ============================================================================

function getColumnColor(
  viewMode: BoardViewMode,
  columnId: string,
  entityType: BoardEntityType
): string {
  switch (viewMode) {
    case "status":
      if (entityType === "task") {
        return taskStatusColors[columnId] ?? "text-muted-foreground";
      }
      return projectStatusColors[columnId] ?? "text-muted-foreground";
    case "priority":
      return priorityColors[columnId] ?? "text-muted-foreground";
    case "lead":
    case "assignee":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
  }
}

// ============================================================================
// Component
// ============================================================================

export const BoardColumn = memo(({
  column,
  items,
  viewMode,
  entityType,
  membersOptions,
  onPriorityChange,
  onLeadChange,
  onAssigneesChange,
  onTargetDateChange,
}: BoardColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
      viewMode,
    },
  });

  const displayConfig = getColumnDisplayConfig(viewMode, column.id, membersOptions, entityType);
  const colorClass = getColumnColor(viewMode, column.id, entityType);

  const renderColumnHeader = () => {
    // For lead/assignee view with avatar
    if ((viewMode === "lead" || viewMode === "assignee") && column.title !== "Unassigned") {
      return (
        <div className="flex items-center gap-2">
         <div className="size-5">
          <AvatarImg fallbackText={column.title} src={displayConfig.avatarUrl} />
         </div>
          <h2 className="font-semibold text-sm">{column.title}</h2>
          <span className="text-muted-foreground text-xs font-medium">
            {items.length}
          </span>
        </div>
      );
    }

    // Default icon-based header
    return (
      <div className="flex items-center gap-2">
        {displayConfig.icon && (
          <HugeiconsIcon
            icon={displayConfig.icon}
            className={cn("size-4", colorClass)}
            strokeWidth={2}
          />
        )}
        <h2 className="font-semibold text-sm">{column.title}</h2>
        <span className="text-muted-foreground text-xs font-medium">
          {items.length}
        </span>
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col shrink-0 w-90 h-full rounded-md bg-sidebar border border-transparent"
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between group shrink-0">
        {renderColumnHeader()}
        <Button
          variant="ghost"
          size="icon"
          className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2} />
        </Button>
      </div>

      {/* Item List */}
      <ScrollArea className="flex-1 w-full px-2 pb-2">
        <div className="flex flex-col gap-1 min-h-25">
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <BoardCard
                key={item.id}
                item={item}
                entityType={entityType}
                membersOptions={membersOptions}
                onPriorityChange={onPriorityChange}
                onLeadChange={onLeadChange}
                onAssigneesChange={onAssigneesChange}
                onTargetDateChange={onTargetDateChange}
              />
            ))}
            {items.length === 0 && (
              <div className="h-20 flex items-center justify-center text-muted-foreground text-xs border-dashed border rounded-md bg-muted/10 shrink-0">
                No items
              </div>
            )}
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  );
});

BoardColumn.displayName = "BoardColumn";
