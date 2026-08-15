import { describe, it, expect } from "vitest";
import { analyzeReadingInfo } from "../storyReadingInfo";

const VALID_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

describe("analyzeReadingInfo", () => {
  it("returns wordCount 0 and readingTime 1 for empty input", () => {
    const r = analyzeReadingInfo("");
    expect(r.wordCount).toBe(0);
    expect(r.readingTime).toBe(1);
    expect(r.difficulty).toBe("Beginner");
  });

  it("returns wordCount 0 for whitespace-only input", () => {
    expect(analyzeReadingInfo("   \n  ").wordCount).toBe(0);
  });

  it("counts the number of words", () => {
    expect(analyzeReadingInfo("one two three four five").wordCount).toBe(5);
  });

  it("readingTime is at least 1 and scales with word count (200 wpm)", () => {
    expect(analyzeReadingInfo("short").readingTime).toBe(1);
    expect(analyzeReadingInfo("w ".repeat(250).trim()).readingTime).toBe(2);
  });

  it("difficulty is Beginner for wordCount <= 1000", () => {
    const r = analyzeReadingInfo("w ".repeat(500).trim());
    expect(r.difficulty).toBe("Beginner");
  });

  it("difficulty is Intermediate for 1000 < wordCount <= 3000", () => {
    const r = analyzeReadingInfo("w ".repeat(1500).trim());
    expect(r.difficulty).toBe("Intermediate");
  });

  it("difficulty is Advanced for wordCount > 3000", () => {
    const r = analyzeReadingInfo("w ".repeat(3001).trim());
    expect(r.difficulty).toBe("Advanced");
  });

  it("difficulty is one of the valid values", () => {
    const r = analyzeReadingInfo("a story");
    expect(VALID_LEVELS).toContain(r.difficulty);
  });

  it("is deterministic for the same input", () => {
    const story = "a deterministic story with some words";
    expect(analyzeReadingInfo(story)).toEqual(analyzeReadingInfo(story));
  });
});
