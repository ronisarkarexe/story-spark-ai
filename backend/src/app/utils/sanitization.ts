/**
 * String sanitization helpers for safely handling user-supplied input.
 * These utilities are useful in route handlers, logging, and content display
 * to reduce the risk of HTML injection and ensure consistent string formatting.
 */

// Dangerous URL protocols that can be used for XSS attacks
const DANGEROUS_URL_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'mocha:',
  'livescript:',
  'about:',
  'file:',
  'view-source:',
  'jar:',
  'apt:',
];

/**
 * Checks whether a URL uses an allowed (safe) protocol.
 * URLs with dangerous protocols like javascript:, data:, vbscript:, etc.
 * can be used for XSS attacks and should be rejected.
 */
export const isAllowedUrlProtocol = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  for (const protocol of DANGEROUS_URL_PROTOCOLS) {
    if (lower.startsWith(protocol)) return false;
  }
  return true;
};

/**
 * Sanitizes a URL by validating its protocol. Returns the URL unchanged
 * if the protocol is safe, otherwise returns the provided fallback value.
 * This prevents XSS via javascript:, data:, and other dangerous protocols.
 */
export const sanitizeUrl = (
  url: string,
  fallback = '',
): string => {
  if (!url || typeof url !== 'string') return fallback;
  return isAllowedUrlProtocol(url) ? url.trim() : fallback;
};

/**
 * Removes all HTML tags from a string using a regex that handles both
 * complete tags (<tag>) and incomplete openers (<script without >).
 * Uses two-pass approach: first strips complete tags, then strips remaining
 * tag-like sequences starting with <.
 */
export const stripHtmlTags = (input: string): string => {
  if (!input) return '';
  // First pass: remove all complete HTML tags
  let result = input.replace(/<[^>]*>/g, '');
  // Second pass: remove any remaining tag-like openers (e.g. <script without >)
  result = result.replace(/<[a-z\/!][^>]*$/gi, '');
  // Third pass: remove standalone < characters that are tag-like
  result = result.replace(/<[^>]+$/gi, '');
  return result.trim();
};

/**
 * Truncates a string to a maximum length, appending a suffix if truncation occurred.
 * If the string is shorter than maxLength, it is returned unchanged.
 */
export const truncate = (
  input: string,
  maxLength: number,
  suffix = '...'
): string => {
  if (!input) return '';
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Collapses multiple consecutive whitespace characters into a single space
 * and trims leading/trailing whitespace.
 */
export const normalizeWhitespace = (input: string): string => {
  if (!input) return '';
  return input.replace(/\s+/g, ' ').trim();
};
