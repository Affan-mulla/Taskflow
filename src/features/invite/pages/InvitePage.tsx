import { useEffect, useCallback, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useInvite } from '../hooks/useInvite';
import { InviteCard } from '../components/InviteCard';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon } from '@hugeicons/core-free-icons';

export default function InvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const {
    status,
    invite,
    error,
    verifyToken,
    acceptInvitation,
  } = useInvite();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Verify invite token on mount (only when token exists)
  useEffect(() => {
    if (token && status === 'idle') {
      verifyToken(token);
    }
  }, [token, status, verifyToken]);

  // Handle sign up navigation
  const handleSignUp = useCallback(() => {
    if (!token) return;
    // Store return URL for after auth
    sessionStorage.setItem('inviteReturnUrl', `/invite?token=${token}`);
    navigate('/register');
  }, [token, navigate]);

  // Handle log in navigation
  const handleLogIn = useCallback(async () => {
    if (!token) return;
    
    // If user is logged in (email mismatch case), sign them out first
    if (user) {
      await signOut(auth);
    }
    
    // Store return URL for after auth
    sessionStorage.setItem('inviteReturnUrl', `/invite?token=${token}`);
    navigate('/login');
  }, [token, navigate, user]);

  // Handle accept invite
  const handleAccept = useCallback(async () => {
    if (!token) return;
    
    const result = await acceptInvitation(token);
    
    if (result) {
      // Clear any stored return URL
      sessionStorage.removeItem('inviteReturnUrl');
      
      // Redirect to workspace after a short delay for UX
      setTimeout(() => {
        if (result.workspaceUrl) {
          navigate(`/${result.workspaceUrl}`);
        } else if (invite?.workspaceId) {
          navigate(`/${invite.workspaceId}`);
        } else {
          navigate('/');
        }
      }, 1500);
    }
  }, [token, acceptInvitation, navigate, invite]);

  // Missing token error
  if (!token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-foreground/5 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <HugeiconsIcon icon={Alert02Icon} className="size-6 text-destructive" strokeWidth={2} />
            </div>
            <CardTitle>Missing Invite Token</CardTitle>
            <CardDescription className="text-destructive">
              No invite token was provided. Please check your invite link and try again.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Wait for auth state to be determined
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-foreground/5 to-background p-4">
        <InviteCard
          status="verifying"
          invite={null}
          error={null}
          isAuthenticated={false}
          userEmail={null}
          onSignUp={handleSignUp}
          onLogIn={handleLogIn}
          onAccept={handleAccept}
          isAccepting={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-foreground/5 to-background p-4">
      <InviteCard
        status={status}
        invite={invite}
        error={error}
        isAuthenticated={!!user}
        userEmail={user?.email ?? null}
        onSignUp={handleSignUp}
        onLogIn={handleLogIn}
        onAccept={handleAccept}
        isAccepting={status === 'accepting'}
      />
    </div>
  );
}
