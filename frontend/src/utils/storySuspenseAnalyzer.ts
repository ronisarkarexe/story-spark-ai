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

export function analyzeStorySuspense(
  story: string
): SuspenseAnalysis {
  if (!story.trim()) {
    return {
      overallScore: 0,
      sections: [],
    };
  }

  return {
    overallScore: 84,
    sections: [
      {
        id: 1,
        title: "Opening",
        tensionScore: 72,
        status: "Medium",
        observation:
          "The opening establishes context but introduces conflict slowly.",
        suggestion:
          "Begin with a stronger hook or mystery to capture attention immediately.",
      },
      {
        id: 2,
        title: "Middle",
        tensionScore: 91,
        status: "High",
        observation:
          "Conflict escalates effectively with strong anticipation.",
        suggestion:
          "Maintain momentum by increasing uncertainty before the climax.",
      },
      {
        id: 3,
        title: "Ending",
        tensionScore: 63,
        status: "Low",
        observation:
          "The final reveal feels predictable and lacks a strong cliffhanger.",
        suggestion:
          "Delay key revelations and introduce unexpected twists for greater impact.",
      },
    ],
  };
}

export function refreshSuspenseAnalysis(story: string) {
  return analyzeStorySuspense(story);
}