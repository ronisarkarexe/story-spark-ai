export interface Chapter {
  id: number;
  title: string;
  content: string;
}

export function splitIntoChapters(story: string): Chapter[] {
  const parts = story.split(/(?=Chapter\s+\d+)/i);

  return parts
    .filter((part) => part.trim() !== "")
    .map((part, index) => {
      const lines = part.trim().split("\n");

      return {
        id: index + 1,
        title: lines[0] || `Chapter ${index + 1}`,
        content: lines.slice(1).join("\n"),
      };
    });
}

export function renumberChapters(chapters: Chapter[]) {
  return chapters.map((chapter, index) => ({
    ...chapter,
    id: index + 1,
    title: `Chapter ${index + 1}`,
  }));
}