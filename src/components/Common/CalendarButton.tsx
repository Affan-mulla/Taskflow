"use client"

import * as React from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import { CalendarBlockIcon, CalendarCheckOut01Icon } from "@hugeicons/core-free-icons"

export function CalendarButton({ type, date, onDateChange, btnVariant = "outline" }: {   
  type: string; 
  date?: Date | undefined; 
  onDateChange?: (date: Date | undefined) => void;
  btnVariant?: "outline" | "default" | "ghost";
}) {
  // Ensure date is valid before formatting
  const validDate = date instanceof Date && !isNaN(date.getTime()) ? date : undefined;
  
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={btnVariant}
          data-empty={!date}
            size={"sm"}
        >
         {
            type === "Target" ? <HugeiconsIcon icon={CalendarBlockIcon} strokeWidth={2} className="size-4 text-muted-foreground"/> : <HugeiconsIcon icon={CalendarCheckOut01Icon} strokeWidth={2} className="size-4 text-muted-foreground"     />
         }
          {validDate ? format(validDate, "PPP") : type}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={validDate} onSelect={onDateChange} />
      </PopoverContent>
    </Popover>
  )
}