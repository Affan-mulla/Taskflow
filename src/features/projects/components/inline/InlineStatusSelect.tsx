import { ComboboxActionButton } from "@/components/Common/ComboBoxActionButton";
import { STATUS_OPTIONS, type ProjectStatus } from "../projects.types";

interface InlineStatusSelectProps {
  value: ProjectStatus | string | undefined;
  onChange: (value: string | null) => void;
  showLabel?: boolean;
}

/**
 * Inline status selector for project rows/cards.
 * Thin wrapper around ComboboxActionButton with status-specific config.
 */
export function InlineStatusSelect({ 
  value, 
  onChange, 
  showLabel = false 
}: InlineStatusSelectProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ComboboxActionButton
      btnVariant="ghost"
        menu={STATUS_OPTIONS}
        label="Status"
        value={value || "planned"}
        onChange={onChange}
        showLabel={showLabel}
        btnSize="icon-sm"
      />
    </div>
  );
}
