import { describe, it, expect } from "vitest";
import {
  analyzeReadingLevel,
  reanalyzeReadingLevel,
} from "../storyReadingLevelAnalyzer";

describe("analyzeReadingLevel", () => {
  it("returns a zeroed report for empty text", () => {
    const result = analyzeReadingLevel("");
    expect(result.vocabularyScore).toBe(0);
    expect(result.sentenceComplexity).toBe(0);
    expect(result.suggestions).toEqual([]);
    expect(result.level).toBe("Children's");
  });

  it("returns a report for a non-empty story", () => {
    const result = analyzeReadingLevel("The story contains moderately advanced vocabulary.");
    expect(typeof result.vocabularyScore).toBe("number");
    expect(typeof result.sentenceComplexity).toBe("number");
  });

  it("returns the expected report shape", () => {
    const result = analyzeReadingLevel("A tale of high adventure.");
    expect(result).toHaveProperty("level");
    expect(result).toHaveProperty("vocabularyScore");
    expect(result).toHaveProperty("sentenceComplexity");
    expect(result).toHaveProperty("explanation");
    expect(result).toHaveProperty("suggestions");
  });

  it("keeps score fields within 0-100", () => {
    const result = analyzeReadingLevel("A tale of high adventure.");
    expect(result.vocabularyScore).toBeGreaterThanOrEqual(0);
    expect(result.vocabularyScore).toBeLessThanOrEqual(100);
    expect(result.sentenceComplexity).toBeGreaterThanOrEqual(0);
    expect(result.sentenceComplexity).toBeLessThanOrEqual(100);
  });

  it("returns a valid reading level", () => {
    const result = analyzeReadingLevel("A tale of high adventure.");
    const valid = ["Children's", "Middle School", "High School", "College", "Advanced"];
    expect(valid).toContain(result.level);
  });

  it("reanalyzeReadingLevel returns the same result", () => {
    const story = "A story with varied sentence structures.";
    expect(reanalyzeReadingLevel(story)).toEqual(analyzeReadingLevel(story));
  });
});
