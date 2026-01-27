import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { BoardViewMode } from "../types";

// ============================================================================
// Types
// ============================================================================

interface BoardViewContextValue {
  viewMode: BoardViewMode;
  setViewMode: (mode: BoardViewMode) => void;
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
  defaultView?: BoardViewMode;
}

export function BoardViewProvider({ 
  children, 
  defaultView = "priority" 
}: BoardViewProviderProps) {
  const [viewMode, setViewModeState] = useState<BoardViewMode>(defaultView);

  const setViewMode = useCallback((mode: BoardViewMode) => {
    setViewModeState(mode);
  }, []);

  return (
    <BoardViewContext.Provider value={{ viewMode, setViewMode }}>
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
