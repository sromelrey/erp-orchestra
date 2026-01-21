/**
 * Parameters for sending an email through the email service.
 * Defines all the necessary and optional fields required to send an email message.
 */
export interface SendEmailParams {
  /** Sender email address. Include friendly name: "Your Name <sender@domain.com>" */
  from: string;

  /** Recipient email(s)—string or array of strings (max 50 recipients) */
  to: string | string[];

  /** Email subject line */
  subject: string;

  /** BCC recipient(s)—string or array of strings */
  bcc?: string | string[];

  /** CC recipient(s)—string or array of strings */
  cc?: string | string[];

  /** Reply-to email address(es)—string or array of strings */
  reply_to?: string | string[];

  /**
   * When to send the email.
   * Accepts natural language (e.g., "in 1 min") or ISO‑8601 timestamp.
   */
  scheduled_at?: string;

  /** HTML body of the email */
  html?: string;

  /** Plain-text body of the email */
  text?: string;

  /**
   * For Node.js SDK: React component as email content.
   * Only available in the official Node.js client.
   */
  react?: string;

  /** Custom headers as key/value pairs */
  headers?: Record<string, string>;

  /** Attachments (max total 40 MB encoded) */
  attachments?: Array<{
    /** Binary file data, as Buffer or Base64 string */
    content: Buffer | string;
    /** File name for the attachment */
    filename: string;
    /** Optional path or URL to the file */
    path?: string;
    /** Optional MIME type; auto-derived if omitted */
    content_type?: string;
  }>;

  /** Arbitrary key/value tags for tracking (ASCII, ≤256 chars each) */
  tags?: Array<{
    /** Tag name (ASCII only, ≤256 chars) */
    name: string;
    /** Tag value (ASCII only, ≤256 chars) */
    value: string;
  }>;
}

/**
 * Type for sending multiple emails in a batch.
 * An array of SendEmailParams objects for bulk email operations.
 */
export type SendEmailBatchParams = SendEmailParams[];
