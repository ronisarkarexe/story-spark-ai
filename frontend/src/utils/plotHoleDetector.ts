export interface PlotHoleIssue {
  id: string;
  type: "Plot Hole" | "Missing Explanation" | "Inconsistency";
  severity: "Low" | "Medium" | "High";
  message: string;
  suggestion: string;
}

export interface PlotAnalysis {
  issues: PlotHoleIssue[];
}

export const analyzeStory = (story: string): PlotAnalysis => {
  return {
    issues: [],
  };
};

export const hasIssues = (analysis: PlotAnalysis) => {
  return analysis.issues.length > 0;
};

export const getHighSeverityIssues = (
  analysis: PlotAnalysis
) => {
  return analysis.issues.filter(
    (issue) => issue.severity === "High"
  );
};

export const rerunAnalysis = (
  story: string
): PlotAnalysis => {
  return analyzeStory(story);
};