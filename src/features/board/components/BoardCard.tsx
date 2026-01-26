import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BoardItem } from "../types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { forwardRef, memo } from "react";
import { InlinePrioritySelect } from "@/features/projects/components/inline/InlinePrioritySelect";
import { InlineLeadSelect } from "@/features/projects/components/inline/InlineLeadSelect";
import { CalendarButton } from "@/components/Common/CalendarButton";
import type {
  MemberOption,
  ProjectPriority,
} from "@/features/projects/components/projects.types";

interface BoardCardProps {
  item: BoardItem;
  membersOptions: MemberOption[];
  onPriorityChange: (projectId: string, value: string | null) => void;
  onLeadChange: (projectId: string, value: string | null) => void;
  onTargetDateChange: (projectId: string, date: Date | undefined) => void;
}

export const BoardCard = memo(
  ({
    item,
    membersOptions,
    onPriorityChange,
    onLeadChange,
    onTargetDateChange,
  }: BoardCardProps) => {
    const {
      setNodeRef,
      attributes,
      listeners,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: item.id,
      data: {
        type: "BoardItem",
        item,
      },
    });

    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
    };

    if (isDragging) {
      return (
        <div ref={setNodeRef} style={style} className="p-2">
          <Card className="h-24 border-dashed border" />
        </div>
      );
    }

    return (
      <ItemCard
        ref={setNodeRef}
        style={style}
        item={item}
        membersOptions={membersOptions}
        onPriorityChange={onPriorityChange}
        onLeadChange={onLeadChange}
        onTargetDateChange={onTargetDateChange}
        {...attributes}
        {...listeners}
      />
    );
  },
);
BoardCard.displayName = "BoardCard";

interface ItemCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDragStart" | "onDragEnd"
> {
  item: BoardItem;
  isOverlay?: boolean;
  membersOptions?: MemberOption[];
  onPriorityChange?: (projectId: string, value: string | null) => void;
  onLeadChange?: (projectId: string, value: string | null) => void;
  onTargetDateChange?: (projectId: string, date: Date | undefined) => void;
}

export const ItemCard = forwardRef<HTMLDivElement, ItemCardProps>(
  (
    {
      item,
      isOverlay,
      className,
      style,
      membersOptions = [],
      onPriorityChange,
      onLeadChange,
      onTargetDateChange,
      ...props
    },
    ref,
  ) => {
    const targetDate = item.targetDate ? new Date(item.targetDate) : undefined;

    return (
      <div
        ref={ref}
        style={style}
        className={cn(
          "group p-1 relative touch-none",
          isOverlay && "cursor-grabbing rotate-3 z-50",
          className,
        )}
        {...props}
      >
        <Card
          className={cn(
            "p-3 rounded cursor-grab group-active:cursor-grabbing hover:border-primary/50 transition-colors shadow-sm hover:bg-secondary/50",
            isOverlay && "ring-2 ring-primary shadow-xl",
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <div className="flex-1" >
                {/* Title */}
                <h3 className="font-medium text-sm leading-tight line-clamp-2 text-wrap">
                  {item.title}
                </h3>
              </div>

                {/* Actions row */}
                <div className="flex items-center  gap-1">
                  <div className="flex items-center gap-1">
                    <InlinePrioritySelect
                      value={item.priority as ProjectPriority}
                      onChange={(value) => onPriorityChange?.(item.id, value)}
                      showLabel={false}
                    />
                  </div>
                  <InlineLeadSelect
                    value={item.lead}
                    onChange={(value) => onLeadChange?.(item.id, value)}
                    members={membersOptions}
                    showLabel={false}
                  />
                </div>
            </div>

            {/* Summary (if exists) */}
            {item.summary && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.summary}
              </p>
            )}

            <div>
              <CalendarButton
                type="Target"
                date={targetDate}
                onDateChange={(date) => onTargetDateChange?.(item.id, date)}
                btnVariant="ghost"
              />
            </div>
          </div>
        </Card>
      </div>
    );
  },
);
ItemCard.displayName = "ItemCard";
