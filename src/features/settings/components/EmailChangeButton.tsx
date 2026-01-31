import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pen, Close } from "@hugeicons/core-free-icons";

const EmailChangeButton = () => {
  const [email, setEmail] = useState("");

  const handleCheck = () => {
    // TODO: validate + call backend
    console.log("Check email:", email);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon-sm">
          <HugeiconsIcon icon={Pen} className="size-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold">
            Change email
          </DialogTitle>

          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            If you'd like to change the email address for your account, we'll
            send a verification link to your new email address. This change
            will apply across all workspaces that you are a member of.
            <br />
            <br />
            Please check if the new email address is tied to an existing
            account before proceeding with the change.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-2">
          <Label className="text-sm font-medium">
            Enter the new email address you'd like to use.
          </Label>
          <Input
            type="email"
            placeholder="New email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <DialogFooter>
            <DialogClose>
          <Button variant="outline" size={"sm"}>
            Cancel
          </Button>
          </DialogClose>
          <Button onClick={handleCheck} disabled={!email} className={"sm"}>
            Check for existing account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailChangeButton;
