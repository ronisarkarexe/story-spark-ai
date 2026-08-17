import { describe, it, expect } from "vitest";
import { analyzeCharacterArcs, refreshCharacterArcAnalysis } from "../characterArcTracker";

describe("analyzeCharacterArcs", () => {
  it("returns overallScore of 0 and empty characters array for empty story", () => {
    const result = analyzeCharacterArcs("");
    expect(result.overallScore).toBe(0);
    expect(result.characters).toEqual([]);
  });

  it("returns overallScore of 0 and empty characters array for whitespace-only story", () => {
    const result = analyzeCharacterArcs("   \n\t  ");
    expect(result.overallScore).toBe(0);
    expect(result.characters).toEqual([]);
  });

  it("returns an object with overallScore and characters array for non-empty story", () => {
    const result = analyzeCharacterArcs("Emma was timid at first. Later she became a confident leader.");
    expect(typeof result.overallScore).toBe("number");
    expect(Array.isArray(result.characters)).toBe(true);
  });

  it("characters array contains objects with expected fields", () => {
    const result = analyzeCharacterArcs("Emma was timid at first. Later she became a confident leader.");
    expect(result.characters.length).toBeGreaterThan(0);
    result.characters.forEach((char) => {
      expect(typeof char.id).toBe("number");
      expect(typeof char.name).toBe("string");
      expect(["Strong", "Moderate", "Weak"]).toContain(char.growth);
      expect(typeof char.beginning).toBe("string");
      expect(typeof char.ending).toBe("string");
      expect(typeof char.summary).toBe("string");
      expect(typeof char.suggestion).toBe("string");
    });
  });

  it("character ids are sequential starting from 1", () => {
    const result = analyzeCharacterArcs("Emma started as a timid person. Liam was impulsive. Sophia was a supportive friend.");
    result.characters.forEach((char, index) => {
      expect(char.id).toBe(index + 1);
    });
  });
});

describe("refreshCharacterArcAnalysis", () => {
  it("returns an object with same structure as analyzeCharacterArcs", () => {
    const story = "Emma grew from timid to confident.";
    const result = refreshCharacterArcAnalysis(story);
    expect(typeof result.overallScore).toBe("number");
    expect(Array.isArray(result.characters)).toBe(true);
  });

  it("returns overallScore of 0 for empty story", () => {
    const result = refreshCharacterArcAnalysis("");
    expect(result.overallScore).toBe(0);
    expect(result.characters).toEqual([]);
  });

  it("returns same result as analyzeCharacterArcs for the same story", () => {
    const story = "A story about Emma becoming brave.";
    const result1 = analyzeCharacterArcs(story);
    const result2 = refreshCharacterArcAnalysis(story);
    expect(result2.overallScore).toBe(result1.overallScore);
    expect(result2.characters).toHaveLength(result1.characters.length);
  });
});
