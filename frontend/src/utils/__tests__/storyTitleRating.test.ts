import { describe, it, expect } from "vitest";
import { analyzeTitle, replaceTitle } from "../storyTitleRating";

describe("analyzeTitle", () => {
  it("gives a higher score to titles between 11 and 49 characters", () => {
    const good = analyzeTitle("The Forgotten Kingdom of the North");
    const short = analyzeTitle("Short");
    expect(good.score).toBeGreaterThan(short.score);
  });

  it("gives the lower score to very short titles", () => {
    const result = analyzeTitle("Hi");
    expect(result.score).toBe(70);
  });

  it("gives the lower score to very long titles", () => {
    const long = "A".repeat(60);
    const result = analyzeTitle(long);
    expect(result.score).toBe(70);
  });

  it("returns the expected static score fields", () => {
    const result = analyzeTitle("A Well Crafted Title");
    expect(result.creativity).toBe(86);
    expect(result.relevance).toBe(90);
    expect(result.clarity).toBe(87);
    expect(result.appeal).toBe(89);
  });

  it("includes strengths, weaknesses, and suggestions arrays", () => {
    const result = analyzeTitle("A Well Crafted Title");
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.weaknesses.length).toBeGreaterThan(0);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("generates suggestions that contain the original title", () => {
    const result = analyzeTitle("Shadow");
    for (const suggestion of result.suggestions) {
      expect(suggestion).toContain("Shadow");
    }
  });
});

describe("replaceTitle", () => {
  it("returns the title unchanged", () => {
    expect(replaceTitle("Shadow")).toBe("Shadow");
  });
});
