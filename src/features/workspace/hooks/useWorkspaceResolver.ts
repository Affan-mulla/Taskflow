import { useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useWorkspaceStore } from "@/shared/store/store.workspace";

/**
 * URL-driven workspace resolution hook.
 *
 * This hook is the SINGLE SOURCE OF TRUTH for active workspace.
 * It reads the workspaceUrl from route params and syncs it with Zustand.
 *
 * Architecture:
 * - URL drives state, not the other way around
 * - Workspace switching = URL change = state change = listener reattach
 * - No manual state management needed in UI components
 *
 * Edge cases handled:
 * - Invalid workspace URL → redirect to first available workspace
 * - User loses access → fallback gracefully
 * - Preserves sub-path when switching workspaces (e.g., /projects stays /projects)
 */
export function useWorkspaceResolver() {
  const { workspaceUrl } = useParams<{ workspaceUrl: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    getWorkspaceByUrl,
    resetWorkspaceData,
  } = useWorkspaceStore();

  // Track previous workspace ID for cleanup detection
  const previousWorkspaceIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Wait until workspaces are loaded
    if (workspaces.length === 0) return;

    // No URL param yet (shouldn't happen in WorkspaceLayout, but safety check)
    if (!workspaceUrl) return;

    // Find the workspace matching the URL
    const targetWorkspace = getWorkspaceByUrl(workspaceUrl);

    if (!targetWorkspace) {
      // Invalid workspace URL - redirect to first available workspace
      const fallbackWorkspace = workspaces[0];
      if (fallbackWorkspace) {
        // Preserve the sub-path when redirecting
        const subPath = location.pathname
          .split("/")
          .slice(2)
          .join("/");
        const newPath = `/${fallbackWorkspace.workspaceUrl}${subPath ? `/${subPath}` : ""}`;
        navigate(newPath, { replace: true });
      }
      return;
    }

    // Check if we're actually switching workspaces
    const isWorkspaceSwitch =
      previousWorkspaceIdRef.current !== null &&
      previousWorkspaceIdRef.current !== targetWorkspace.id;

    // If switching workspaces, reset all workspace-scoped data first
    if (isWorkspaceSwitch) {
      resetWorkspaceData();
    }

    // Update active workspace if different
    if (activeWorkspace?.id !== targetWorkspace.id) {
      setActiveWorkspace(targetWorkspace);
    }

    // Track current workspace ID for next comparison
    previousWorkspaceIdRef.current = targetWorkspace.id;
  }, [
    workspaceUrl,
    workspaces,
    activeWorkspace?.id,
    getWorkspaceByUrl,
    setActiveWorkspace,
    resetWorkspaceData,
    navigate,
    location.pathname,
  ]);

  return {
    /** The resolved workspace from URL (null if still resolving or invalid) */
    resolvedWorkspace: activeWorkspace,
    /** True if workspaces are loaded but URL doesn't match any */
    isInvalidWorkspace:
      workspaces.length > 0 &&
      workspaceUrl !== undefined &&
      !getWorkspaceByUrl(workspaceUrl),
    /** True if still loading/resolving */
    isResolving: workspaces.length === 0 || !activeWorkspace,
  };
}
