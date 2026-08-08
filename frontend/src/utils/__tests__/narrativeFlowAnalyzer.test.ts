import { describe, it, expect } from "vitest";
import { analyzeNarrativeFlow } from "../narrativeFlowAnalyzer";

describe("analyzeNarrativeFlow", () => {
  it("returns empty issues for a clean story with no flow problems", () => {
    const story =
      "The hero walked through the forest. The trees swayed gently in the wind. Night fell quietly.";
    const issues = analyzeNarrativeFlow(story);
    expect(issues).toHaveLength(0);
  });

  it("detects Suddenly as an abrupt transition issue with High severity", () => {
    const story = "They were walking calmly. Suddenly, everything changed.";
    const issues = analyzeNarrativeFlow(story);
    expect(issues.length).toBeGreaterThan(0);
    const transitionIssue = issues.find(
      (i) => i.type === "Abrupt Transition"
    );
    expect(transitionIssue).toBeDefined();
    expect(transitionIssue?.severity).toBe("High");
  });

  it("does not trigger Suddenly issue when word is absent", () => {
    const story = "The door opened slowly. She stepped inside cautiously.";
    const issues = analyzeNarrativeFlow(story);
    const transitionIssue = issues.find(
      (i) => i.type === "Abrupt Transition"
    );
    expect(transitionIssue).toBeUndefined();
  });

  it("triggers repetition issue when Then appears more than 5 times", () => {
    const story =
      "Then he arrived. Then she left. Then it began. Then the sky fell. Then everything stopped. Then silence.";
    const issues = analyzeNarrativeFlow(story);
    const repetitionIssue = issues.find((i) => i.type === "Repetition");
    expect(repetitionIssue).toBeDefined();
    expect(repetitionIssue?.severity).toBe("Medium");
  });

  it("does not trigger repetition issue when Then appears 5 or fewer times", () => {
    const story =
      "Then he arrived. Then she left. Then it began. Then the sky fell. Then everything stopped.";
    const issues = analyzeNarrativeFlow(story);
    const repetitionIssue = issues.find((i) => i.type === "Repetition");
    expect(repetitionIssue).toBeUndefined();
  });

  it("returns empty issues for an empty story string", () => {
    const issues = analyzeNarrativeFlow("");
    expect(issues).toHaveLength(0);
  });

  it("returns empty issues for a whitespace-only story", () => {
    const issues = analyzeNarrativeFlow("   \n\n  ");
    expect(issues).toHaveLength(0);
  });

  it("includes a suggestion for each issue", () => {
    const story = "Then he came. Then she left. Suddenly, chaos erupted.";
    const issues = analyzeNarrativeFlow(story);
    issues.forEach((issue) => {
      expect(typeof issue.suggestion).toBe("string");
      expect(issue.suggestion.length).toBeGreaterThan(0);
    });
  });
});
