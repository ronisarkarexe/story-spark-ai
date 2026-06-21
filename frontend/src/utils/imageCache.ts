const CACHE_NAME = "story-spark-ai-image-cache";

// In-memory mapping of remote url -> object URL to avoid recreating them during the session
const objectUrlMap = new Map<string, string>();

// Track in-flight requests to prevent duplicate network calls for the same resource concurrently
const inFlightPromises = new Map<string, Promise<string>>();

/**
 * Gets a cached version of the image as a local blob URL.
 * If the image is not in the browser's Cache Storage, fetches it, saves it to cache, and returns the blob URL.
 * If fetching or caching fails (e.g. due to CORS or network offline), falls back to returning the original remote URL.
 */
export async function getCachedImageUrl(url: string): Promise<string> {
  if (!url) return "";

  // 1. Check if we already created a blob URL for this remote image URL in memory
  if (objectUrlMap.has(url)) {
    return objectUrlMap.get(url)!;
  }

  // 2. Check if there is an in-flight loading request for this URL to optimize cache hits
  if (inFlightPromises.has(url)) {
    return inFlightPromises.get(url)!;
  }

  // 3. Fallback to original URL if the Cache Storage API is not supported in the browser
  if (!("caches" in window)) {
    return url;
  }

  const promise = (async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(url);

      // Cache hit: Read block as blob and create local Object URL
      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        const blobUrl = URL.createObjectURL(blob);
        objectUrlMap.set(url, blobUrl);
        return blobUrl;
      }

      // Cache miss: Fetch the image from remote bucket
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      // Save the response clone into the Cache Storage API
      await cache.put(url, response.clone());

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      objectUrlMap.set(url, blobUrl);
      return blobUrl;
    } catch (error) {
      console.warn(`[ImageCache] Failed to load/cache image "${url}":`, error);
      // Fallback to original remote URL if fetch/caching fails (e.g., CORS restrictions)
      return url;
    } finally {
      // Always remove from in-flight promises map when complete
      inFlightPromises.delete(url);
    }
  })();

  inFlightPromises.set(url, promise);
  return promise;
}

/**
 * Revokes all created object URLs to free up browser memory.
 */
export function clearObjectUrls(): void {
  for (const blobUrl of objectUrlMap.values()) {
    try {
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Ignore errors during revocation
    }
  }
  objectUrlMap.clear();
}
