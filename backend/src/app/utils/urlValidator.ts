/**
 * URL validation helpers for safely validating user-supplied URL strings.
 * Used in route handlers and validation schemas to ensure URL fields
 * contain well-formed absolute HTTP/HTTPS URLs.
 */

/**
 * Checks if a given string is a valid absolute URL with http or https protocol.
 * Handles localhost, port numbers, query strings, and URL fragments.
 * Returns false for relative paths or malformed URLs.
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    // Hostname must be non-empty
    if (!parsed.hostname) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
