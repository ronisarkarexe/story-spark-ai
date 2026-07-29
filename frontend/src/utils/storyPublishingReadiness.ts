export interface ReadinessMetric {
  name: string;
  score: number;
  status: "Excellent" | "Good" | "Needs Improvement";
  recommendation: string;
}

export interface PublishingReadinessReport {
  overallScore: number;
  metrics: ReadinessMetric[];
}

export function analyzePublishingReadiness(
  story: string
): PublishingReadinessReport {
  if (!story.trim()) {
    return {
      overallScore: 0,
      metrics: [],
    };
  }

  return {
    overallScore: 88,
    metrics: [
      {
        name: "Grammar",
        score: 91,
        status: "Excellent",
        recommendation: "Minor punctuation review."
      },
      {
        name: "Readability",
        score: 86,
        status: "Good",
        recommendation: "Simplify a few long sentences."
      },
      {
        name: "Story Structure",
        score: 90,
        status: "Excellent",
        recommendation: "Well organized."
      },
      {
        name: "Pacing",
        score: 81,
        status: "Good",
        recommendation: "Slow down the final chapter."
      },
      {
        name: "Title Quality",
        score: 79,
        status: "Needs Improvement",
        recommendation: "Make the title more memorable."
      },
      {
        name: "Dialogue Balance",
        score: 84,
        status: "Good",
        recommendation: "Add slightly more character interaction."
      },
      {
        name: "Character Consistency",
        score: 92,
        status: "Excellent",
        recommendation: "Very consistent personalities."
      },
      {
        name: "Ending Quality",
        score: 85,
        status: "Good",
        recommendation: "Increase emotional impact."
      }
    ]
  };
}

export function rerunPublishingAnalysis(
  story: string
) {
  return analyzePublishingReadiness(story);
}