import { ComboboxMultiSelect } from "@/components/Common/ComboBoxActionButton";
import type { MemberOption } from "../projects.types";

interface InlineAssigneeSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  members: MemberOption[];
}

/**
 * Inline multi-select for task assignees.
 * Allows selecting multiple team members.
 */
export function InlineAssigneeSelect({ 
  value, 
  onChange, 
  members,
}: InlineAssigneeSelectProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ComboboxMultiSelect
        menu={members}
        label="Assignees"
        value={value}
        onChange={onChange}
        btnVariant="ghost"
        btnSize="icon-sm"
        showLable={false}
      />
    </div>
  );
}
