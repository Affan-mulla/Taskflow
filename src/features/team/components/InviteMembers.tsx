import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sent02Icon, UserPlus, X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

const InviteMembersItem = () => {
  const [inputValue, setInputValue] = useState("");
  const [emails, setEmails] = useState<
    Array<{ value: string; isValid: boolean }>
  >([]);
  const [open, setOpen] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const parseEmails = (input: string) => {
    return input
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0)
      .map((email) => ({
        value: email,
        isValid: validateEmail(email),
      }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddEmails = () => {
    const parsedEmails = parseEmails(inputValue);
    setEmails((prev) => [...prev, ...parsedEmails]);
    setInputValue("");
  };

  const handleRemoveEmail = (index: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendInvites = () => {
    const validEmails = emails.filter((e) => e.isValid).map((e) => e.value);
    if (validEmails.length > 0) {
      console.log("Sending invites to:", validEmails);
      // Handle sending invites here
      setEmails([]);
      setInputValue("");
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmails();
    }
  };

  const hasValidEmails = emails.some((e) => e.isValid);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button className="text-sm gap-2" onSelect={(e) => e.preventDefault()}>
          <HugeiconsIcon strokeWidth={2} icon={UserPlus} className="size-4" />
          <span className="font-medium">Invite members</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Invite Team Members
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter email addresses separated by commas. Press Enter or click
            outside to add them.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email-input">Email Addresses</Label>
            <Input
              id="email-input"
              placeholder="e.g., john@gmail.com, jane@company.com"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleAddEmails}
              className="w-full"
            />
          </div>

          {/* Display added emails */}
          {emails.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Added emails ({emails.length})
              </p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-muted/50 rounded-lg">
                {emails.map((email, index) => (
                  <Badge
                    key={index}
                    variant={email.isValid ? "default" : "destructive"}
                    className="flex items-center gap-1 pl-2"
                  >
                    <span className="text-xs">{email.value}</span>
                    <button
                      onClick={() => handleRemoveEmail(index)}
                      className="ml-1 hover:opacity-70"
                      type="button"
                    >
                      <HugeiconsIcon icon={X} className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {emails.some((e) => !e.isValid) && (
                <p className="text-xs text-destructive">
                  ⚠️ Some emails are invalid. Valid emails will be sent.
                </p>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSendInvites}
            disabled={!hasValidEmails}
          >
            <HugeiconsIcon
              strokeWidth={2}
              icon={Sent02Icon}
              className="size-4"
            />
            Send Invites ({emails.filter((e) => e.isValid).length})
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InviteMembersItem;