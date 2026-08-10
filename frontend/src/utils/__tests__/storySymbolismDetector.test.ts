import { describe, it, expect } from "vitest";
import {
  analyzeStorySymbolism,
  refreshStorySymbolism,
} from "../storySymbolismDetector";

const VALID_TYPES = ["Symbol", "Metaphor", "Motif"] as const;

describe("analyzeStorySymbolism", () => {
  it("returns [] for empty/whitespace input", () => {
    expect(analyzeStorySymbolism("")).toEqual([]);
    expect(analyzeStorySymbolism("   \n  ")).toEqual([]);
  });

  it("returns a non-empty list of symbols for non-empty input", () => {
    const r = analyzeStorySymbolism("A story with symbols.");
    expect(r.length).toBeGreaterThan(0);
  });

  it("each symbol has the required fields with correct types", () => {
    const r = analyzeStorySymbolism("A story.");
    for (const s of r) {
      expect(typeof s.id).toBe("number");
      expect(typeof s.symbol).toBe("string");
      expect(s.symbol.length).toBeGreaterThan(0);
      expect(VALID_TYPES).toContain(s.type);
      expect(typeof s.meaning).toBe("string");
      expect(s.meaning.length).toBeGreaterThan(0);
      expect(typeof s.relatedPassage).toBe("string");
      expect(s.relatedPassage.length).toBeGreaterThan(0);
    }
  });

  it("symbol ids are unique and sequential", () => {
    const r = analyzeStorySymbolism("A story.");
    const ids = r.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("symbols are unique", () => {
    const r = analyzeStorySymbolism("A story.");
    const symbols = r.map((s) => s.symbol);
    expect(new Set(symbols).size).toBe(symbols.length);
  });

  it("is deterministic for the same input", () => {
    const story = "A deterministic symbolic story.";
    expect(analyzeStorySymbolism(story)).toEqual(analyzeStorySymbolism(story));
  });
});

describe("refreshStorySymbolism", () => {
  it("delegates to analyzeStorySymbolism", () => {
    const story = "A story to refresh symbolism for.";
    expect(refreshStorySymbolism(story)).toEqual(analyzeStorySymbolism(story));
  });

  it("returns [] for empty input", () => {
    expect(refreshStorySymbolism("")).toEqual([]);
  });
});
