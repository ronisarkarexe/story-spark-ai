export interface OutlineIssue {
  id: string;
  category:
    | "Introduction"
    | "Conflict"
    | "Climax"
    | "Resolution"
    | "Characters"
    | "Pacing";

  severity: "Low" | "Medium" | "High";

  message: string;

  suggestion: string;
}

export interface OutlineAnalysis {
  score: number;
  issues: OutlineIssue[];
}

export const analyzeOutline = (
  outline: string
): OutlineAnalysis => {
  if (!outline || !outline.trim()) {
    return {
      score: 0,
      issues: [
        {
          id: "empty-outline",
          category: "Pacing",
          severity: "High",
          message: "No outline provided.",
          suggestion: "Please provide an outline for analysis.",
        },
      ],
    };
  }

  return {
    score: 90,
    issues: [],
  };
};

export const refreshAnalysis = (
  outline: string
) => {
  return analyzeOutline(outline);
};

export const getQualityRating = (
  score: number
) => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  return "Needs Improvement";
};