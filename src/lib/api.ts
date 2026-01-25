const API_BASE_URL = import.meta.env.VITE_EMAIL_SERVICE_API_URL || '';

export interface InviteVerifyResponse {
  valid: boolean;
  email: string;
  workspaceId: string;
  role: string;
  expiresAt: string;
}

export interface InviteAcceptResponse {
  success: boolean;
  workspaceUrl?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response received:', text.substring(0, 200));
    throw {
      message: 'Server returned an invalid response. Please check API configuration.',
      status: response.status,
    } as ApiError;
  }
  
  return response.json();
}

export async function verifyInvite(token: string): Promise<InviteVerifyResponse> {
  const url = `${API_BASE_URL}/api/invite/verify?token=${encodeURIComponent(token)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Failed to verify invite';
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json().catch(() => ({}));
      errorMessage = errorData.message || errorMessage;
    } else {
      console.error('API returned non-JSON error response. Status:', response.status);
      errorMessage = `API error (${response.status}). Please check API configuration.`;
    }
    
    throw {
      message: errorMessage,
      status: response.status,
    } as ApiError;
  }
  
  return parseJsonResponse<InviteVerifyResponse>(response);
}

export async function acceptInvite(token: string, idToken: string): Promise<InviteAcceptResponse> {
  const url = `${API_BASE_URL}/api/invite/accept`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ token }),
  });
  
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Failed to accept invite';
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json().catch(() => ({}));
      errorMessage = errorData.message || errorMessage;
    } else {
      console.error('API returned non-JSON error response. Status:', response.status);
      errorMessage = `API error (${response.status}). Please check API configuration.`;
    }
    
    throw {
      message: errorMessage,
      status: response.status,
    } as ApiError;
  }
  
  return parseJsonResponse<InviteAcceptResponse>(response);
}
