import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { BoardColumnConfig, BoardItem, BoardItemStatus } from "../types";
import { BoardCard } from "./BoardCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG, type MemberOption } from "@/features/projects/components/projects.types";
import { memo } from "react";

interface BoardColumnProps {
  column: BoardColumnConfig;
  items: BoardItem[];
  membersOptions: MemberOption[];
  onPriorityChange: (projectId: string, value: string | null) => void;
  onLeadChange: (projectId: string, value: string | null) => void;
  onTargetDateChange: (projectId: string, date: Date | undefined) => void;
}

const statusColors: Record<BoardItemStatus, string> = {
  planned: "text-muted-foreground",
  "in-progress": "text-yellow-500",
  completed: "text-green-500",
  cancelled: "text-red-500",
};

export const BoardColumn = memo(({ 
  column, 
  items,
  membersOptions,
  onPriorityChange,
  onLeadChange,
  onTargetDateChange 
}: BoardColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const statusConfig = STATUS_CONFIG[column.id as BoardItemStatus];

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-full min-w-90 h-full rounded-md bg-sidebar border border-transparent"
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between group">
        <div className="flex items-center gap-2">
          {statusConfig && (
            <HugeiconsIcon
              icon={statusConfig.icon}
              className={cn("size-4", statusColors[column.id])}
              strokeWidth={2}
            />
          )}
          <h2 className="font-semibold text-sm">{column.title}</h2>
          <span className="text-muted-foreground text-xs font-medium ml-1">
            {items.length}
          </span>
        </div>
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
                membersOptions={membersOptions}
                onPriorityChange={onPriorityChange}
                onLeadChange={onLeadChange}
                onTargetDateChange={onTargetDateChange}
              />
            ))}
            {items.length === 0 && (
              <div className="h-20 flex items-center justify-center text-muted-foreground text-xs border-dashed border rounded-md bg-muted/10">
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
