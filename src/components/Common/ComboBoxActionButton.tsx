"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { HugeiconsIcon } from "@hugeicons/react";
import { Separator } from "../ui/separator";
import AvatarImg from "./AvatarImage";
import AvatarGroupWithCount from "../ui/avatar-group-with-count";

interface MenuOption {
  value: string;
  label: string;
  icon: any;
  color?: string;
}

interface ComboboxActionButtonProps {
  menu: MenuOption[];
  label: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  mode?: "single"; // Currently supports single-select
}

/**
 * ComboboxActionButton - Single-select dropdown component
 * Used for Lead selection (one user max, can be null)
 */
export function ComboboxActionButton({
  menu,
  label,
  value = null,
  onChange,
  mode = "single",
}: ComboboxActionButtonProps) {
  const [open, setOpen] = React.useState(false);

  // Find the currently selected item
  const selectedItem = React.useMemo(
    () => (value ? menu.find((item) => item.value === value) : null),
    [menu, value]
  );

  const handleSelect = (currentValue: string) => {
    // Toggle: if clicking same item, deselect it; otherwise select it
    const newValue = currentValue === value ? null : currentValue;
    onChange?.(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size={"sm"}
          className={!selectedItem ? "text-muted-foreground" : ""}
        >
         {
            label === "Lead" && selectedItem?.value ? (
              <div className="size-5">
                <AvatarImg
                  src={selectedItem ? "/Taskflow.svg" : undefined}
                  alt={selectedItem ? selectedItem.label : "Lead"}
                />
              </div>
            ) : ( <HugeiconsIcon
            icon={selectedItem?.icon || menu[0]?.icon}
            className={cn(
              "size-4",
              selectedItem?.color || "text-muted-foreground",
              selectedItem?.value === "urgent" && "text-orange-400"
            )}
            strokeWidth={2}
          />)
         }

          <span className="truncate">
            {selectedItem ? selectedItem.label : label}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-60" align="start" sideOffset={8}>
        <Command className="bg-transparent">
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandSeparator className="my-1" />

          <CommandList className="max-h-70 scrollbar-hide">
            <CommandEmpty className="py-4 text-xs text-center text-muted-foreground">
              No results found.
            </CommandEmpty>

            <CommandGroup>
              <p className="text-muted-foreground text-xs font-semibold px-2">
                Change {label}
              </p>

              {menu.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  <Checkbox
                    checked={value === item.value}
                    onCheckedChange={() => handleSelect(item.value)}
                  />

                  {label === "Lead" ? (
                    <div className="w-4 h-4">
                      <AvatarImg src="/Taskflow.svg" alt="Members" />
                    </div>
                  ) : (
                    <HugeiconsIcon
                      icon={item.icon}
                      className={cn(
                        "size-4",
                        item.color || "text-muted-foreground"
                      )}
                      strokeWidth={2}
                    />
                  )}

                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface ComboboxMultiSelectProps {
  menu: MenuOption[];
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  defaultValue?: string[];
}

/**
 * ComboboxMultiSelect - Multi-select dropdown component
 * Used for Members selection (multiple users, default all if not touched)
 */
export function ComboboxMultiSelect({
  menu,
  label,
  value,
  onChange,
  defaultValue = [],
}: ComboboxMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (itemValue: string) => {
    const isSelected = value.includes(itemValue);
    const newValue = isSelected
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue];

    onChange(newValue);
  };

  const selectedCount = value.length;
  const allSelected = selectedCount === menu.length;
  const noneSelected = selectedCount === 0;

  // Determine button label
  const buttonLabel = selectedCount > 0 ? `${label} ${selectedCount}` : label;

  const buttonClassName = noneSelected ? "text-muted-foreground" : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size={"sm"}
          className={buttonClassName}
        >
          {noneSelected ? (
            <HugeiconsIcon
              icon={menu[0]?.icon}
              className="size-4 text-muted-foreground"
              strokeWidth={2}
            />
          ) : (
            <div className="flex items-center gap-1">
              <AvatarGroupWithCount avatarUrls={value.map((v) => "/Taskflow.svg")} maxCount={2} />
            </div>
          )}

          <span className="truncate">{buttonLabel}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-60" align="start" sideOffset={8}>
        <Command className="bg-transparent">
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandSeparator className="my-1" />

          <CommandList className="max-h-70 scrollbar-hide">
            <CommandEmpty className="py-4 text-xs text-center text-muted-foreground">
              No results found.
            </CommandEmpty>

            <CommandGroup>
              <p className="text-muted-foreground text-xs font-semibold px-2">
                Select {label.toLowerCase()}
              </p>

              {menu.map((item) => {
                const isSelected = value.includes(item.value);

                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                    className="cursor-pointer"
                  >
                  <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelect(item.value)}
                      className="mr-2"
                    />

                    <div className="w-4 h-4">
                      <AvatarImg src="/Taskflow.svg" alt="Members" />
                    </div>

                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
