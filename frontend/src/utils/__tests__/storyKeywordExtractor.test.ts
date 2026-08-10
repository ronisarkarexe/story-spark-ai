import { describe, it, expect } from "vitest";
import { extractKeywords, removeKeyword } from "../storyKeywordExtractor";

describe("extractKeywords", () => {
  it("returns the five required arrays", () => {
    const r = extractKeywords("adventure mystery castle forest heroes journey");
    expect(r).toHaveProperty("keywords");
    expect(r).toHaveProperty("themes");
    expect(r).toHaveProperty("locations");
    expect(r).toHaveProperty("characters");
    expect(r).toHaveProperty("concepts");
    for (const arr of [r.keywords, r.themes, r.locations, r.characters, r.concepts]) {
      expect(Array.isArray(arr)).toBe(true);
    }
  });

  it("keywords is a subset of non-stop, length>3 words", () => {
    const r = extractKeywords("the cat adventure mystery castle");
    // "the" and "cat" (length 3) are excluded
    for (const k of r.keywords) {
      expect(k.length).toBeGreaterThan(3);
      expect(["the", "cat"]).not.toContain(k.toLowerCase());
    }
  });

  it("keywords contains at most 12 items", () => {
    const many = Array.from({ length: 20 }, (_, i) => `word${i}abc`).join(" ");
    expect(extractKeywords(many).keywords.length).toBeLessThanOrEqual(12);
  });

  it("themes has at most 4 items", () => {
    const many = Array.from({ length: 20 }, (_, i) => `word${i}abc`).join(" ");
    expect(extractKeywords(many).themes.length).toBeLessThanOrEqual(4);
  });

  it("extracted keywords are unique", () => {
    const r = extractKeywords("adventure adventure mystery mystery castle");
    const keywords = r.keywords;
    expect(new Set(keywords).size).toBe(keywords.length);
  });

  it("returns mostly empty arrays for a story with only short/stop words", () => {
    const r = extractKeywords("the a an is was it of to on");
    expect(r.keywords).toEqual([]);
  });

  it("is deterministic for the same input", () => {
    const story = "adventure mystery castle forest heroes journey quest";
    expect(extractKeywords(story)).toEqual(extractKeywords(story));
  });
});

describe("removeKeyword", () => {
  it("removes all occurrences of the keyword", () => {
    const r = removeKeyword(["adventure", "mystery", "adventure"], "adventure");
    expect(r).toEqual(["mystery"]);
  });

  it("returns the array unchanged when the keyword is absent", () => {
    const r = removeKeyword(["adventure", "mystery"], "castle");
    expect(r).toEqual(["adventure", "mystery"]);
  });

  it("returns an empty array for empty input", () => {
    expect(removeKeyword([], "adventure")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const arr = ["adventure", "mystery"];
    removeKeyword(arr, "adventure");
    expect(arr).toEqual(["adventure", "mystery"]);
  });
});
