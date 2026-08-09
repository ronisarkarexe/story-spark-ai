export interface StoryEvent {
  id: number;
  title: string;
  content: string;
}

export function extractStoryEvents(
  story: string
): StoryEvent[] {
  const paragraphs = story
    .split(/\n\s*\n/)
    .filter((p) => p.trim() !== "");

  return paragraphs.map((paragraph, index) => ({
    id: index + 1,
    title: `Event ${index + 1}`,
    content: paragraph,
  }));
}

export function refreshTimeline(story: string) {
  return extractStoryEvents(story);
}