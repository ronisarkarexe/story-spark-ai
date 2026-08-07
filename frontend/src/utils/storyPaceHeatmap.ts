export interface PaceSection {
  id: number;
  title: string;
  pace: "Fast" | "Balanced" | "Slow";
  score: number;
  suggestion: string;
}

const SUGGESTIONS: Record<PaceSection["pace"], string> = {
  Fast: "Consider adding more descriptive details to slow the pacing slightly.",
  Balanced: "This section has a healthy pacing balance.",
  Slow: "Consider shortening descriptions or adding dialogue/action.",
};

function classifyPace(words: string[]): PaceSection["pace"] {
  const sentences = words.join(" ").split(/[.!?]+/).filter(Boolean).length;
  const avgWordsPerSentence =
    sentences === 0 ? 0 : Math.round(words.length / sentences);

  if (avgWordsPerSentence <= 12) return "Fast";
  if (avgWordsPerSentence >= 24) return "Slow";
  return "Balanced";
}

export function analyzeStoryPace(
  story: string
): PaceSection[] {
  if (!story.trim()) return [];

  const sections = story
    .split(/\n{2,}/)
    .filter(Boolean);

  return sections.map((section, index) => {
    const words = section.trim().split(/\s+/).filter(Boolean);
    const pace = classifyPace(words);

    const score =
      pace === "Fast"
        ? 90
        : pace === "Balanced"
        ? 65
        : 35;

    return {
      id: index + 1,
      title: `Section ${index + 1}`,
      pace,
      score,
      suggestion: SUGGESTIONS[pace],
    };
  });
}

export function refreshPaceAnalysis(
  story: string
) {
  return analyzeStoryPace(story);
}
