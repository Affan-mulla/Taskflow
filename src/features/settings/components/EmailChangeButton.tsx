import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pen } from "@hugeicons/core-free-icons";
import { auth } from "@/lib/firebase";
import { verifyBeforeUpdateEmail } from "firebase/auth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const EmailChangeButton = () => {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const { currentUser } = auth;
    if (!currentUser) {
      toast.error("You must be logged in to change your email");
      return;
    }

    if (email === currentUser.email) {
      toast.error("New email must be different from current email");
      return;
    }

    setIsLoading(true);

    try {
      await verifyBeforeUpdateEmail(currentUser, email);
      toast.success("Verification email sent! Please check your inbox.");
      setOpen(false);
      setEmail("");
    } catch (error: unknown) {
      console.error("Error sending verification email:", error);
      
      // Handle specific Firebase errors
      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string };
        switch (firebaseError.code) {
          case "auth/email-already-in-use":
            toast.error("This email is already associated with another account");
            break;
          case "auth/invalid-email":
            toast.error("Please enter a valid email address");
            break;
          case "auth/requires-recent-login":
            toast.error("Please log out and log back in, then try again");
            break;
          default:
            toast.error("Failed to send verification email. Please try again.");
        }
      } else {
        toast.error("Failed to send verification email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEmail("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && email && !isLoading) {
                handleSubmit();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!email || isLoading} 
            size="sm"
          >
            {isLoading ? (
              <>
                <Spinner className="size-4 mr-2" />
                Sending...
              </>
            ) : (
              "Send verification email"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailChangeButton;
