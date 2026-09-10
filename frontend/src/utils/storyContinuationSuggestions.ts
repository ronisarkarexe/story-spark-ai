export interface ContinuationSuggestion {
  id: number;
  title: string;
  content: string;
}

export function generateContinuationSuggestions(
  story: string
): ContinuationSuggestion[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      title: "Continue the Adventure",
      content:
        "The mysterious map began glowing as the group stepped into the forgotten temple...",
    },
    {
      id: 2,
      title: "Unexpected Twist",
      content:
        "A familiar face suddenly appeared, revealing a secret that changed everything...",
    },
    {
      id: 3,
      title: "Emotional Development",
      content:
        "The protagonist paused for a moment, finally confronting the emotions hidden for years...",
    },
  ];
}

export function regenerateContinuationSuggestions(
  story: string
): ContinuationSuggestion[] {
  return generateContinuationSuggestions(story);
}