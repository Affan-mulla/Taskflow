import { ComboboxActionButton } from "@/components/Common/ComboBoxActionButton";
import { Folder01Icon } from "@hugeicons/core-free-icons";

interface ProjectOption {
  value: string;
  label: string;
}

interface InlineProjectSelectProps {
  value: string | undefined;
  onChange: (value: string | null) => void;
  projects: ProjectOption[];
  showLabel?: boolean;
}

/**
 * Inline project selector for task rows.
 * Used in "all tasks" view to change task's project.
 */
export function InlineProjectSelect({ 
  value, 
  onChange, 
  projects,
  showLabel = true 
}: InlineProjectSelectProps) {
  // Transform projects to match MenuOption format
  const projectOptions = projects.map(p => ({
    value: p.value,
    label: p.label,
    icon: Folder01Icon,
  }));

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ComboboxActionButton
        btnVariant="ghost"
        menu={projectOptions}
        label="Project"
        value={value || null}
        onChange={onChange}
        showLabel={showLabel}
        btnSize="sm"
      />
    </div>
  );
}
