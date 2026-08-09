export interface ContinuityIssue {
  id: number;
  category:
    | "Character"
    | "Timeline"
    | "Location"
    | "Object"
    | "Story Logic";
  section: string;
  severity: "Low" | "Medium" | "High";
  issue: string;
  suggestion: string;
}

export interface ContinuityAnalysis {
  overallScore: number;
  issues: ContinuityIssue[];
}

export function analyzeStoryContinuity(
  story: string
): ContinuityAnalysis {
  if (!story.trim()) {
    return {
      overallScore: 0,
      issues: [],
    };
  }

  return {
    overallScore: 91,
    issues: [
      {
        id: 1,
        category: "Character",
        section: "Chapter 2",
        severity: "Medium",
        issue:
          "The protagonist's eye color changes from blue to green.",
        suggestion:
          "Keep character descriptions consistent throughout the story.",
      },
      {
        id: 2,
        category: "Timeline",
        section: "Chapter 5",
        severity: "High",
        issue:
          "Events occur before previously established dates.",
        suggestion:
          "Reorder or clarify the sequence of events.",
      },
      {
        id: 3,
        category: "Location",
        section: "Final Chapter",
        severity: "Low",
        issue:
          "A location is referenced without prior introduction.",
        suggestion:
          "Introduce the location earlier in the narrative.",
      },
    ],
  };
}

export function refreshContinuityAnalysis(
  story: string
) {
  return analyzeStoryContinuity(story);
}