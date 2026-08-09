export interface NarrativeIssue {
  type: string;
}

export const narrativeFlowAnalyzer = (story: string): NarrativeIssue[] => {
  const issues: NarrativeIssue[] = [];
  
  if (!story) {
    return issues;
  }

  // Detect Abrupt Transition
  if (story.includes("Suddenly")) {
    issues.push({ type: "Abrupt Transition" });
  }

  // Detect Repetition (>5 occurrences of 'Then')
  const thenCount = (story.match(/Then/g) || []).length;
  if (thenCount > 5) {
    issues.push({ type: "Repetition" });
  }

  return issues;
};
