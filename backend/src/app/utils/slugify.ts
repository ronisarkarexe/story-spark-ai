/**
 * Converts a string to a URL-safe slug.
 * - Lowercases the string
 * - Replaces spaces with hyphens
 * - Strips non-alphanumeric characters (keeps hyphens)
 * - Collapses multiple consecutive hyphens into one
 * - Trims leading and trailing hyphens
 */
export const slugify = (text: string): string => {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // spaces to hyphens
    .replace(/[^a-z0-9-]/g, "")     // strip non-alphanumeric (keep hyphens)
    .replace(/-+/g, "-")            // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");       // trim leading/trailing hyphens
};
