import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Kanban,
  Layers01FreeIcons,
} from "@hugeicons/core-free-icons";
import BoardView from "./BoardView";

function BoardNavbar({ boardName }: { boardName?: string }) {
  return (
    <div className="px-3 sm:px-4 md:px-6 py-3 w-full flex items-center justify-between gap-3">
      {/* Left */}
      <div className="min-w-0 flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />

        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 size-6 rounded-md bg-primary/40 ring-1 ring-border/50 grid place-items-center">
            <HugeiconsIcon
              icon={Layers01FreeIcons}
              strokeWidth={2}
              className="size-4 text-primary"
            />
          </div>

          <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
            {boardName ?? "Board"}
          </h1>
        </div>

        {/* Optional secondary context */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <HugeiconsIcon icon={Kanban} className="size-4" strokeWidth={2} />
            Kanban
          </Button>
        </div>
      </div>

      {/* Right */}
      <div className="shrink-0 flex items-center gap-2">
        {/* Future: Filter / Group / View switch */}
       <BoardView/>
      </div>
    </div>
  );
}

export default BoardNavbar;
