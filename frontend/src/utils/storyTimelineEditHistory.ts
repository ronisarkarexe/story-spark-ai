export interface StoryEditCheckpoint {
  id: number;
  timestamp: string;
  title: string;
  summary: string;
  version: string;
  content: string;
}

export function generateEditHistory(
  story: string
): StoryEditCheckpoint[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      timestamp: "10:15 AM",
      title: "Initial Draft",
      summary: "Created the first draft of the story.",
      version: "v1.0",
      content: story,
    },
    {
      id: 2,
      timestamp: "11:05 AM",
      title: "Dialogue Improved",
      summary: "Enhanced conversations between main characters.",
      version: "v1.1",
      content: story,
    },
    {
      id: 3,
      timestamp: "12:20 PM",
      title: "Ending Revised",
      summary: "Updated the ending and fixed plot consistency.",
      version: "v1.2",
      content: story,
    },
  ];
}

export function restoreStoryVersion(
  checkpoints: StoryEditCheckpoint[],
  id: number
): string {
  const checkpoint = checkpoints.find((item) => item.id === id);
  return checkpoint?.content ?? "";
}

export function refreshTimelineHistory(
  story: string
) {
  return generateEditHistory(story);
}