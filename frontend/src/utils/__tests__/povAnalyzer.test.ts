import { describe, it, expect } from "vitest";
import { analyzePOV } from "../povAnalyzer";

describe("analyzePOV", () => {
  it("returns no issues for a clean first-person narration", () => {
    const story = "I walked down the street. I saw my friend waiting for me.";
    const issues = analyzePOV(story, "First Person");
    expect(issues).toHaveLength(0);
  });

  it("returns no issues for a clean third-person narration", () => {
    const story = "John walked down the street. He saw his friend waiting for him.";
    const issues = analyzePOV(story, "Third Person");
    expect(issues).toHaveLength(0);
  });

  it("detects third-person pronouns when first-person POV is expected", () => {
    const story = "I walked home. Then she appeared from around the corner.";
    const issues = analyzePOV(story, "First Person");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].detectedPOV).toBe("Third Person");
  });

  it("detects first-person pronouns when third-person POV is expected", () => {
    const story = "John was walking home. I felt a chill run down my spine.";
    const issues = analyzePOV(story, "Third Person");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].detectedPOV).toBe("First Person");
  });

  it("returns empty array for an empty story string", () => {
    const issues = analyzePOV("", "First Person");
    expect(issues).toHaveLength(0);
  });

  it("returns empty array when story contains no pronouns", () => {
    const story = "The house stood on the hill. The door was painted blue.";
    const issues = analyzePOV(story, "Third Person");
    expect(issues).toHaveLength(0);
  });

  it("includes a suggestion in each issue", () => {
    const story = "I was walking. He followed behind.";
    const issues = analyzePOV(story, "First Person");
    issues.forEach((issue) => {
      expect(typeof issue.suggestion).toBe("string");
      expect(issue.suggestion.length).toBeGreaterThan(0);
    });
  });

  it("handles story with multiple POV violations", () => {
    const story = "I woke up. He was already there. I left. She followed.";
    const issues = analyzePOV(story, "First Person");
    expect(issues.length).toBeGreaterThanOrEqual(2);
  });
});
