import { Separator } from "@/components/ui/separator";
import BoardNavbar from "../components/BoardNavbar";
import BoardContent from "../components/BoardContent";
import { BoardViewProvider } from "../context/BoardViewContext";
import type { BoardEntityType } from "../types";

interface BoardProps {
  entityType?: BoardEntityType;
  projectId?: string;
}

const Board = ({ entityType = "project", projectId }: BoardProps) => {
  return (
    <BoardViewProvider defaultView="priority" entityType={entityType} projectId={projectId}>
      <BoardNavbar />
      <Separator />
      <BoardContent />
    </BoardViewProvider>
  );
};

export default Board;