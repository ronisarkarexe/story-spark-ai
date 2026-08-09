/**
 * Converts a string into a URL-safe slug.
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes non-alphanumeric characters (except hyphens)
 * - Collapses multiple consecutive hyphens into one
 * - Trims leading and trailing hyphens
 */
export const slugify = (input: string): string => {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric (keep hyphens)
    .replace(/-+/g, "-")        // Collapse multiple hyphens
    .replace(/^-+|-+$/g, "");   // Trim leading/trailing hyphens
};


export function slugify(input: string): string {
  if (!input) return "";

  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")      // Replace one or more spaces with a hyphen
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-")        // Collapse multiple hyphens
    .replace(/^-|-$/g, "");     // Remove leading/trailing hyphens
}

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