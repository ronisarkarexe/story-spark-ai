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

const TENSION_KEYWORDS = [
  "suddenly",
  "mystery",
  "secret",
  "unknown",
  "dark",
  "shadow",
  "danger",
  "fear",
  "chase",
  "discover",
];

function scoreSection(text: string): number {
  const lower = text.toLowerCase();
  const hits = TENSION_KEYWORDS.reduce(
    (sum, keyword) => sum + (lower.match(new RegExp(keyword, "g")) || []).length,
    0
  );
  const words = lower.split(/\s+/).filter(Boolean).length;

  if (words === 0) return 0;

  return Math.min(100, Math.round((hits / words) * 500));
}

function statusFor(score: number): SuspenseSection["status"] {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function observationFor(status: SuspenseSection["status"]): string {
  switch (status) {
    case "High":
      return "Conflict escalates effectively with strong anticipation.";
    case "Medium":
      return "The section builds moderate tension.";
    default:
      return "The section resolves calmly without strong suspense.";
  }
}

function suggestionFor(status: SuspenseSection["status"]): string {
  switch (status) {
    case "High":
      return "Maintain momentum by increasing uncertainty before the climax.";
    case "Medium":
      return "Introduce a small twist or hidden detail to raise stakes.";
    default:
      return "Delay key revelations and introduce unexpected twists for greater impact.";
  }
}

export function analyzeStorySuspense(
  story: string
): SuspenseAnalysis {
  if (!story.trim()) {
    return {
      overallScore: 0,
      sections: [],
    };
  }

  const sections = story
    .split(/\n{2,}/)
    .filter((section) => section.trim());

  const analyzed = sections.map((section, index) => {
    const tensionScore = scoreSection(section);
    const status = statusFor(tensionScore);

    return {
      id: index + 1,
      title: `Section ${index + 1}`,
      tensionScore,
      status,
      observation: observationFor(status),
      suggestion: suggestionFor(status),
    };
  });

  const overallScore =
    analyzed.length === 0
      ? 0
      : Math.round(
          analyzed.reduce((sum, s) => sum + s.tensionScore, 0) /
            analyzed.length
        );

  return {
    overallScore,
    sections: analyzed,
  };
}

export function refreshSuspenseAnalysis(story: string) {
  return analyzeStorySuspense(story);
}
