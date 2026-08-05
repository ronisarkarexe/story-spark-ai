export interface StoryData {
  title: string;
  author: string;
  content: string;
}

export function formatPreview(story: StoryData) {
  const paragraphs = story.content
    .split("\n")
    .filter((p) => p.trim() !== "");

  return {
    ...story,
    paragraphs,
    wordCount: story.content.trim().split(/\s+/).length,
  };
}