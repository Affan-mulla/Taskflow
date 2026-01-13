"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "../ui/separator"

interface MenuOption {
  value: string
  label: string
  icon: any
  color?: string // For specific status colors (e.g., orange for backlog)
}

interface ComboboxActionButtonProps {
  menu: MenuOption[]
  label: string
}

export function ComboboxActionButton({ menu, label }: ComboboxActionButtonProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  // Find the currently selected item to show its icon and label in the trigger
  const selectedItem = React.useMemo(() => 
    menu.find((item) => item.value === value), 
    [menu, value]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size={"sm"}
        >
          {/* Dynamic Icon: Shows selected item's icon or the default icon for the category */}
          <HugeiconsIcon 
            icon={selectedItem?.icon || menu[0]?.icon} 
            className={cn("size-3.5", selectedItem?.color || "text-zinc-500")}
            strokeWidth={2}
          />
          
          <span className="truncate">
            {selectedItem ? selectedItem.label : label}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="p-0"
        align="start"
        sideOffset={8}
      >
        <Command className="bg-transparent">
          <CommandInput 
            placeholder={`Search ${label.toLowerCase()}...`}   />
            <CommandSeparator  className="my-2"/>

          <CommandList className="max-h-70 scrollbar-hide">

            <CommandEmpty className="py-4 text-xs text-center text-muted-foreground">
              No results found.
            </CommandEmpty>
            
            <CommandGroup className="">
              <p className="text-muted-foreground text-xs font-semibold">
                Change {label}
              </p>
              
              {menu.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  >
                  <HugeiconsIcon 
                    icon={item.icon} 
                    className={cn("size-4", item.color || "text-muted-foreground")} 
                    strokeWidth={2}
                  />
                  
                  <span className="flex-1 text-sm font-medium">{item.label}</span>

                  {/* Right-aligned Checkmark */}
                  {value === item.value && (
                    <HugeiconsIcon 
                      icon={Tick01Icon} 
                      className="size-3.5 text-indigo-400" 
                      strokeWidth={3}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}