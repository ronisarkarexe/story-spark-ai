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
    .filter((s) => s.trim());

  return sections.map((section, index) => {
    const words = section.trim().split(/\s+/).filter(Boolean);
    const sentences = section
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const wordCount = Math.max(words.length, 1);
    const sentenceCount = Math.max(sentences.length, 1);

    // Average words per sentence is a real proxy for pacing: more words per
    // sentence → faster/denser narration; fewer → slower, more descriptive.
    const wordsPerSentence = wordCount / sentenceCount;
    // Map ~6-30 words/sentence onto a 30-95 score band.
    const score = Math.max(
      30,
      Math.min(95, Math.round(30 + (wordsPerSentence - 6) * 2.8))
    );

    const pace: PaceSection["pace"] =
      score >= 75 ? "Fast" : score >= 50 ? "Balanced" : "Slow";

    const suggestion =
      pace === "Fast"
        ? "Consider adding more descriptive details to slow the pacing slightly."
        : pace === "Balanced"
        ? "This section has a healthy pacing balance."
        : "Consider shortening descriptions or adding dialogue/action.";

    return {
      id: index + 1,
      title: `Section ${index + 1}`,
      pace,
      score,
      suggestion,
    };
  });
}

export function refreshPaceAnalysis(
  story: string
) {
  return analyzeStoryPace(story);
}