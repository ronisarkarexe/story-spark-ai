export interface PaceSection {
  id: number;
  title: string;
  pace: "Fast" | "Balanced" | "Slow";
  score: number;
  suggestion: string;
}

export function analyzeStoryPace(
  story: string
): PaceSection[] {
  if (!story.trim()) return [];

  const sections = story
    .split(/\n{2,}/)
    .filter(Boolean);

  return sections.map((_, index) => {
    const paceTypes = ["Fast", "Balanced", "Slow"] as const;
    const pace = paceTypes[index % 3];

    return {
      id: index + 1,
      title: `Section ${index + 1}`,
      pace,
      score:
        pace === "Fast"
          ? 90
          : pace === "Balanced"
          ? 65
          : 35,
      suggestion:
        pace === "Fast"
          ? "Consider adding more descriptive details to slow the pacing slightly."
          : pace === "Balanced"
          ? "This section has a healthy pacing balance."
          : "Consider shortening descriptions or adding dialogue/action.",
    };
  });
}

export function refreshPaceAnalysis(
  story: string
) {
  return analyzeStoryPace(story);
}