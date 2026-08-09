export interface PacingIssue {
  id: string;
  section: string;
  type: "Too Fast" | "Too Slow" | "Overly Descriptive";
  severity: "Low" | "Medium" | "High";
  suggestion: string;
}

export interface PacingAnalysis {
  issues: PacingIssue[];
  overallScore: number;
}

export const analyzePacing = (
  story: string
): PacingAnalysis => {
  return {
    overallScore: 85,
    issues: [],
  };
};

export const getOverallRating = (
  score: number
) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Needs Improvement";
};

export const refreshAnalysis = (
  story: string
): PacingAnalysis => {
  return analyzePacing(story);
};