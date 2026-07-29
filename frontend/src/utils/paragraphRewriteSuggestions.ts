export interface RewriteSuggestion {
  id: number;
  title: string;
  content: string;
}

export function generateRewriteSuggestions(
  paragraph: string,
  story: string
): RewriteSuggestion[] {
  if (!paragraph.trim()) return [];

  return [
    {
      id: 1,
      title: "Improve Clarity",
      content:
        "This version simplifies sentence structure while preserving the original meaning."
    },
    {
      id: 2,
      title: "More Descriptive",
      content:
        "This version enhances imagery and descriptive language for a richer reading experience."
    },
    {
      id: 3,
      title: "More Dramatic",
      content:
        "This version increases tension and emotional impact without changing the plot."
    }
  ];
}

export function regenerateRewriteSuggestions(
  paragraph: string,
  story: string
) {
  return generateRewriteSuggestions(paragraph, story);
}