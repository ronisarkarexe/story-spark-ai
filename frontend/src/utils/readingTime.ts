export function getReadingTime(text: string): { minutes: number; wordCount: number } {
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return { minutes, wordCount };
}

/**
 * Utility to calculate estimated reading time for articles and stories.
 * Strips HTML tags and Markdown images/links to count only visible text.
 * Formula: readingTime = Math.max(1, Math.ceil(totalWords / 200))
 */
export function calculateReadingTime(content: string | undefined | null): string {
  if (!content || typeof content !== "string" || !content.trim()) {
    return "1 min read";
  }

  let cleaned = content;

  // 1. Ignore Markdown images: ![alt](url)
  cleaned = cleaned.replace(/!\[[\s\S]*?\]\([\s\S]*?\)/g, "");

  // 2. Extract visible text from Markdown links: [text](url) -> text
  cleaned = cleaned.replace(/\[([\s\S]*?)\]\([\s\S]*?\)/g, "$1");

  // 3. Ignore HTML tags (including <img .../> and tags like <a href="...">text</a> -> text)
  cleaned = cleaned.replace(/<[^>]*>/g, " ");

  // 4. Word count
  const words = cleaned.trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  const minutes = Math.max(1, Math.ceil(totalWords / 200));
  return `${minutes} min read`;
}