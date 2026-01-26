import { useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BoardColumn } from "./BoardColumn";
import { ItemCard } from "./BoardCard";
import type { BoardItem, BoardItemStatus, BoardColumnConfig } from "../types";
import { createPortal } from "react-dom";
import { STATUS_OPTIONS, type MemberOption, type ProjectPriority, type ProjectStatus } from "@/features/projects/components/projects.types";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUpdateProject } from "@/features/projects/hooks/useUpdateProject";
import { UserIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// Constants
// ============================================================================

const COLUMNS: BoardColumnConfig[] = STATUS_OPTIONS.map(option => ({
  id: option.value as BoardItemStatus,
  title: option.label
}));

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Transforms project data from store to BoardItem format
 */
function projectToBoardItem(project: { 
  id?: string; 
  name: string; 
  status?: string; 
  priority?: string;
  lead?: string;
  targetDate?: string;
  summary?: string;
}): BoardItem {
  return {
    id: project.id ?? "",
    title: project.name,
    status: (project.status as BoardItemStatus) || "planned",
    priority: (project.priority as ProjectPriority) || "no-priority",
    lead: project.lead,
    targetDate: project.targetDate,
    summary: project.summary,
  };
}

/**
 * Groups items by their status
 */
function groupItemsByStatus(items: BoardItem[]): Record<BoardItemStatus, BoardItem[]> {
  const groups: Record<BoardItemStatus, BoardItem[]> = {
    planned: [],
    "in-progress": [],
    completed: [],
    cancelled: [],
  };
  
  items.forEach((item) => {
    if (groups[item.status]) {
      groups[item.status].push(item);
    }
  });
  
  return groups;
}

// ============================================================================
// Main Component
// ============================================================================

export default function BoardContent() {
  // Store data
  const { projects, projectsLoading, members: workspaceMembers } = useWorkspaceStore();
  const { updatePriority, updateStatus, updateLead, updateTargetDate } = useUpdateProject();
  
  // Local state for drag operations
  const [activeId, setActiveId] = useState<string | null>(null);

  // Transform projects to board items
  const boardItems = useMemo(() => 
    projects.map(projectToBoardItem), 
    [projects]
  );

  // Group items by status
  const groupedItems = useMemo(() => 
    groupItemsByStatus(boardItems), 
    [boardItems]
  );

  // Transform workspace members to member options
  const membersOptions = useMemo<MemberOption[]>(() =>
    workspaceMembers.map((member) => ({
      value: member.userId,
      label: member.userName,
      icon: UserIcon,
      avatarUrl: member.avatarUrl,
      email: member.email,
    })),
    [workspaceMembers]
  );

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const onDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const onDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveItem = active.data.current?.type === "BoardItem";
    const isOverItem = over.data.current?.type === "BoardItem";
    const overColumnId = over.data.current?.type === "Column" ? over.id : null;

    if (!isActiveItem) return;

    // Handle status change when dragging to different column
    if (overColumnId) {
      const activeItem = boardItems.find((item) => item.id === activeId);
      if (activeItem && activeItem.status !== overColumnId) {
        updateStatus(activeId, overColumnId as ProjectStatus);
      }
    }

    if (isOverItem) {
      const overItem = boardItems.find((item) => item.id === overId);
      const activeItem = boardItems.find((item) => item.id === activeId);
      
      if (overItem && activeItem && activeItem.status !== overItem.status) {
        updateStatus(activeId, overItem.status as ProjectStatus);
      }
    }
  }, [boardItems, updateStatus]);

  const onDragEnd = useCallback(() => {
    setActiveId(null);
  }, []);

  // ============================================================================
  // Inline Edit Handlers
  // ============================================================================

  const handlePriorityChange = useCallback((projectId: string, value: string | null) => {
    if (value) {
      updatePriority(projectId, value as ProjectPriority);
    }
  }, [updatePriority]);

  const handleLeadChange = useCallback((projectId: string, value: string | null) => {
    if (value) {
      updateLead(projectId, value);
    }
  }, [updateLead]);

  const handleTargetDateChange = useCallback((projectId: string, date: Date | undefined) => {
    updateTargetDate(projectId, date?.toISOString());
  }, [updateTargetDate]);

  // ============================================================================
  // Render
  // ============================================================================

  const activeItem = boardItems.find((item) => item.id === activeId);

  if (projectsLoading) {
    return (
      <div className="flex h-full px-4 pt-4 pb-2 space-x-3">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col w-full min-w-90 h-full rounded-md bg-sidebar">
            <div className="p-3">
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="px-2 space-y-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex flex-col h-full items-start">
        <ScrollArea className="w-full whitespace-nowrap h-full" orientation="horizontal">
          <div className="flex w-fit h-full px-4 pt-4 pb-2 space-x-3">
            {COLUMNS.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                items={groupedItems[col.id]}
                membersOptions={membersOptions}
                onPriorityChange={handlePriorityChange}
                onLeadChange={handleLeadChange}
                onTargetDateChange={handleTargetDateChange}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeItem ? (
            <ItemCard 
              item={activeItem} 
              isOverlay 
              membersOptions={membersOptions}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
