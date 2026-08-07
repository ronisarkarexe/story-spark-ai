import { describe, it, expect } from "vitest";
import {
  analyzeStorySymbolism,
  refreshStorySymbolism,
} from "../storySymbolismDetector";

describe("analyzeStorySymbolism", () => {
  it("returns an empty array for empty text", () => {
    expect(analyzeStorySymbolism("")).toEqual([]);
    expect(analyzeStorySymbolism("   ")).toEqual([]);
  });

  it("returns symbols for a non-empty story", () => {
    const result = analyzeStorySymbolism("The storm raged through the night.");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns symbols with the expected shape", () => {
    const result = analyzeStorySymbolism("The old clock stopped ticking.");
    const symbol = result[0];
    expect(symbol).toHaveProperty("id");
    expect(symbol).toHaveProperty("symbol");
    expect(symbol).toHaveProperty("type");
    expect(symbol).toHaveProperty("meaning");
    expect(symbol).toHaveProperty("relatedPassage");
  });

  it("classifies type as Symbol, Metaphor, or Motif", () => {
    const result = analyzeStorySymbolism("A white feather drifted down.");
    const valid = ["Symbol", "Metaphor", "Motif"];
    for (const symbol of result) {
      expect(valid).toContain(symbol.type);
    }
  });

  it("assigns sequential ids", () => {
    const result = analyzeStorySymbolism("The lighthouse beam swept the sea.");
    result.forEach((symbol, index) => {
      expect(symbol.id).toBe(index + 1);
    });
  });

  it("refreshStorySymbolism returns the same result", () => {
    const story = "The broken mirror reflected the past.";
    expect(refreshStorySymbolism(story)).toEqual(analyzeStorySymbolism(story));
  });
});
