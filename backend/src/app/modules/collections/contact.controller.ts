import { Request, Response } from 'express';
import { IContactMeta, IContactPayload } from './contact.interface';
import { isRateLimited } from './contact.store';
import { processContactSubmission } from './contact.service';

const SUCCESS_RESPONSE = { success: true, message: 'Your message has been received.' };

export async function handleContactForm(req: Request, res: Response): Promise<void> {
  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? req.socket.remoteAddress ?? 'unknown';
  const userAgent = (req.headers['user-agent'] as string | undefined) ?? 'unknown';
  const submittedAt = new Date().toISOString();

  if ((req.body.website ?? '') !== '') {
    console.log(JSON.stringify({ event: 'contact_honeypot', ip, timestamp: submittedAt }));
    res.status(200).json(SUCCESS_RESPONSE); return;
  }

  if (isRateLimited(ip)) {
    console.log(JSON.stringify({ event: 'contact_rate_limited', ip, timestamp: submittedAt }));
    res.status(200).json(SUCCESS_RESPONSE); return;
  }

  const payload: IContactPayload = { name: req.body.name, email: req.body.email, subject: req.body.subject, message: req.body.message };
  const meta: IContactMeta = { ip, userAgent, submittedAt };

  try { await processContactSubmission(payload, meta); } catch { /* logged inside service */ }
  res.status(200).json(SUCCESS_RESPONSE);
}
