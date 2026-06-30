import { IContactLogEvent, IContactMeta, IContactPayload } from './contact.interface';
import { buildContactEmailHtml } from './contact.template';
import { sendMail } from './mail.service';
import { incrementRateCount, isDuplicate, recordSubmission } from './contact.store';

function logEvent(event: IContactLogEvent): void { console.log(JSON.stringify(event)); }

export async function processContactSubmission(payload: IContactPayload, meta: IContactMeta): Promise<{ delivered: boolean }> {
  const { email, subject, message } = payload;
  if (isDuplicate(email, subject, message)) { logEvent({ event: 'contact_duplicate', ip: meta.ip, timestamp: meta.submittedAt }); return { delivered: false }; }
  const html = buildContactEmailHtml(payload, meta);
  const to = process.env.CONTACT_RECEIVER_EMAIL ?? process.env.SMTP_USER ?? '';
  const from = process.env.CONTACT_FROM_EMAIL ?? `StorySparkAI Contact <${process.env.SMTP_USER}>`;
  try {
    await sendMail({ from, to, replyTo: `${payload.name} <${email}>`, subject: `[Contact] ${subject}`, html });
    recordSubmission(email, subject, message);
    incrementRateCount(meta.ip);
    logEvent({ event: 'contact_submitted', ip: meta.ip, timestamp: meta.submittedAt });
    return { delivered: true };
  } catch (err) {
    logEvent({ event: 'contact_smtp_failure', ip: meta.ip, timestamp: meta.submittedAt, extra: { error: String(err) } });
    throw err;
  }
}
