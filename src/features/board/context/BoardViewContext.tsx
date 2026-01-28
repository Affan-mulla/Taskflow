import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { BoardViewMode, BoardEntityType } from "../types";

// ============================================================================
// Types
// ============================================================================

interface BoardViewContextValue {
  entityType: BoardEntityType;
  viewMode: BoardViewMode;
  setViewMode: (mode: BoardViewMode) => void;
  /** Project ID - only set when entityType is "task" */
  projectId?: string;
}

// ============================================================================
// Context
// ============================================================================

const BoardViewContext = createContext<BoardViewContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface BoardViewProviderProps {
  children: ReactNode;
  /** The type of entity this board displays */
  entityType?: BoardEntityType;
  /** Default view mode */
  defaultView?: BoardViewMode;
  /** Project ID for task boards */
  projectId?: string;
}

export function BoardViewProvider({ 
  children, 
  entityType = "project",
  defaultView = "priority",
  projectId,
}: BoardViewProviderProps) {
  const [viewMode, setViewModeState] = useState<BoardViewMode>(defaultView);

  const setViewMode = useCallback((mode: BoardViewMode) => {
    setViewModeState(mode);
  }, []);

  return (
    <BoardViewContext.Provider value={{ entityType, viewMode, setViewMode, projectId }}>
      {children}
    </BoardViewContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useBoardView(): BoardViewContextValue {
  const context = useContext(BoardViewContext);
  
  if (!context) {
    throw new Error("useBoardView must be used within a BoardViewProvider");
  }
  
  return context;
}
