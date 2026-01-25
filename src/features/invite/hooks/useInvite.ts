import { useState, useCallback, useRef } from 'react';
import { verifyInvite, acceptInvite, type InviteVerifyResponse, type ApiError } from '@/lib/api';
import { auth } from '@/lib/firebase';

export type InviteStatus = 
  | 'idle'
  | 'verifying'
  | 'invalid'
  | 'expired'
  | 'valid'
  | 'accepting'
  | 'accepted'
  | 'error';

interface UseInviteReturn {
  status: InviteStatus;
  invite: InviteVerifyResponse | null;
  error: string | null;
  verifyToken: (token: string) => Promise<void>;
  acceptInvitation: (token: string) => Promise<{ workspaceUrl?: string } | null>;
}

export function useInvite(): UseInviteReturn {
  const [status, setStatus] = useState<InviteStatus>('idle');
  const [invite, setInvite] = useState<InviteVerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAcceptingRef = useRef(false);

  const verifyToken = useCallback(async (token: string) => {
    setStatus('verifying');
    setError(null);
    setInvite(null);
    try {
      const response = await verifyInvite(token);
      
      if (!response.valid) {
        setStatus('invalid');
        setError('This invite is invalid or has already been used.');
        return;
      }

      // Check if invite is expired
      const expiresAt = new Date(response.expiresAt);
      if (expiresAt < new Date()) {
        setStatus('expired');
        setError('This invite has expired.');
        return;
      }

      setInvite(response);
      setStatus('valid');
    } catch (err) {
      const apiError = err as ApiError;
      setStatus('invalid');
      
      if (apiError.status === 404) {
        setError('This invite was not found.');
      } else if (apiError.status === 410) {
        setStatus('expired');
        setError('This invite has expired.');
      } else {
        setError(apiError.message || 'Failed to verify invite. Please try again.');
      }
    }
  }, []);

  const acceptInvitation = useCallback(async (token: string): Promise<{ workspaceUrl?: string } | null> => {
    // Prevent duplicate submissions
    if (isAcceptingRef.current) {
      return null;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to accept this invite.');
      return null;
    }

    isAcceptingRef.current = true;
    setStatus('accepting');
    setError(null);

    try {
      const idToken = await user.getIdToken();
      const response = await acceptInvite(token, idToken);
      
      setStatus('accepted');
      isAcceptingRef.current = false;
      
      return { workspaceUrl: response.workspaceUrl };
    } catch (err) {
      const apiError = err as ApiError;
      setStatus('error');
      isAcceptingRef.current = false;
      
      if (apiError.status === 400) {
        setError('This invite has already been accepted.');
      } else if (apiError.status === 403) {
        setError('You are not authorized to accept this invite.');
      } else if (apiError.status === 410) {
        setError('This invite has expired.');
      } else {
        setError(apiError.message || 'Failed to accept invite. Please try again.');
      }
      
      return null;
    }
  }, []);

  return {
    status,
    invite,
    error,
    verifyToken,
    acceptInvitation,
  };
}
