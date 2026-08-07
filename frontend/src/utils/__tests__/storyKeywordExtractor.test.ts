import { describe, it, expect } from "vitest";
import { extractKeywords, removeKeyword } from "../storyKeywordExtractor";

describe("extractKeywords", () => {
  it("filters out stop words", () => {
    const result = extractKeywords("the and or of a story about dragons");
    expect(result.keywords).not.toContain("the");
    expect(result.keywords).not.toContain("and");
    expect(result.keywords).not.toContain("a");
  });

  it("drops words of length 3 or shorter", () => {
    const result = extractKeywords("cat dog run fly big sky story");
    expect(result.keywords).not.toContain("cat");
    expect(result.keywords).not.toContain("dog");
    expect(result.keywords).toContain("story");
  });

  it("deduplicates repeated words", () => {
    const result = extractKeywords("dragon dragon dragon castle");
    const occurrences = result.keywords.filter((k) => k === "dragon").length;
    expect(occurrences).toBeLessThanOrEqual(1);
  });

  it("buckets keywords into themes, locations, characters, and concepts", () => {
    const result = extractKeywords("dragon mountain hero sword magic kingdom prophecy warrior forest treasure ancient relic");
    expect(result.themes.length).toBeGreaterThan(0);
    expect(result.locations.length).toBeGreaterThan(0);
    expect(result.characters.length).toBeGreaterThan(0);
    expect(result.concepts.length).toBeGreaterThan(0);
  });

  it("returns empty buckets for empty input", () => {
    const result = extractKeywords("");
    expect(result.keywords).toEqual([]);
    expect(result.themes).toEqual([]);
    expect(result.locations).toEqual([]);
    expect(result.characters).toEqual([]);
    expect(result.concepts).toEqual([]);
  });

  it("removeKeyword removes only the matching keyword", () => {
    const result = removeKeyword(["dragon", "castle", "sword"], "castle");
    expect(result).toEqual(["dragon", "sword"]);
  });

  it("removeKeyword returns the original list when the keyword is absent", () => {
    const result = removeKeyword(["dragon", "castle"], "sword");
    expect(result).toEqual(["dragon", "castle"]);
  });
});
