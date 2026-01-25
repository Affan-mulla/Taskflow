import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import type { InviteVerifyResponse } from '@/lib/api';
import type { InviteStatus } from '../hooks/useInvite';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Mail01Icon,
  SecurityLockIcon,
  UserAdd01Icon,
  MultiplicationSignCircleIcon,
} from '@hugeicons/core-free-icons';

interface InviteCardProps {
  status: InviteStatus;
  invite: InviteVerifyResponse | null;
  error: string | null;
  isAuthenticated: boolean;
  userEmail: string | null;
  onSignUp: () => void;
  onLogIn: () => void;
  onAccept: () => void;
  isAccepting: boolean;
}

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatExpiryDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function InviteCard({
  status,
  invite,
  error,
  isAuthenticated,
  userEmail,
  onSignUp,
  onLogIn,
  onAccept,
  isAccepting,
}: InviteCardProps) {
    
  // Loading state
  if (status === 'verifying' || status === 'idle') {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Spinner className="size-8 mb-4" />
          <p className="text-muted-foreground">Verifying your invite...</p>
        </CardContent>
      </Card>
    );
  }

  // Invalid or expired state
  if (status === 'invalid' || status === 'expired') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            {status === 'expired' ? (
              <HugeiconsIcon icon={Clock01Icon} className="size-6 text-destructive" strokeWidth={2} />
            ) : (
              <HugeiconsIcon icon={MultiplicationSignCircleIcon} className="size-6 text-destructive" strokeWidth={2} />
            )}
          </div>
          <CardTitle>
            {status === 'expired' ? 'Invite Expired' : 'Invalid Invite'}
          </CardTitle>
          <CardDescription className="text-destructive">
            {error}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Error state (e.g., after failed acceptance)
  if (status === 'error') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <HugeiconsIcon icon={Alert02Icon} className="size-6 text-destructive" strokeWidth={2} />
          </div>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription className="text-destructive">
            {error}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Success state
  if (status === 'accepted') {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-500/10">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6 text-green-500" strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Welcome to the team!</h3>
          <p className="text-muted-foreground text-center">
            Redirecting you to the workspace...
          </p>
          <Spinner className="size-5 mt-4" />
        </CardContent>
      </Card>
    );
  }

  // Valid invite - check authentication
  if (!invite) {
    return null;
  }

  const emailMismatch = isAuthenticated && userEmail && userEmail !== invite.email;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <HugeiconsIcon icon={UserAdd01Icon} className="size-6 text-primary" strokeWidth={2} />
        </div>
        <CardTitle>You're Invited!</CardTitle>
        <CardDescription>
          You've been invited to join a workspace on Taskflow
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Invite details */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Role</span>
            <Badge variant="secondary">{formatRole(invite.role)}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Invited as</span>
            <span className="text-sm font-medium">{invite.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Expires</span>
            <span className="text-sm text-muted-foreground">
              {formatExpiryDate(invite.expiresAt)}
            </span>
          </div>
        </div>

        {/* Email mismatch warning */}
        {emailMismatch && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <HugeiconsIcon icon={SecurityLockIcon} className="size-5 text-destructive shrink-0 mt-0.5" strokeWidth={2} />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Email mismatch
                </p>
                <p className="text-sm text-muted-foreground">
                  This invite was sent to <span className="font-medium">{invite.email}</span>.
                  You're currently logged in as <span className="font-medium">{userEmail}</span>.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please log in with the correct email to accept this invite.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Not authenticated info */}
        {!isAuthenticated && (
          <div className="rounded-lg border border-muted bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-sm text-muted-foreground">
                Sign up or log in with <span className="font-medium">{invite.email}</span> to accept this invite.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {!isAuthenticated ? (
          <>
            <Button className="w-full" onClick={onSignUp}>
              Sign up
            </Button>
            <Button variant="outline" className="w-full" onClick={onLogIn}>
              Log in
            </Button>
          </>
        ) : emailMismatch ? (
          <Button variant="outline" className="w-full" onClick={onLogIn}>
            Log in with different account
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={onAccept}
            disabled={isAccepting}
          >
            {isAccepting ? (
              <>
                <Spinner className="mr-2" />
                Accepting...
              </>
            ) : (
              'Accept Invite'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
