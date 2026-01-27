import { Separator } from "@/components/ui/separator";
import BoardNavbar from "../components/BoardNavbar";
import BoardContent from "../components/BoardContent";
import { BoardViewProvider } from "../context/BoardViewContext";

const Board = () => {
  return (
    <BoardViewProvider defaultView="priority">
      <BoardNavbar />
      <Separator />
      <BoardContent />
    </BoardViewProvider>
  );
};

export default Board;