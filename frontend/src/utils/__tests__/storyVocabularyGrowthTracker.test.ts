import { describe, it, expect } from "vitest";
import { analyzeVocabulary } from "../storyVocabularyGrowthTracker";

describe("analyzeVocabulary - diversity score zero-division guard", () => {
  it("returns a finite diversityScore for normal input", () => {
    const r = analyzeVocabulary("the big bad wolf and the good wolf");
    expect(Number.isFinite(r.diversityScore)).toBe(true);
    expect(r.diversityScore).toBeGreaterThanOrEqual(0);
    expect(r.diversityScore).toBeLessThanOrEqual(100);
  });

  it("diversityScore is 0 (not NaN) when all words are stop words", () => {
    // After stop-word filtering, words.length === 0 → would be NaN without guard.
    const r = analyzeVocabulary("the a an and or to of in is was");
    expect(Number.isFinite(r.diversityScore)).toBe(true);
    expect(r.diversityScore).toBe(0);
    expect(r.totalWords).toBe(0);
    expect(r.uniqueWords).toBe(0);
  });

  it("returns zeroed stats for empty/whitespace input", () => {
    expect(analyzeVocabulary("")).toEqual({
      totalWords: 0,
      uniqueWords: 0,
      diversityScore: 0,
      overusedWords: [],
      growthHistory: [],
    });
    const ws = analyzeVocabulary("   \n  ");
    expect(ws.diversityScore).toBe(0);
  });

  it("computes diversity as unique/total percentage", () => {
    const r = analyzeVocabulary("apple apple banana");
    // stop-word-filtered words: apple, apple, banana → total 3, unique 2 → 67%.
    expect(r.uniqueWords).toBe(2);
    expect(r.totalWords).toBe(3);
    expect(r.diversityScore).toBe(67);
  });
});
