import { ComboboxActionButton } from "@/components/Common/ComboBoxActionButton";
import type { MemberOption } from "../projects.types";

interface InlineLeadSelectProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  members: MemberOption[];
  showLabel?: boolean;
}

/**
 * Inline lead/assignee selector for project rows/cards.
 * Displays avatar for selected member.
 */
export function InlineLeadSelect({ 
  value, 
  onChange, 
  members,
  showLabel = true 
}: InlineLeadSelectProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ComboboxActionButton
        menu={members}
        label="Lead"
        value={value || null}
        onChange={onChange}
        showLabel={showLabel}
      />
    </div>
  );
}
