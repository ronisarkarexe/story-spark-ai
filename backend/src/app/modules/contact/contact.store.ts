import crypto from 'crypto';

interface StoreEntry { value: number | string; expiresAt: number; }
const store = new Map<string, StoreEntry>();

function storeGet(key: string): string | number | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { store.delete(key); return null; }
  return entry.value;
}
function storeSet(key: string, value: string | number, ttlSeconds: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1_000 });
}
setInterval(() => { const now = Date.now(); for (const [k, v] of store) { if (now > v.expiresAt) store.delete(k); } }, 600_000).unref();

const RATE_LIMIT = 3;
const RATE_TTL = 3_600;

export function isRateLimited(ip: string): boolean {
  return Number(storeGet(`contact:ip:${ip}`) ?? 0) >= RATE_LIMIT;
}
export function incrementRateCount(ip: string): void {
  const key = `contact:ip:${ip}`;
  const current = Number(storeGet(key) ?? 0);
  if (current === 0) { storeSet(key, 1, RATE_TTL); }
  else { const entry = store.get(key)!; const remaining = Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 1_000)); storeSet(key, current + 1, remaining); }
}

const DUPE_TTL = 86_400;
function hashSubmission(email: string, subject: string, message: string): string {
  return crypto.createHash('sha256').update(`${email}|${subject}|${message}`).digest('hex');
}
export function isDuplicate(email: string, subject: string, message: string): boolean {
  return storeGet(`contact:dupe:${hashSubmission(email, subject, message)}`) !== null;
}
export function recordSubmission(email: string, subject: string, message: string): void {
  storeSet(`contact:dupe:${hashSubmission(email, subject, message)}`, '1', DUPE_TTL);
}
