import { describe, it, expect } from "vitest";
import { analyzeVocabulary, refreshVocabularyAnalysis } from "../storyVocabularyGrowthTracker";

describe("analyzeVocabulary", () => {
  it("returns zeroed stats for empty text", () => {
    const result = analyzeVocabulary("");
    expect(result.totalWords).toBe(0);
    expect(result.uniqueWords).toBe(0);
    expect(result.diversityScore).toBe(0);
    expect(result.overusedWords).toEqual([]);
  });

  it("counts total and unique words", () => {
    const result = analyzeVocabulary("the hero fought the dragon");
    expect(result.totalWords).toBe(3);
    expect(result.uniqueWords).toBe(3);
  });

  it("excludes stop words from the counts", () => {
    const result = analyzeVocabulary("the a an and or to of in is was hero");
    expect(result.totalWords).toBe(1);
    expect(result.uniqueWords).toBe(1);
  });

  it("detects overused words with frequency at or above 3", () => {
    const result = analyzeVocabulary("sword sword sword shield shield");
    const sword = result.overusedWords.find((o) => o.word === "sword");
    expect(sword).toBeDefined();
    expect(sword?.count).toBe(3);
  });

  it("sorts overused words by descending count", () => {
    const result = analyzeVocabulary("good good good good big big big bad bad");
    const counts = result.overusedWords.map((o) => o.count);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it("caps overused words at five entries", () => {
    const result = analyzeVocabulary("one one one two two two three three three four four four five five five six six six");
    expect(result.overusedWords.length).toBeLessThanOrEqual(5);
  });

  it("includes alternatives for known overused words", () => {
    const result = analyzeVocabulary("good good good");
    const good = result.overusedWords.find((o) => o.word === "good");
    expect(good?.alternatives.length).toBeGreaterThan(0);
  });

  it("refreshVocabularyAnalysis returns the same result", () => {
    const story = "the hero bravely faced the dragon";
    expect(refreshVocabularyAnalysis(story)).toEqual(analyzeVocabulary(story));
  });
});
