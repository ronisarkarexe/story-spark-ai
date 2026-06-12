import crypto from "crypto";

// Key: user_identifier:payload_hash
// Value: timestamp of the active request
const activeRequests = new Map<string, number>();
const DEDUPLICATION_WINDOW_MS = 10000; // 10 seconds window

function getPayloadHash(body: any): string {
  const serialized = JSON.stringify(body || {});
  return crypto.createHash("sha256").update(serialized).digest("hex");
}

/**
 * Checks if a request payload is already in-flight for the given user.
 * If not, tracks it and returns true. If duplicate, returns false.
 */
export function checkAndTrackRequest(userId: string, body: any): boolean {
  const hash = getPayloadHash(body);
  const key = `${userId}:${hash}`;
  const now = Date.now();

  if (activeRequests.has(key)) {
    const lastTime = activeRequests.get(key)!;
    if (now - lastTime < DEDUPLICATION_WINDOW_MS) {
      return false; // Duplicate
    }
  }

  activeRequests.set(key, now);

  // Set timeout to automatically release the request after the window
  setTimeout(() => {
    if (activeRequests.get(key) === now) {
      activeRequests.delete(key);
    }
  }, DEDUPLICATION_WINDOW_MS);

  return true;
}

/**
 * Manually releases the tracked request key once completed or failed.
 */
export function releaseRequest(userId: string, body: any): void {
  const hash = getPayloadHash(body);
  const key = `${userId}:${hash}`;
  activeRequests.delete(key);
}
