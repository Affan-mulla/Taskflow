import { CalendarButton } from "@/components/Common/CalendarButton";
import { toDate } from "../projects.utils";

interface InlineTargetDateProps {
  value: Date | string | undefined;
  onChange: (date: Date | undefined) => void;
}

/**
 * Inline target date picker for project rows/cards.
 * Handles Firestore Timestamp conversion automatically.
 */
export function InlineTargetDate({ value, onChange }: InlineTargetDateProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <CalendarButton
        type="Target"
        date={toDate(value)}
        onDateChange={onChange}
      />
    </div>
  );
}
