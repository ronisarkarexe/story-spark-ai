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
