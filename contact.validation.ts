import { Request, Response, NextFunction } from 'express';

export function sanitizeField(value: string): string {
  return value
    .replace(/[\r\n]+/g, ' ')
    .replace(/\b(BCC:|CC:|To:|From:|Reply-To:)/gi, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<(img|iframe|object|embed|form|input|link|meta|style)[^>]*>/gi, '')
    .trim();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactBody(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as Record<string, unknown>;
  const rawSize = Buffer.byteLength(JSON.stringify(body), 'utf8');
  if (rawSize > 10_240) { res.status(413).json({ success: false, message: 'Payload too large.' }); return; }
  const { name, email, subject, message } = body;
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) { res.status(400).json({ success: false, message: 'Name must be 2-100 characters.' }); return; }
  if (typeof email !== 'string' || !isValidEmail(email.trim())) { res.status(400).json({ success: false, message: 'A valid email address is required.' }); return; }
  if (typeof subject !== 'string' || subject.trim().length === 0 || subject.trim().length > 200) { res.status(400).json({ success: false, message: 'Subject must be 1-200 characters.' }); return; }
  if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 5_000) { res.status(400).json({ success: false, message: 'Message must be 10-5000 characters.' }); return; }
  req.body.name = sanitizeField(name.trim());
  req.body.email = email.trim().toLowerCase();
  req.body.subject = sanitizeField(subject.trim());
  req.body.message = sanitizeField(message.trim());
  next();
}
