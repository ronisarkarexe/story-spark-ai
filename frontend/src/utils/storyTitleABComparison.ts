export interface StoryTitleOption {
  id: number;
  title: string;
  creativity: number;
  relevance: number;
  memorability: number;
  emotionalAppeal: number;
  feedback: string;
}

export function generateStoryTitleOptions(
  story: string
): StoryTitleOption[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      title: "Echoes of Tomorrow",
      creativity: 92,
      relevance: 90,
      memorability: 89,
      emotionalAppeal: 91,
      feedback:
        "Strong emotional appeal with a memorable and intriguing tone.",
    },
    {
      id: 2,
      title: "Beyond the Last Horizon",
      creativity: 88,
      relevance: 94,
      memorability: 86,
      emotionalAppeal: 90,
      feedback:
        "Excellent relevance to adventure themes and emotional journey.",
    },
    {
      id: 3,
      title: "The Forgotten Promise",
      creativity: 90,
      relevance: 91,
      memorability: 93,
      emotionalAppeal: 94,
      feedback:
        "Very memorable title that creates curiosity and emotional impact.",
    },
  ];
}

export function regenerateStoryTitles(
  story: string
) {
  return generateStoryTitleOptions(story);
}