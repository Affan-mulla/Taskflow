export interface InviteResult {
  email: string;
  status: 'sent' | 'already_member' | 'already_invited' | 'failed';
  inviteId?: string;
  error?: string;
}

export interface BulkInviteResponse {
  success: InviteResult[];
  failed: InviteResult[];
}
