import { useState, useMemo, useCallback } from "react";
import { UserIcon } from "@hugeicons/core-free-icons";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import type { Project } from "@/shared/types/db";
import type { ProjectPriority, ProjectStatus, MemberOption } from "./projects.types";

interface UseProjectInlineEditReturn {
  /** Local project state with optimistic updates */
  localProject: Project;
  /** Workspace members formatted for ComboboxActionButton */
  membersOptions: MemberOption[];
  /** Currently selected lead member */
  currentLead: MemberOption | undefined;
  /** Handlers for inline field updates */
  handlers: {
    onStatusChange: (value: string | null) => void;
    onPriorityChange: (value: string | null) => void;
    onLeadChange: (value: string | null) => void;
    onTargetDateChange: (date: Date | undefined) => void;
  };
}

/**
 * Hook for managing inline project editing state.
 * Provides optimistic local updates for status, priority, lead, and target date.
 * 
 * @param project - The project to edit
 * @returns Local state, member options, and change handlers
 */
export function useProjectInlineEdit(project: Project): UseProjectInlineEditReturn {
  const [localProject, setLocalProject] = useState<Project>(project);
  const { members: workspaceMembers } = useWorkspaceStore();

  // Transform workspace members for ComboboxActionButton
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

  // Find current lead member
  const currentLead = useMemo(
    () => membersOptions.find((m) => m.value === localProject.lead),
    [membersOptions, localProject.lead]
  );

  // Handlers for inline updates
  const onStatusChange = useCallback(
    (newStatus: string | null) => {
      if (newStatus) {
        setLocalProject((prev) => ({ ...prev, status: newStatus as ProjectStatus }));
        // TODO: Persist to backend
      }
    },
    []
  );

  const onPriorityChange = useCallback(
    (newPriority: string | null) => {
      if (newPriority) {
        setLocalProject((prev) => ({ ...prev, priority: newPriority as ProjectPriority }));
        // TODO: Persist to backend
      }
    },
    []
  );

  const onLeadChange = useCallback(
    (newLeadId: string | null) => {
      if (newLeadId) {
        setLocalProject((prev) => ({ ...prev, lead: newLeadId }));
        // TODO: Persist to backend
      }
    },
    []
  );

  const onTargetDateChange = useCallback(
    (newDate: Date | undefined) => {
      setLocalProject((prev) => ({ ...prev, targetDate: newDate?.toISOString() }));
      // TODO: Persist to backend
    },
    []
  );

  return {
    localProject,
    membersOptions,
    currentLead,
    handlers: {
      onStatusChange,
      onPriorityChange,
      onLeadChange,
      onTargetDateChange,
    },
  };
}
