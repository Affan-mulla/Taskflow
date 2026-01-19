import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Filter } from "@hugeicons/core-free-icons";

const FilterComponent = ({ onFilter }: { onFilter?: () => void }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            size="sm"
            variant="ghost"
            className="group gap-2"
            onClick={onFilter}
          >
            <HugeiconsIcon
              icon={Filter}
              strokeWidth={2}
              className="size-4 text-muted-foreground group-hover:text-foreground"
            />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" side="bottom" align="end" sideOffset={4}>
            <DropdownMenuGroup>
                <DropdownMenuLabel>
                    Filter
                </DropdownMenuLabel>
                <DropdownMenuItem>
                    Status
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Priority
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Target Date
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Lead
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Start Date
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FilterComponent;
