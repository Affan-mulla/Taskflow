import { Button } from "@/components/ui/button";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";

const UpdateNavigationBtn = ({ updatesLink }: { updatesLink: string }) => {
  return (
    <Button variant="outline" size={"sm"} className="group">
      <Link to={updatesLink} className="flex gap-2 items-center">
        <HugeiconsIcon
          icon={FileEditIcon}
          strokeWidth={2}
          className="size-4 text-muted-foreground group-hover:text-foreground"
        />
        Updates
      </Link>
    </Button>
  );
};

export default UpdateNavigationBtn;