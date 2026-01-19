import { ComboboxActionButton } from "@/components/Common/ComboBoxActionButton";
import { PRIORITY_OPTIONS, type ProjectPriority } from "../projects.types";

interface InlinePrioritySelectProps {
  value: ProjectPriority | string | undefined;
  onChange: (value: string | null) => void;
  showLabel?: boolean;
}

/**
 * Inline priority selector for project rows/cards.
 * Thin wrapper around ComboboxActionButton with priority-specific config.
 */
export function InlinePrioritySelect({ 
  value, 
  onChange, 
  showLabel = false 
}: InlinePrioritySelectProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ComboboxActionButton
        menu={PRIORITY_OPTIONS}
        label="Priority"
        value={value || "low"}
        onChange={onChange}
        showLabel={showLabel}
      />
    </div>
  );
}
