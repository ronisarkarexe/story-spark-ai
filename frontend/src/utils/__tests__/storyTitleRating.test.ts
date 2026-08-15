import { describe, it, expect } from "vitest";
import { analyzeTitle } from "../storyTitleRating";

describe("analyzeTitle - whitespace-only handling", () => {
  it("returns a zeroed report for a blank title", () => {
    const result = analyzeTitle("");
    expect(result.score).toBe(0);
    expect(result.creativity).toBe(0);
    expect(result.relevance).toBe(0);
    expect(result.clarity).toBe(0);
    expect(result.appeal).toBe(0);
    expect(result.strengths).toEqual([]);
    expect(result.weaknesses).toContain("Title is empty");
  });

  it("returns a zeroed report for a whitespace-only title", () => {
    const result = analyzeTitle("     \t\n  ");
    expect(result.score).toBe(0);
    expect(result.suggestions).not.toContainEqual(" Chronicles");
    // Suggestions must not contain the raw whitespace title.
    for (const s of result.suggestions) {
      expect(s.trim().length).toBeGreaterThan(0);
    }
  });

  it("returns a normal analysis for a non-empty title", () => {
    const result = analyzeTitle("The Lost Kingdom");
    expect(result.score).toBeGreaterThan(0);
    expect(result.suggestions).toContain("The Lost Kingdom Chronicles");
  });

  it("uses the trimmed title in suggestions", () => {
    const result = analyzeTitle("  Dragon Flight  ");
    expect(result.suggestions).toContain("Dragon Flight Chronicles");
    expect(result.suggestions).toContain("The Dragon Flight");
  });
});
