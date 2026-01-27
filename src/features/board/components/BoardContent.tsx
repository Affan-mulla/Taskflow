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
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BoardColumn } from "./BoardColumn";
import { ItemCard } from "./BoardCard";
import type { BoardItem, BoardViewMode } from "../types";
import { createPortal } from "react-dom";
import type {
  MemberOption,
  ProjectPriority,
  ProjectStatus,
} from "@/features/projects/components/projects.types";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUpdateProject } from "@/features/projects/hooks/useUpdateProject";
import { UserIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoardView } from "../context/BoardViewContext";
import {
  getColumnsForViewMode,
  groupItemsByViewMode,
} from "../utils/board.utils";

// ============================================================================
// Constants
// ============================================================================

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
    status: (project.status as ProjectStatus) || "planned",
    priority: (project.priority as ProjectPriority) || "no-priority",
    lead: project.lead,
    targetDate: project.targetDate,
    summary: project.summary,
  };
}

/**
 * Gets the update function based on view mode
 */
function getUpdateHandler(
  viewMode: BoardViewMode,
  updateStatus: (id: string, status: ProjectStatus) => void,
  updatePriority: (id: string, priority: ProjectPriority) => void,
  updateLead: (id: string, lead: string) => void
) {
  return (itemId: string, columnId: string) => {
    switch (viewMode) {
      case "status":
        updateStatus(itemId, columnId as ProjectStatus);
        break;
      case "priority":
        updatePriority(itemId, columnId as ProjectPriority);
        break;
      case "lead":
        // For unassigned column, clear the lead by passing empty string
        // For member columns, assign the lead
        const leadValue = columnId === "unassigned" ? "" : columnId;
        updateLead(itemId, leadValue);
        break;
    }
  };
}

// ============================================================================
// Main Component
// ============================================================================

export default function BoardContent() {
  // Context
  const { viewMode } = useBoardView();

  // Store data
  const { projects, projectsLoading, members: workspaceMembers } = useWorkspaceStore();
  const { updatePriority, updateStatus, updateLead, updateTargetDate } = useUpdateProject();

  // Local state for drag operations
  const [activeId, setActiveId] = useState<string | null>(null);

  // Transform projects to board items
  const boardItems = useMemo(
    () => projects.map(projectToBoardItem),
    [projects]
  );

  // Transform workspace members to member options
  const membersOptions = useMemo<MemberOption[]>(
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

  // Get columns based on view mode
  const columns = useMemo(
    () => getColumnsForViewMode(viewMode, membersOptions),
    [viewMode, membersOptions]
  );

  // Group items based on view mode
  const groupedItems = useMemo(
    () => groupItemsByViewMode(boardItems, viewMode, membersOptions),
    [boardItems, viewMode, membersOptions]
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

  // Unified update handler for drag operations
  const handleColumnUpdate = useMemo(
    () => getUpdateHandler(viewMode, updateStatus, updatePriority, updateLead),
    [viewMode, updateStatus, updatePriority, updateLead]
  );

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const onDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId === overId) return;

      const isActiveItem = active.data.current?.type === "BoardItem";
      const isOverColumn = over.data.current?.type === "Column";
      const isOverItem = over.data.current?.type === "BoardItem";

      if (!isActiveItem) return;

      const activeItem = boardItems.find((item) => item.id === activeId);
      if (!activeItem) return;

      // Handle dragging to a column
      if (isOverColumn) {
        const targetColumnId = overId;
        const currentValue = getCurrentValueForViewMode(activeItem, viewMode);

        if (currentValue !== targetColumnId) {
          handleColumnUpdate(activeId, targetColumnId);
        }
      }

      // Handle dragging over another item
      if (isOverItem) {
        const overItem = boardItems.find((item) => item.id === overId);
        if (!overItem) return;

        const activeValue = getCurrentValueForViewMode(activeItem, viewMode);
        const overValue = getCurrentValueForViewMode(overItem, viewMode);

        if (activeValue !== overValue && overValue) {
          handleColumnUpdate(activeId, overValue);
        }
      }
    },
    [boardItems, viewMode, handleColumnUpdate]
  );

  const onDragEnd = useCallback(() => {
    setActiveId(null);
  }, []);

  // ============================================================================
  // Inline Edit Handlers
  // ============================================================================

  const handlePriorityChange = useCallback(
    (projectId: string, value: string | null) => {
      if (value) {
        updatePriority(projectId, value as ProjectPriority);
      }
    },
    [updatePriority]
  );

  const handleLeadChange = useCallback(
    (projectId: string, value: string | null) => {
      if (value) {
        updateLead(projectId, value);
      }
    },
    [updateLead]
  );

  const handleTargetDateChange = useCallback(
    (projectId: string, date: Date | undefined) => {
      updateTargetDate(projectId, date?.toISOString());
    },
    [updateTargetDate]
  );

  // ============================================================================
  // Render
  // ============================================================================

  const activeItem = boardItems.find((item) => item.id === activeId);

  if (projectsLoading) {
    return (
      <div className="flex h-full px-4 pt-4 pb-2 space-x-3">
        {columns.slice(0, 4).map((col) => (
          <div
            key={col.id}
            className="flex flex-col w-full min-w-90 h-full rounded-md bg-sidebar"
          >
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
        <ScrollArea
          className="w-full whitespace-nowrap h-full"
          orientation="horizontal"
        >
          <div className="flex w-fit h-full px-4 pt-4 pb-2 space-x-3">
            {columns.map((col) => (
              <div key={col.id} className="shrink-0">
                <BoardColumn
                  column={col}
                  items={groupedItems[col.id] || []}
                  viewMode={viewMode}
                  membersOptions={membersOptions}
                  onPriorityChange={handlePriorityChange}
                  onLeadChange={handleLeadChange}
                  onTargetDateChange={handleTargetDateChange}
                />
              </div>
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

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the current value for an item based on view mode
 */
function getCurrentValueForViewMode(
  item: BoardItem,
  viewMode: BoardViewMode
): string {
  switch (viewMode) {
    case "status":
      return item.status;
    case "priority":
      return item.priority;
    case "lead":
      return item.lead || "unassigned";
    default:
      return item.priority;
  }
}
