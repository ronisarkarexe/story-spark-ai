import { describe, it, expect } from "vitest";
import {
  analyzeReadingLevel,
  reanalyzeReadingLevel,
} from "../storyReadingLevelAnalyzer";

const VALID_LEVELS = [
  "Children's",
  "Middle School",
  "High School",
  "College",
  "Advanced",
] as const;

describe("analyzeReadingLevel", () => {
  it("returns a zeroed report for empty/whitespace input", () => {
    const expected = {
      level: "Children's",
      vocabularyScore: 0,
      sentenceComplexity: 0,
      explanation: "No story available for analysis.",
      suggestions: [],
    };
    expect(analyzeReadingLevel("")).toEqual(expected);
    expect(analyzeReadingLevel("   \n  ")).toEqual(expected);
  });

  it("returns a full report for non-empty input", () => {
    const r = analyzeReadingLevel("A moderately advanced story with varied sentences.");
    expect(r).toHaveProperty("level");
    expect(r).toHaveProperty("vocabularyScore");
    expect(r).toHaveProperty("sentenceComplexity");
    expect(r).toHaveProperty("explanation");
    expect(r).toHaveProperty("suggestions");
  });

  it("level is one of the valid ReadingLevel values", () => {
    const r = analyzeReadingLevel("Some story text.");
    expect(VALID_LEVELS).toContain(r.level);
  });

  it("scores are finite and within 0-100 for non-empty input", () => {
    const r = analyzeReadingLevel("A story to analyze.");
    for (const s of [r.vocabularyScore, r.sentenceComplexity]) {
      expect(Number.isFinite(s)).toBe(true);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    }
  });

  it("explanation is a non-empty string and suggestions is an array of strings for non-empty input", () => {
    const r = analyzeReadingLevel("A story.");
    expect(typeof r.explanation).toBe("string");
    expect(r.explanation.length).toBeGreaterThan(0);
    expect(Array.isArray(r.suggestions)).toBe(true);
    for (const s of r.suggestions) {
      expect(typeof s).toBe("string");
      expect(s.length).toBeGreaterThan(0);
    }
  });

  it("is deterministic for the same input", () => {
    const story = "A deterministic story for reading-level analysis.";
    expect(analyzeReadingLevel(story)).toEqual(analyzeReadingLevel(story));
  });
});

describe("reanalyzeReadingLevel", () => {
  it("delegates to analyzeReadingLevel", () => {
    const story = "A story to reanalyze.";
    expect(reanalyzeReadingLevel(story)).toEqual(analyzeReadingLevel(story));
  });

  it("returns the zeroed report for empty input", () => {
    expect(reanalyzeReadingLevel("")).toEqual(analyzeReadingLevel(""));
  });
});
