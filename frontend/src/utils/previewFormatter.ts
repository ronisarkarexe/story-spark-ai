export interface StoryData {
  title: string;
  author: string;
  content: string;
}

export function splitParagraphs(
  content: string
): string[] {
  return content
    .split("\n")
    .filter((p) => p.trim() !== "");
}

export function formatPreview(story: StoryData) {
  const paragraphs = splitParagraphs(story.content);

  return {
    ...story,
    paragraphs,
    wordCount: story.content.trim().split(/\s+/).length,
  };
}