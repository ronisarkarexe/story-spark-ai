export interface IContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export interface IContactMeta {
  ip: string;
  userAgent: string;
  submittedAt: string;
}

export interface IContactLogEvent {
  event:
    | 'contact_submitted'
    | 'contact_rate_limited'
    | 'contact_honeypot'
    | 'contact_duplicate'
    | 'contact_smtp_failure';
  ip: string;
  timestamp: string;
  extra?: Record<string, unknown>;
}
