// RFC-1918, loopback, and link-local ranges that must never be trusted as a
// real client IP when walking X-Forwarded-For right-to-left.
const PRIVATE_IP_RE =
  /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1$|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;

/**
 * Returns the verified client IP from an incoming request's headers.
 *
 * Priority:
 *  1. x-real-ip  — set by Vercel's edge infrastructure; cannot be spoofed.
 *  2. x-forwarded-for (rightmost non-private hop) — the last hop added by a
 *     trusted proxy, not the leftmost value which is fully client-controlled.
 *
 * @param {Headers} headers  The request headers object.
 * @returns {string}  Verified IP address, or "unknown" if none can be determined.
 */
export function getClientIp(headers) {
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    for (let i = hops.length - 1; i >= 0; i--) {
      if (!PRIVATE_IP_RE.test(hops[i])) return hops[i];
    }
  }

  return "unknown";
}
