import { ComboboxMultiSelect } from "@/components/Common/ComboBoxActionButton";
import type { MemberOption } from "@/features/projects/components/projects.types";

interface InlineAssigneesSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  members: MemberOption[];
  showLabel?: boolean;
}

/**
 * Inline multi-assignee selector for task cards.
 * Displays avatars for selected members.
 */
export function InlineAssigneesSelect({
  value,
  onChange,
  members,
}: InlineAssigneesSelectProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ComboboxMultiSelect
        menu={members}
        label="Assignees"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
