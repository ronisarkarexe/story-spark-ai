export interface StoryChapter {
  id: number;
  title: string;
  content: string;
}

export function generateChapters(story: string): StoryChapter[] {
  const paragraphs = story
    .split("\n\n")
    .filter((paragraph) => paragraph.trim() !== "");

  return paragraphs.map((paragraph, index) => ({
    id: index + 1,
    title: `Chapter ${index + 1}`,
    content: paragraph,
  }));
}

export function regenerateChapter(
  chapter: StoryChapter
): StoryChapter {
  return {
    ...chapter,
    content: chapter.content,
  };
}