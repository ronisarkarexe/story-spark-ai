/**
 * Calculates the reading time in minutes for a given text.
 * Assumes an average reading speed of 200 words per minute.
 * Returns a minimum of 1 minute.
 *
 * @param content The text to calculate reading time for.
 * @returns The calculated reading time in minutes.
 */
export const calculateReadingTime = (content: string | undefined): number => {
  if (!content || !content.trim()) {
    return 1;
  }
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};
