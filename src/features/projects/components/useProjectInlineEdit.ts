import { useState, useMemo, useCallback } from "react";
import { UserIcon } from "@hugeicons/core-free-icons";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import type { Project } from "@/shared/types/db";
import type { ProjectPriority, ProjectStatus, MemberOption } from "./projects.types";
import { useUpdateProject } from "../hooks/useUpdateProject";

interface UseProjectInlineEditReturn {
  /** Local project state with optimistic updates */
  localProject: Project;
  /** Workspace members formatted for ComboboxActionButton */
  membersOptions: MemberOption[];
  /** Currently selected lead member */
  currentLead: MemberOption | undefined;
  /** Loading state for any update operation */
  isUpdating: boolean;
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
  const { updatePriority, updateStatus, updateLead, updateTargetDate, loading } = useUpdateProject();

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
      if (newStatus && project.id) {
        setLocalProject((prev) => ({ ...prev, status: newStatus as ProjectStatus }));
        updateStatus(project.id, newStatus as ProjectStatus);
      }
    },
    [project.id, updateStatus]
  );

  const onPriorityChange = useCallback(
    (newPriority: ProjectPriority | null | string) => {
      if (newPriority && project.id) {
        setLocalProject((prev) => ({ ...prev, priority: newPriority as ProjectPriority }));
        updatePriority(project.id, newPriority as ProjectPriority);
      }
    },
    [project.id, updatePriority]
  );

  const onLeadChange = useCallback(
    (newLeadId: string | null) => {
      if (newLeadId && project.id) {
        setLocalProject((prev) => ({ ...prev, lead: newLeadId }));
        updateLead(project.id, newLeadId);
      }
    },
    [project.id, updateLead]
  );

  const onTargetDateChange = useCallback(
    (newDate: Date | undefined) => {
      if (project.id) {
        const isoDate = newDate?.toISOString();
        setLocalProject((prev) => ({ ...prev, targetDate: isoDate }));
        updateTargetDate(project.id, isoDate);
      }
    },
    [project.id, updateTargetDate]
  );

  return {
    localProject,
    membersOptions,
    currentLead,
    isUpdating: loading,
    handlers: {
      onStatusChange,
      onPriorityChange,
      onLeadChange,
      onTargetDateChange,
    },
  };
}
