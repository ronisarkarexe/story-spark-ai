import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

let _transport: Transporter | null = null;

function getTransport(): Transporter {
  if (_transport) return _transport;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) throw new Error('Missing SMTP config');
  _transport = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASSWORD } });
  return _transport;
}

export async function sendMail(options: SendMailOptions, retries = 2): Promise<void> {
  const transport = getTransport();
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try { await transport.sendMail(options); return; }
    catch (err) { lastError = err; if (attempt < retries) await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt))); }
  }
  throw lastError;
}
