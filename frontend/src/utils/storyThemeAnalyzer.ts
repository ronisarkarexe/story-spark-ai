export interface StoryTheme {
  id: number;
  name: string;
  description: string;
  highlightedSection: string;
  confidence: number;
}

export function analyzeStoryThemes(
  story: string
): StoryTheme[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      name: "Friendship",
      description:
        "The story emphasizes trust, loyalty, and cooperation between characters.",
      highlightedSection: "Chapter 2",
      confidence: 95,
    },
    {
      id: 2,
      name: "Hope",
      description:
        "Characters continue moving forward despite difficult circumstances.",
      highlightedSection: "Chapter 5",
      confidence: 88,
    },
    {
      id: 3,
      name: "Sacrifice",
      description:
        "Important decisions require characters to give up something valuable for others.",
      highlightedSection: "Chapter 8",
      confidence: 84,
    },
  ];
}

export function reanalyzeStoryThemes(
  story: string
) {
  return analyzeStoryThemes(story);
}