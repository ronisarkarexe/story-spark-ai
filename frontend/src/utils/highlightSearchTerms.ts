/**
 * Escapes HTML special characters in a string to prevent XSS.
 * Replaces &, <, >, ", and ' with their HTML entity equivalents.
 */
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

/**
 * Wraps occurrences of the search query in the text with <mark> tags.
 * Matching is case-insensitive. HTML special characters are escaped
 * before matching to prevent XSS in search results.
 *
 * @param text - The original text to search within
 * @param query - The search term to highlight
 * @returns The text with matching terms wrapped in <mark> tags
 */
export const highlightSearchTerms = (
  text: string,
  query: string
): string => {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (!query || typeof query !== "string" || query.trim() === "") {
    return escapeHtml(text);
  }

  const escapedText = escapeHtml(text);
  const escapedQuery = escapeHtml(query);

  // Case-insensitive replacement using a flag in the regex
  const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");

  return escapedText.replace(regex, "<mark>$1</mark>");
};
