import { NarrativeIssue } from "../types/narrative";

export function analyzeNarrativeFlow(
  story: string
): NarrativeIssue[] {

  const issues: NarrativeIssue[] = [];

  if (/suddenly/i.test(story)) {
    issues.push({
      id: 1,
      type: "Abrupt Transition",
      severity: "High",
      scene: "Scene Transition",
      explanation:
        "The transition appears too sudden.",
      suggestion:
        "Add connecting details explaining the change."
    });
  }

  if ((story.match(/Then/g) || []).length > 5) {
    issues.push({
      id: 2,
      type: "Repetition",
      severity: "Medium",
      scene: "Multiple Scenes",
      explanation:
        "Repeated transition wording affects flow.",
      suggestion:
        "Use more varied narrative transitions."
    });
  }

  return issues;
}