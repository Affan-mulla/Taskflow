import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/firebase";
import { useWorkspaceStore } from "@/shared/store/store.workspace";
import type { BulkInviteResponse } from "@/shared/types/email-response";
import { Alert, Sent02Icon, UserPlus, X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

const InviteMembersItem = () => {
  const [inputValue, setInputValue] = useState("");
  const [emails, setEmails] = useState<
    Array<{ value: string; isValid: boolean }>
  >([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {activeWorkspace} = useWorkspaceStore();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const parseEmails = (input: string) => {
    // Split on commas, semicolons, or whitespace clusters
    const parts = input
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    return parts.map((email) => ({ value: email, isValid: validateEmail(email) }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddEmails = () => {
    if (!inputValue.trim()) return;
    const parsedEmails = parseEmails(inputValue);
    // De-duplicate case-insensitively, keeping the latest validity status
    setEmails((prev) => {
      const byLower = new Map<string, { value: string; isValid: boolean }>();
      [...prev, ...parsedEmails].forEach((e) => {
        byLower.set(e.value.toLowerCase(), e);
      });
      return Array.from(byLower.values());
    });
    setInputValue("");
  };

  const handleRemoveEmail = (index: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendInvites = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_EMAIL_SERVICE_API_URL;
      if (!api) {
        toast.error("Email service API URL is not configured.");
        return;
      }

      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        toast.error("You must be signed in to send invites.");
        return;
      }

      const validEmails = emails.filter((e) => e.isValid).map((e) => e.value);
      const invalidCount = emails.length - validEmails.length;
      if (validEmails.length === 0) {
        toast.error("No valid emails to invite.");
        return;
      }

      const res = await fetch(`${api}/api/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emails: validEmails,
          role: "member",
          workspaceId: activeWorkspace?.id,
        }),
      });

      let data: BulkInviteResponse | null = null;
      try {
        data = await res.json();
      } catch {
        // ignore JSON parse error, fallback to res.ok
      }

      if (!res.ok) {
        const message = (data as any)?.message || `Request failed (${res.status})`;
        toast.error(message);
        return;
      }

      if (data && Array.isArray(data.failed) && data.failed.length > 0) {
        toast.error(
          data.failed
            .map((f) => `${f.email}: ${f.error || "Failed to send invite"}`)
            .join(", ")
        );
      } else {
        toast.success(
          invalidCount > 0
            ? `Invites sent! Skipped ${invalidCount} invalid email${invalidCount > 1 ? "s" : ""}.`
            : "Invites sent successfully!"
        );
        // Close only on success
        setOpen(false);
        // Reset state after success
        setEmails([]);
        setInputValue("");
      }
    } catch (err) {
      toast.error("Unexpected error while sending invites.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === ";") {
      e.preventDefault();
      handleAddEmails();
    }
  };

  const hasValidEmails = emails.some((e) => e.isValid);
  const validCount = emails.filter((e) => e.isValid).length;
  const invalidCount = emails.length - validCount;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        // Prevent closing while a send is in progress
        if (!loading) setOpen(next);
      }}
    >
      <AlertDialogTrigger>
        <Button className="text-sm gap-2" onSelect={(e) => e.preventDefault()}>
          <HugeiconsIcon strokeWidth={2} icon={UserPlus} className="size-4" />
          <span className="font-medium">Invite members</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md w-full" aria-busy={loading}>
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
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Press Enter, comma, or semicolon to add.</p>
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
                      disabled={loading}
                    >
                      <HugeiconsIcon icon={X} className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                {invalidCount > 0 ? (
                  <p className="text-xs text-destructive flex items-center  gap-1">
                    <HugeiconsIcon icon={Alert} className="size-4" strokeWidth={2} /> <span> {invalidCount} invalid email{invalidCount > 1 ? "s" : ""} will be skipped.</span>
                  </p>
                ) : (
                  <span className="text-xs text-muted-foreground">All emails look valid.</span>
                )}
                <Button variant="ghost" size="sm" onClick={() => setEmails([])} disabled={loading}>
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSendInvites}
            disabled={!hasValidEmails || loading}
          >
            {loading ? (
              <Spinner />
            ) : (
              <HugeiconsIcon
                strokeWidth={2}
                icon={Sent02Icon}
                className="size-4"
              />
            )}
            {loading ? <Spinner /> : `Send Invites (${validCount})`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InviteMembersItem;