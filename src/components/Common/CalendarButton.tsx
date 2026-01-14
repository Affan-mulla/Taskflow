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

export function CalendarButton({    type}: {type: string}) {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          data-empty={!date}
            size={"sm"}
        >
         {
            type === "Target" ? <HugeiconsIcon icon={CalendarCheckOut01Icon} strokeWidth={2} className="size-4 text-muted-foreground"/> : <HugeiconsIcon icon={CalendarBlockIcon} strokeWidth={2} className="size-4 text-muted-foreground"     />
         }
          {date ? format(date, "PPP") : type}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}