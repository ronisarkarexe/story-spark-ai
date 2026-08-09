export interface TimelineIssue {
  id: string;
  event: string;
  type:
    | "Time Jump"
    | "Conflicting Date"
    | "Impossible Sequence";

  severity: "Low" | "Medium" | "High";

  suggestion: string;
}

export interface TimelineAnalysis {
  issues: TimelineIssue[];
}

export const analyzeTimeline = (
  story: string
): TimelineAnalysis => {
  return {
    issues: [],
  };
};

export const rerunTimelineAnalysis = (
  story: string
): TimelineAnalysis => {
  return analyzeTimeline(story);
};

export const getIssueCount = (
  analysis: TimelineAnalysis
) => analysis.issues.length;