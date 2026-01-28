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
import type { IssuePriority, IssueStatus } from "@/shared/types/db";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import { useUpdateProject } from "@/features/projects/hooks/useUpdateProject";
import { useTasks } from "../hooks/useTasks";
import { UserIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoardView } from "../context/BoardViewContext";
import {
  getColumnsForViewMode,
  groupItemsByViewMode,
  taskToBoardItem,
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
 * Gets the update function based on view mode for PROJECTS
 */
function getProjectUpdateHandler(
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
        const leadValue = columnId === "unassigned" ? "" : columnId;
        updateLead(itemId, leadValue);
        break;
    }
  };
}

/**
 * Gets the update function based on view mode for TASKS
 */
function getTaskUpdateHandler(
  viewMode: BoardViewMode,
  updateStatus: (id: string, status: IssueStatus) => void,
  updatePriority: (id: string, priority: IssuePriority) => void,
  updateAssignees: (id: string, assignees: string[]) => void,
  currentItems: BoardItem[]
) {
  return (itemId: string, columnId: string) => {
    switch (viewMode) {
      case "status":
        updateStatus(itemId, columnId as IssueStatus);
        break;
      case "priority":
        updatePriority(itemId, columnId as IssuePriority);
        break;
      case "assignee":
        // For assignee view, we need to handle multi-assignee logic
        const item = currentItems.find((i) => i.id === itemId);
        const currentAssignees = item?.assignees || [];
        
        if (columnId === "unassigned") {
          // Moving to unassigned clears all assignees
          updateAssignees(itemId, []);
        } else {
          // Add the new assignee if not already assigned
          if (!currentAssignees.includes(columnId)) {
            updateAssignees(itemId, [...currentAssignees, columnId]);
          }
        }
        break;
    }
  };
}

// ============================================================================
// Main Component
// ============================================================================

export default function BoardContent() {
  // Context
  const { entityType, viewMode, projectId } = useBoardView();

  // Store data
  const { projects, projectsLoading, members: workspaceMembers } = useWorkspaceStore();
  
  // Project mutations
  const { 
    updatePriority: updateProjectPriority, 
    updateStatus: updateProjectStatus, 
    updateLead: updateProjectLead, 
    updateTargetDate: updateProjectTargetDate 
  } = useUpdateProject();
  
  // Task data & mutations (only used when entityType is "task")
  const { 
    tasks, 
    loading: tasksLoading, 
    updateStatus: updateTaskStatus, 
    updatePriority: updateTaskPriority, 
    updateAssignees: updateTaskAssignees,
    updateTargetDate: updateTaskTargetDate,
  } = useTasks({ projectId: projectId || "" });

  // Local state for drag operations
  const [activeId, setActiveId] = useState<string | null>(null);

  // Transform entities to board items based on entity type
  const boardItems = useMemo(() => {
    if (entityType === "task") {
      return tasks.map(taskToBoardItem);
    }
    return projects.map(projectToBoardItem);
  }, [entityType, projects, tasks]);

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

  // Get columns based on view mode and entity type
  const columns = useMemo(
    () => getColumnsForViewMode(viewMode, membersOptions, entityType),
    [viewMode, membersOptions, entityType]
  );

  // Group items based on view mode and entity type
  const groupedItems = useMemo(
    () => groupItemsByViewMode(boardItems, viewMode, membersOptions, entityType),
    [boardItems, viewMode, membersOptions, entityType]
  );

  // Loading state based on entity type
  const isLoading = entityType === "task" ? tasksLoading : projectsLoading;

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

  // Unified update handler for drag operations based on entity type
  const handleColumnUpdate = useMemo(() => {
    if (entityType === "task") {
      return getTaskUpdateHandler(
        viewMode,
        updateTaskStatus,
        updateTaskPriority,
        updateTaskAssignees,
        boardItems
      );
    }
    return getProjectUpdateHandler(
      viewMode,
      updateProjectStatus,
      updateProjectPriority,
      updateProjectLead
    );
  }, [
    entityType,
    viewMode,
    updateProjectStatus,
    updateProjectPriority,
    updateProjectLead,
    updateTaskStatus,
    updateTaskPriority,
    updateTaskAssignees,
    boardItems,
  ]);

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
  // Inline Edit Handlers (entity-aware)
  // ============================================================================

  const handlePriorityChange = useCallback(
    (itemId: string, value: string | null) => {
      if (!value) return;
      if (entityType === "task") {
        updateTaskPriority(itemId, value as IssuePriority);
      } else {
        updateProjectPriority(itemId, value as ProjectPriority);
      }
    },
    [entityType, updateProjectPriority, updateTaskPriority]
  );

  const handleLeadChange = useCallback(
    (itemId: string, value: string | null) => {
      if (value) {
        updateProjectLead(itemId, value);
      }
    },
    [updateProjectLead]
  );

  const handleAssigneesChange = useCallback(
    (itemId: string, value: string[]) => {
      updateTaskAssignees(itemId, value);
    },
    [updateTaskAssignees]
  );

  const handleTargetDateChange = useCallback(
    (itemId: string, date: Date | undefined) => {
      if (entityType === "task") {
        updateTaskTargetDate(itemId, date?.toISOString());
      } else {
        updateProjectTargetDate(itemId, date?.toISOString());
      }
    },
    [entityType, updateProjectTargetDate, updateTaskTargetDate]
  );

  // ============================================================================
  // Render
  // ============================================================================

  const activeItem = boardItems.find((item) => item.id === activeId);

  if (isLoading) {
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
                  entityType={entityType}
                  membersOptions={membersOptions}
                  onPriorityChange={handlePriorityChange}
                  onLeadChange={handleLeadChange}
                  onAssigneesChange={handleAssigneesChange}
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
              entityType={entityType}
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
    case "assignee":
      // For assignee view, return the first assignee or unassigned
      return item.assignees?.[0] || "unassigned";
    default:
      return item.priority;
  }
}
