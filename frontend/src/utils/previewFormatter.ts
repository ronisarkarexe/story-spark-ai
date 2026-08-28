export interface StoryData {
  title: string;
  author: string;
  content: string;
}

export function formatPreview(story: StoryData) {
  const content = story?.content || '';
  const paragraphs = content
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const words = content.trim().split(/\s+/).filter(Boolean);

  return {
    title: story?.title || '',
    author: story?.author || '',
    content,
    paragraphs,
    wordCount: words.length,
  };
}