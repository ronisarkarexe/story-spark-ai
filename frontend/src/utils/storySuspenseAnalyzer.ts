export interface SuspenseSection {
  id: number;
  title: string;
  tensionScore: number;
  status: "High" | "Medium" | "Low";
  observation: string;
  suggestion: string;
}

export interface SuspenseAnalysis {
  overallScore: number;
  sections: SuspenseSection[];
}

const SUSPENSE_KEYWORDS = [
  "suddenly",
  "tension",
  "fear",
  "danger",
  "mystery",
  "threat",
  "panic",
  "shadow",
  "unknown",
  "secret",
  "alarm",
  "warning",
  "whisper",
  "silence",
  "desperate",
  "escape",
  "chase",
  "reveal",
  "cliffhanger",
  "unseen",
];

const clamp = (n: number, lo = 0, hi = 100) =>
  Math.max(lo, Math.min(hi, n));

const statusFor = (score: number): "High" | "Medium" | "Low" =>
  score >= 80 ? "High" : score >= 55 ? "Medium" : "Low";

export function analyzeStorySuspense(
  story: string
): SuspenseAnalysis {
  if (!story.trim()) {
    return {
      overallScore: 0,
      sections: [],
    };
  }

  // Split the story into narrative sections on blank-line boundaries.
  const paragraphs = story
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const sections = paragraphs.map((paragraph, index) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    const wordCount = Math.max(words.length, 1);
    const lower = paragraph.toLowerCase();
    // Tension contribution from suspense-keyword density.
    const hits = SUSPENSE_KEYWORDS.reduce(
      (count, kw) => count + (lower.split(kw).length - 1),
      0
    );
    const density = (hits / wordCount) * 100;
    // Map keyword density onto a 30-100 tension band so a section with no
    // keywords still registers a non-zero baseline tension.
    const tensionScore = clamp(Math.round(30 + Math.min(density * 12, 70)));

    let observation =
      "This section moves at a steady pace with limited suspense cues.";
    let suggestion =
      "Add a moment of uncertainty or an unanswered question to heighten anticipation.";

    if (tensionScore >= 80) {
      observation =
        "Conflict escalates effectively with strong anticipation.";
      suggestion =
        "Maintain momentum by increasing uncertainty before the climax.";
    } else if (tensionScore < 55) {
      observation =
        "This section feels calm and lacks immediate tension.";
      suggestion =
        "Introduce a subtle threat or delay a key reveal to build suspense.";
    }

    return {
      id: index + 1,
      title: `Section ${index + 1}`,
      tensionScore,
      status: statusFor(tensionScore),
      observation,
      suggestion,
    };
  });

  const overallScore =
    sections.length > 0
      ? clamp(
          Math.round(
            sections.reduce((sum, s) => sum + s.tensionScore, 0) /
              sections.length
          )
        )
      : 0;

  return {
    overallScore,
    sections,
  };
}

export function refreshSuspenseAnalysis(story: string) {
  return analyzeStorySuspense(story);
}