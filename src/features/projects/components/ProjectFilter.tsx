"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Filter as FilterIcon, 
  ArrowRight01Icon,
  Delete02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import AvatarImg from "@/components/Common/AvatarImage";
import { STATUS_OPTIONS, PRIORITY_OPTIONS, type MemberOption } from "./projects.types";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type FilterCategory = "status" | "priority" | "lead" | "dates" | "assignee" | "project";

export interface FilterValue {
  category: FilterCategory;
  value: string | Date;
  label?: string;
}

type EntityType = "project" | "task";

interface ProjectFilterProps {
  filters?: FilterValue[];
  members?: MemberOption[];
  projects?: Array<{ value: string; label: string }>;
  onFiltersChange?: (filters: FilterValue[]) => void;
  entityType?: EntityType;
}

// ============================================================================
// Category & Value Metadata
// ============================================================================

const PROJECT_CATEGORIES: { id: FilterCategory; label: string }[] = [
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
  { id: "lead", label: "Lead" },
  { id: "dates", label: "Dates" },
];

const TASK_CATEGORIES: { id: FilterCategory; label: string }[] = [
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
  { id: "assignee", label: "Assignee" },
  { id: "project", label: "Project" },
];

const DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
  { value: "next-week", label: "Next week" },
  { value: "next-month", label: "Next month" },
];

// ============================================================================
// Main Filter Component
// ============================================================================

export function ProjectFilter({ 
  filters = [], 
  members = [], 
  projects = [],
  onFiltersChange, 
  entityType = "project" 
}: ProjectFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<FilterCategory | null>("status");
  
  const CATEGORIES = entityType === "project" ? PROJECT_CATEGORIES : TASK_CATEGORIES;

  const toggleFilter = (category: FilterCategory, value: string | Date) => {
    const existingIndex = filters.findIndex(
      f => f.category === category && f.value === value
    );

    if (existingIndex >= 0) {
      // Remove filter
      onFiltersChange?.(filters.filter((_, i) => i !== existingIndex));
    } else {
      // Add filter
      onFiltersChange?.([...filters, { category, value }]);
    }
  };

  const isFilterActive = (category: FilterCategory, value: string | Date) => {
    return filters.some(f => f.category === category && f.value === value);
  };

  const clearAllFilters = () => {
    onFiltersChange?.([]);
    setSelectedCategory(null);
  };

  const getActiveCountForCategory = (category: FilterCategory) => {
    return filters.filter(f => f.category === category).length;
  };

  const activeFilterCount = filters.length;

  // Render value list based on selected category
  const renderValueList = () => {
    if (!selectedCategory) return null;

    switch (selectedCategory) {
      case "status":
        return (
          <Command className="border-0">
            <CommandInput placeholder="Search status..." className="h-9" />
            <CommandList>
              <CommandEmpty>No status found.</CommandEmpty>
              <CommandGroup>
                {STATUS_OPTIONS.map((option) => {
                  const isActive = isFilterActive("status", option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => toggleFilter("status", option.value)}
                      className="cursor-pointer"
                    >
                      <div className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isActive ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}>
                        {isActive && (
                          <HugeiconsIcon icon={Tick02Icon} className="size-3" strokeWidth={3} />
                        )}
                      </div>
                      <HugeiconsIcon
                        icon={option.icon}
                        className="mr-2 size-4"
                        strokeWidth={2}
                      />
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        );

      case "priority":
        return (
          <Command className="border-0">
            <CommandInput placeholder="Search priority..." className="h-9" />
            <CommandList>
              <CommandEmpty>No priority found.</CommandEmpty>
              <CommandGroup>
                {PRIORITY_OPTIONS.map((option) => {
                  const isActive = isFilterActive("priority", option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => toggleFilter("priority", option.value)}
                      className="cursor-pointer"
                    >
                      <div className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isActive ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}>
                        {isActive && (
                          <HugeiconsIcon icon={Tick02Icon} className="size-3" strokeWidth={3} />
                        )}
                      </div>
                      <HugeiconsIcon
                        icon={option.icon}
                        className={cn("mr-2 size-4", option.value === "urgent" && "text-orange-400")}
                        strokeWidth={2}
                      />
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        );

      case "lead":
      case "assignee":
        const categoryKey = selectedCategory === "lead" ? "lead" : "assignee";
        return (
          <Command className="border-0">
            <CommandInput placeholder="Search team member..." className="h-9" />
            <CommandList>
              <CommandEmpty>No member found.</CommandEmpty>
              <CommandGroup>
                {members.map((member) => {
                  const isActive = isFilterActive(categoryKey, member.value);
                  return (
                    <CommandItem
                      key={member.value}
                      value={member.label}
                      onSelect={() => toggleFilter(categoryKey, member.value)}
                      className="cursor-pointer"
                    >
                      <div className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isActive ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}>
                        {isActive && (
                          <HugeiconsIcon icon={Tick02Icon} className="size-3" strokeWidth={3} />
                        )}
                      </div>
                      <div className="mr-2 size-5">
                        <AvatarImg
                          src={member.avatarUrl || "/Taskflow.svg"}
                          fallbackText={member.label}
                        />
                      </div>
                      <span>{member.label}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {member.email}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        );

      case "project":
        return (
          <Command className="border-0">
            <CommandInput placeholder="Search project..." className="h-9" />
            <CommandList>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {projects.map((project) => {
                  const isActive = isFilterActive("project", project.value);
                  return (
                    <CommandItem
                      key={project.value}
                      value={project.label}
                      onSelect={() => toggleFilter("project", project.value)}
                      className="cursor-pointer"
                    >
                      <div className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isActive ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}>
                        {isActive && (
                          <HugeiconsIcon icon={Tick02Icon} className="size-3" strokeWidth={3} />
                        )}
                      </div>
                      <span>{project.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        );

      case "dates":
        return (
          <div className="p-2">
            <div className="space-y-1">
              <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">Quick filters</p>
              {DATE_PRESETS.map((preset) => {
                const isActive = isFilterActive("dates", preset.value);
                return (
                  <button
                    key={preset.value}
                    onClick={() => toggleFilter("dates", preset.value)}
                    className={cn(
                      "w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                      isActive && "bg-accent"
                    )}
                  >
                    <div className={cn(
                      "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                      isActive ? "bg-primary text-primary-foreground" : "opacity-50"
                    )}>
                      {isActive && (
                        <HugeiconsIcon icon={Tick02Icon} className="size-3" strokeWidth={3} />
                      )}
                    </div>
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          size="sm"
          variant="ghost"
          className="group gap-2 relative"
        >
          <HugeiconsIcon
            icon={FilterIcon}
            strokeWidth={2}
            className="size-4 text-muted-foreground group-hover:text-foreground"
          />
          Filter
          {activeFilterCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-1 h-4 px-1.5 text-[10px] font-medium"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-120 p-0" 
        align="end" 
        sideOffset={8}
      >
        <div className="flex">
          {/* Left Panel - Categories */}
          <div className="w-40 border-r border-border">
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                <span className="text-xs font-semibold text-muted-foreground">Filter</span>
                {filters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-0.5">
                {CATEGORIES.map((category) => {
                  const activeCount = getActiveCountForCategory(category.id);
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors",
                        "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {category.label}
                        {activeCount > 0 && (
                          <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                            {activeCount}
                          </Badge>
                        )}
                      </span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="size-3 text-muted-foreground"
                        strokeWidth={2}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Values */}
          <div className="flex-1 min-w-0">
            {selectedCategory ? (
              <div className="h-full">
                {renderValueList()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-sm text-muted-foreground">
                Select a category to filter
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// Filter Summary Pills (for toolbar feedback)
// ============================================================================

interface FilterSummaryProps {
  filters: FilterValue[];
  members?: MemberOption[];
  onRemoveFilter: (category: FilterCategory, value: string | Date) => void;
  onRemoveCategory?: (category: FilterCategory) => void;
}

export function FilterSummary({ filters, members = [], onRemoveFilter, onRemoveCategory }: FilterSummaryProps) {
  if (filters.length === 0) return null;

  // Group filters by category
  const groupedFilters = filters.reduce((acc, filter) => {
    if (!acc[filter.category]) {
      acc[filter.category] = [];
    }
    acc[filter.category].push(filter);
    return acc;
  }, {} as Record<FilterCategory, FilterValue[]>);

  const getValueLabel = (filter: FilterValue): string => {
    // Use label if provided
    if (filter.label) return filter.label;
    
    switch (filter.category) {
      case "status":
        return STATUS_OPTIONS.find(o => o.value === filter.value)?.label || "";
      case "priority":
        return PRIORITY_OPTIONS.find(o => o.value === filter.value)?.label || "";
      case "lead":
      case "assignee":
        return members.find(m => m.value === filter.value)?.label || "";
      case "dates":
        if (typeof filter.value === "string") {
          return DATE_PRESETS.find(p => p.value === filter.value)?.label || filter.value;
        }
        if (filter.value instanceof Date) {
          return filter.value.toLocaleDateString();
        }
        return "";
      case "project":
        return String(filter.value);
      default:
        return "";
    }
  };

  const getCategoryLabel = (category: FilterCategory): string => {
    const allCategories = [...PROJECT_CATEGORIES, ...TASK_CATEGORIES];
    return allCategories.find(c => c.id === category)?.label || category;
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {Object.entries(groupedFilters).map(([category, categoryFilters]) => {
        const categoryLabel = getCategoryLabel(category as FilterCategory);
        const valueLabels = categoryFilters.map(f => getValueLabel(f)).join(", ");
        
        return (
          <Badge
            key={category}
            variant="secondary"
            className="gap-1.5 pl-2 pr-1 cursor-default"
          >
            <span className="text-[11px]">
              {categoryLabel}: {valueLabels}
            </span>
            <Button
            variant={"ghost"}
            size="icon-xs"
              onClick={() => {
                // Remove all filters in this category
                if (onRemoveCategory) {
                  onRemoveCategory(category as FilterCategory);
                } else {
                  // Fallback: remove each filter individually
                  categoryFilters.forEach(f => {
                    onRemoveFilter(f.category, f.value);
                  });
                }
              }}
              className="hover:bg-background/80 rounded-sm p-0.5 transition-colors"
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                strokeWidth={2}
                className="size-3"
              />
            </Button>
          </Badge>
        );
      })}
    </div>
  );
}
