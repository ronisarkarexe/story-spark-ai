import { describe, it, expect } from "vitest";
import {
  analyzeVocabulary,
  refreshVocabularyAnalysis,
} from "../storyVocabularyGrowthTracker";

describe("analyzeVocabulary", () => {
  it("returns zeroed stats for empty/whitespace input", () => {
    const expected = {
      totalWords: 0,
      uniqueWords: 0,
      diversityScore: 0,
      overusedWords: [],
      growthHistory: [],
    };
    expect(analyzeVocabulary("")).toEqual(expected);
    expect(analyzeVocabulary("   \n  ")).toEqual(expected);
  });

  it("counts total words excluding stop words", () => {
    const r = analyzeVocabulary("the quick brown fox");
    // "the" is a stop word; remaining: quick, brown, fox
    expect(r.totalWords).toBe(3);
  });

  it("uniqueWords equals the number of distinct non-stop words", () => {
    const r = analyzeVocabulary("cat dog cat bird");
    // non-stop: cat, dog, cat, bird → distinct: cat, dog, bird
    expect(r.uniqueWords).toBe(3);
  });

  it("diversityScore is 100 when every word is unique", () => {
    const r = analyzeVocabulary("apple banana cherry");
    expect(r.diversityScore).toBe(100);
  });

  it("diversityScore is a 0-100 percentage", () => {
    const r = analyzeVocabulary("apple apple banana");
    expect(r.diversityScore).toBeGreaterThanOrEqual(0);
    expect(r.diversityScore).toBeLessThanOrEqual(100);
  });

  it("is case-insensitive (The/THE/the all treated as the stop word)", () => {
    const r = analyzeVocabulary("The THE the cat");
    expect(r.totalWords).toBe(1);
    expect(r.uniqueWords).toBe(1);
  });

  it("flags words used >= 3 times as overused", () => {
    const r = analyzeVocabulary("good good good bad bad bad");
    const overused = r.overusedWords.map((o) => o.word);
    expect(overused).toContain("good");
    expect(overused).toContain("bad");
  });

  it("provides alternatives for known overused words", () => {
    const r = analyzeVocabulary("good good good");
    const good = r.overusedWords.find((o) => o.word === "good");
    expect(good).toBeDefined();
    expect(good!.alternatives.length).toBeGreaterThan(0);
  });

  it("returns empty alternatives for unknown overused words", () => {
    const r = analyzeVocabulary("xyzzy xyzzy xyzzy");
    const x = r.overusedWords.find((o) => o.word === "xyzzy");
    expect(x).toBeDefined();
    expect(x!.alternatives).toEqual([]);
  });

  it("limits overused words to at most 5", () => {
    const story = Array.from({ length: 6 }, (_, i) =>
      `word${i} `.repeat(3)
    ).join(" ");
    expect(analyzeVocabulary(story).overusedWords.length).toBeLessThanOrEqual(5);
  });

  it("growthHistory includes a Current entry with the current unique-word count", () => {
    const r = analyzeVocabulary("apple banana cherry");
    const current = r.growthHistory.find((g) => g.story === "Current");
    expect(current).toBeDefined();
    expect(current!.uniqueWords).toBe(3);
  });

  it("is deterministic for the same input", () => {
    const story = "good good bad bad cat dog bird";
    expect(analyzeVocabulary(story)).toEqual(analyzeVocabulary(story));
  });
});

describe("refreshVocabularyAnalysis", () => {
  it("delegates to analyzeVocabulary", () => {
    const story = "apple banana cherry";
    expect(refreshVocabularyAnalysis(story)).toEqual(analyzeVocabulary(story));
  });

  it("returns zeroed stats for empty input", () => {
    expect(refreshVocabularyAnalysis("")).toEqual(analyzeVocabulary(""));
  });
});
