export interface EndingAlternative {
  id: number;
  title: string;
  style: string;
  emotionalImpact: string;
  content: string;
}

export function generateEndingAlternatives(
  story: string
): EndingAlternative[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      title: "Hopeful Ending",
      style: "Inspirational",
      emotionalImpact: "Positive",
      content:
        "The heroes overcome every obstacle and begin a peaceful new chapter together.",
    },
    {
      id: 2,
      title: "Bittersweet Ending",
      style: "Drama",
      emotionalImpact: "Mixed",
      content:
        "Victory comes with sacrifice, leaving lasting memories and valuable lessons.",
    },
    {
      id: 3,
      title: "Unexpected Twist",
      style: "Mystery",
      emotionalImpact: "Surprising",
      content:
        "The final revelation changes everything the reader believed throughout the story.",
    },
  ];
}

export function styleLabel(
  style: string
): string {
  switch (style.toLowerCase()) {
    case "inspirational":
      return "Motivating";
    case "drama":
      return "Dramatic";
    case "mystery":
      return "Intriguing";
    default:
      return style;
  }
}

export function regenerateEndingAlternatives(
  story: string
) {
  return generateEndingAlternatives(story);
}