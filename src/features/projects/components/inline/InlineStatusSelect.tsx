import { ComboboxActionButton } from "@/components/Common/ComboBoxActionButton";
import { STATUS_OPTIONS, TASK_STATUS_OPTIONS, type ProjectStatus, type EntityType } from "../projects.types";
import type { IssueStatus } from "@/shared/types/db";

interface InlineStatusSelectProps {
  value: ProjectStatus | IssueStatus | string | undefined;
  onChange: (value: string | null) => void;
  showLabel?: boolean;
  entityType?: EntityType;
}

/**
 * Inline status selector for project/task rows.
 * Uses different options based on entity type.
 */
export function InlineStatusSelect({ 
  value, 
  onChange, 
  showLabel = false,
  entityType = "project",
}: InlineStatusSelectProps) {
  const options = entityType === "task" ? TASK_STATUS_OPTIONS : STATUS_OPTIONS;
  const defaultValue = entityType === "task" ? "todo" : "planned";
  
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ComboboxActionButton
        btnVariant="ghost"
        menu={options}
        label="Status"
        value={value || defaultValue}
        onChange={onChange}
        showLabel={showLabel}
        btnSize="icon-sm"
      />
    </div>
  );
}
