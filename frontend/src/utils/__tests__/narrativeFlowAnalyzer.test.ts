import { describe, it, expect } from "vitest";
import { analyzeNarrativeFlow } from "../narrativeFlowAnalyzer";

describe("analyzeNarrativeFlow", () => {
  it("detects an ABRUPT TRANSITION and returns the correct issue object", () => {
    const story = "The sun was shining. Suddenly, a monster appeared.";
    const issues = analyzeNarrativeFlow(story);

    expect(issues).toContainEqual({
      id: 1,
      type: "Abrupt Transition",
      severity: "High",
      scene: "Scene Transition",
      explanation: "The transition appears too sudden.",
      suggestion: "Add connecting details explaining the change."
    });
  });

  it("detects REPETITION when 'Then' occurs more than 5 times", () => {
    const story = "Then he walked. Then he talked. Then he ate. Then he slept. Then he woke up. Then he left.";
    const issues = analyzeNarrativeFlow(story);

    expect(issues).toContainEqual({
      id: 2,
      type: "Repetition",
      severity: "Medium",
      scene: "Multiple Scenes",
      explanation: "Repeated transition wording affects flow.",
      suggestion: "Use more varied narrative transitions."
    });
  });

  it("returns no issues for a normal story text", () => {
    const story = "The brave knight entered the dark cave, carrying only a small torch to light the way.";
    const issues = analyzeNarrativeFlow(story);

    expect(issues).toEqual([]);
  });

  it("returns no issues and does not throw for an empty string", () => {
    expect(() => analyzeNarrativeFlow("")).not.toThrow();
    
    const issues = analyzeNarrativeFlow("");
    expect(issues).toEqual([]);
  });
});
