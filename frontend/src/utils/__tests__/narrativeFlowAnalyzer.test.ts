import { describe, it, expect } from "vitest";
import { analyzeNarrativeFlow } from "../narrativeFlowAnalyzer";

describe("narrativeFlowAnalyzer", () => {
  it("returns an array", () => {
    const result = analyzeNarrativeFlow("any story text");
    expect(Array.isArray(result)).toBe(true);
  });

  it("detects 'Suddenly' as an abrupt transition issue", () => {
    const result = analyzeNarrativeFlow("Chapter 1: The hero walked in. Suddenly, the ground shook.");
    expect(result.length).toBeGreaterThan(0);
    const issue = result.find((i) => i.type === "Abrupt Transition");
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe("High");
    expect(issue?.scene).toBe("Scene Transition");
  });

  it("detects more than 5 'Then' words as a repetition issue", () => {
    const story =
      "Then he walked. Then she ran. Then they talked. Then the sun set. Then night came. Then silence.";
    const result = analyzeNarrativeFlow(story);
    expect(result.length).toBeGreaterThan(0);
    const issue = result.find((i) => i.type === "Repetition");
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe("Medium");
    expect(issue?.scene).toBe("Multiple Scenes");
  });

  it("returns empty array when no issues are present", () => {
    const story = "Chapter 1: The hero set out on a journey through the forest.";
    const result = analyzeNarrativeFlow(story);
    expect(result).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    const result = analyzeNarrativeFlow("");
    expect(result).toEqual([]);
  });

  it("does not flag exactly 5 'Then' words", () => {
    const story = "Then. Then. Then. Then. Then.";
    const result = analyzeNarrativeFlow(story);
    const repetition = result.find((i) => i.type === "Repetition");
    expect(repetition).toBeUndefined();
  });

  it("issues have all required NarrativeIssue fields", () => {
    const result = analyzeNarrativeFlow("Suddenly everything changed.");
    if (result.length > 0) {
      const issue = result[0];
      expect(issue).toHaveProperty("id");
      expect(issue).toHaveProperty("type");
      expect(issue).toHaveProperty("severity");
      expect(issue).toHaveProperty("scene");
      expect(issue).toHaveProperty("explanation");
      expect(issue).toHaveProperty("suggestion");
      expect(typeof issue.id).toBe("number");
      expect(typeof issue.scene).toBe("string");
    }
  });
});
