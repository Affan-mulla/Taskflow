import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { ReloadFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { reload, sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const COOLDOWN_DURATION = 60; // 60 seconds
const COOLDOWN_KEY = "email_verification_cooldown";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Initialize cooldown from localStorage on mount
  useEffect(() => {
    const savedCooldownEnd = localStorage.getItem(COOLDOWN_KEY);
    if (savedCooldownEnd) {
      const remainingTime = Math.ceil(
        (parseInt(savedCooldownEnd) - Date.now()) / 1000
      );
      if (remainingTime > 0) {
        setCooldown(remainingTime);
      } else {
        // Cooldown expired, clean up localStorage
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          // Cooldown finished, clean up localStorage
          localStorage.removeItem(COOLDOWN_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Check email verification status periodically
  useEffect(() => {
    const checkVerification = async () => {
      if (!auth.currentUser) return;

      try {
        await reload(auth.currentUser);

        if (auth.currentUser.emailVerified) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        // Silently handle reload errors (user might have logged out)
        console.error("Error reloading user:", error);
      }
    };

    // Check immediately
    checkVerification();

    // Then check every 5 seconds (reduced from 3 to be less aggressive)
    const interval = setInterval(checkVerification, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  /**
   * Handles resending the verification email with cooldown protection
   */
  const handleResendEmail = async () => {
    if (!auth.currentUser) {
      toast.error("No user is currently logged in");
      return;
    }

    if (auth.currentUser.emailVerified) {
      toast.info("Your email is already verified!");
      navigate("/", { replace: true });
      return;
    }

    setIsResending(true);

    try {
      // Send verification email
      await sendEmailVerification(auth.currentUser);

      // Calculate cooldown end time
      const cooldownEndTime = Date.now() + COOLDOWN_DURATION * 1000;

      // Persist cooldown to localStorage
      localStorage.setItem(COOLDOWN_KEY, cooldownEndTime.toString());

      // Start cooldown
      setCooldown(COOLDOWN_DURATION);

      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      // Handle specific Firebase errors
      if (error.code === "auth/too-many-requests") {
        toast.error(
          "Too many attempts. Please wait a few minutes before trying again."
        );
        // Set a longer cooldown for rate limiting (5 minutes)
        const extendedCooldownEndTime = Date.now() + 5 * 60 * 1000;
        localStorage.setItem(COOLDOWN_KEY, extendedCooldownEndTime.toString());
        setCooldown(5 * 60);
      } else if (error.code === "auth/network-request-failed") {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("Failed to send verification email. Please try again.");
        console.error("Resend email error:", error);
      }
    } finally {
      setIsResending(false);
    }
  };

  // Determine button state
  const isButtonDisabled = cooldown > 0 || isResending;

  // Generate button text based on state
  const getButtonText = () => {
    if (isResending) return "Sending...";
    if (cooldown > 0) return `Wait ${cooldown}s`;
    return "Resend Email";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-foreground/5 to-background ">
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            A verification email has been sent to{" "}
            <span className="font-medium text-foreground">
              {auth.currentUser?.email}
            </span>
            . Please check your inbox and click on the verification link to
            activate your account.
          </CardDescription>
          <CardDescription className="mb-4">
            If you did not receive the email, please check your spam folder or
            request a new verification email below.
          </CardDescription>
          {cooldown > 0 && (
            <CardDescription className="mb-2 text-amber-600 dark:text-amber-500">
              Please wait {cooldown} seconds before resending.
            </CardDescription>
          )}
          <CardAction className="mt-2">
            <Button
              onClick={handleResendEmail}
              disabled={isButtonDisabled}
              className="gap-2"
            >
              {!isResending && (
                <HugeiconsIcon icon={ReloadFreeIcons} strokeWidth={2} />
              )}
              {getButtonText()}
            </Button>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
