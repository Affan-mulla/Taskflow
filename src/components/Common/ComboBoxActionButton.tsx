"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button} from "@/components/ui/button";
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
import { UserIcon } from "@hugeicons/core-free-icons";
import AvatarImg from "./AvatarImage";
import AvatarGroupWithCount from "../ui/avatar-group-with-count";

interface MenuOption {
  value: string;
  label: string;
  icon: any;
  color?: string;
  avatarUrl?: string;
  email?: string;
}

interface ComboboxActionButtonProps {
  menu: MenuOption[];
  label: string;
  value?: string | null;
  btnVariant?: "outline" | "default" | "ghost";
  onChange?: (value: string | null) => void;
  // mode is currently fixed to single-select; removed unused prop
  showLabel?: boolean; // Whether to show label alongside icon in button
  btnSize?: "sm" | "icon-sm" ; // Button size variant
}
/**
 * ComboboxActionButton - Single-select dropdown component
 * Used for Lead selection (one user max, can be null)
 */
export function ComboboxActionButton({
  menu,
  label,
  btnVariant = "outline",
  btnSize,
  value = null,
  onChange,
  showLabel = true,
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

  // Determine which icon to show - fallback to UserIcon for Lead or first menu icon
  const displayIcon = selectedItem?.icon || menu[0]?.icon || UserIcon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant={btnVariant}
          role="combobox"
          aria-expanded={open}
          size={btnSize}
        >
         {
            label === "Lead" && selectedItem ? (
              <div className="size-5">
                <AvatarImg
                  src={selectedItem.avatarUrl}
                  fallbackText={selectedItem.label}
                />
              </div>
            ) : label === "Project" ? <></> : (
              <HugeiconsIcon
                icon={displayIcon || UserIcon}
                className="size-4 text-muted-foreground"
                strokeWidth={2}
              />
            )
          }

          {showLabel && (
            <span className="truncate">
              {selectedItem ? selectedItem.label.length > 10 ? `${selectedItem.label.slice(0, 20)}...` : selectedItem.label : label}
            </span>
          )}
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
                      <AvatarImg 
                        src={item.avatarUrl}
                        fallbackText={item.label} 
                      />
                    </div>
                  ) : item.icon ? (
                    <HugeiconsIcon
                      icon={item.icon}
                      className={cn(
                        "size-4",
                        item.color || "text-muted-foreground"
                      )}
                      strokeWidth={2}
                    />
                  ) : null}

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
  leadId?: string | null;
  onLeadRemove?: () => void;
  btnVariant?: "outline" | "default" | "ghost";
  btnSize?: "sm" | "icon-sm" ;
  showLable?: boolean; // Whether to show label alongside icon in button
}

/**
 * ComboboxMultiSelect - Multi-select dropdown component
 * Used for Members selection (multiple users, default all if not touched)
 * 
 * NOTE: PROJECT-LEVEL MEMBER SELECTION DISABLED
 * =============================================
 * This component is currently not rendered in AddProject.tsx.
 * Project-level access control has been disabled in favor of 
 * workspace-level access. All workspace members can access all projects.
 * 
 * This component is preserved for potential future re-enablement of
 * project-level member selection. Do not delete.
 * 
 * To re-enable:
 * 1. Uncomment the Controller in AddProject.tsx
 * 2. Update transformToPayload in addProject.ts
 * 3. Update projects.create.ts to write members to Firestore
 */
export function ComboboxMultiSelect({
  menu,
  btnSize = "icon-sm",
  btnVariant = "ghost",
  label,
  value,
  onChange,
  // defaultValue intentionally unused; selection is controlled via `value`
  showLable = false,
  leadId = null,
  onLeadRemove,
}: ComboboxMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (itemValue: string) => {
    // If clicking on the lead, remove them as lead
    if (itemValue === leadId) {
      onLeadRemove?.();
      return;
    }

    const isSelected = value.includes(itemValue);
    const newValue = isSelected
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue];

    onChange(newValue);
  };

  // Include lead in visual count and display (lead variable intentionally unused)
  const selectedMembers = menu.filter((member) => value.includes(member.value));
  
  // For button display, only show selected members (not lead)
  const selectedAvatarUrls = selectedMembers.map(
    (member) => member.avatarUrl || "/Taskflow.svg"
  );

  const totalCount = value.length;
  const noneSelected = totalCount === 0;

  // Determine button label
  const buttonLabel = totalCount > 0 ? `${label} ${totalCount}` : label;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant={btnVariant}
          role="combobox"
          aria-expanded={open}
          size={btnSize}
          className={"group"}
        >
          {noneSelected ? (
            <HugeiconsIcon
              icon={menu[0]?.icon || UserIcon}
              className="size-4 text-muted-foreground group-hover:text-foreground"
              strokeWidth={2}
            />
          ) : (
            <div className="flex items-center gap-1">
              <AvatarGroupWithCount 
                avatarUrls={selectedAvatarUrls} 
                maxCount={2} 
              />
            </div>
          )}

          {
            showLable && <span className="truncate">{buttonLabel}</span>
          }
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
                const isLead = item.value === leadId;
                const isChecked = isSelected || isLead;

                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                    className="cursor-pointer"
                  >
                  <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleSelect(item.value)}
                      className="mr-2"
                    />

                    <div className="w-4 h-4">
                      <AvatarImg 
                        src={item.avatarUrl || "/Taskflow.svg"} 
                        fallbackText={item.label} 
                      />
                    </div>

                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>

                    {isLead && (
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        Lead
                      </span>
                    )}
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
