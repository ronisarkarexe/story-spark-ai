import { describe, expect, it } from "vitest";
import {
  analyzeVocabulary,
  refreshVocabularyAnalysis,
  getReadabilityLevel,
} from "../vocabularyAnalyzer";

describe("analyzeVocabulary", () => {
  it("returns an all-zero analysis for an empty story", () => {
    const result = analyzeVocabulary("");
    expect(result.readabilityScore).toBe(0);
    expect(result.diversityScore).toBe(0);
    expect(result.repeatedWords).toEqual([]);
    expect(result.suggestions).toEqual([]);
  });

  it("gives a short, simple story a high readability score", () => {
    const story = "The cat sat. The dog ran. The sun was hot.";
    const result = analyzeVocabulary(story);
    expect(result.readabilityScore).toBeGreaterThan(70);
  });

  it("gives a long, complex story a lower readability score than a simple one", () => {
    const simple = "The cat sat. The dog ran. It was fun.";
    const complex =
      "The extraordinarily perspicacious feline contemplated the multifaceted implications of its precarious existential circumstances, deliberating extensively.";

    const simpleResult = analyzeVocabulary(simple);
    const complexResult = analyzeVocabulary(complex);

    expect(complexResult.readabilityScore).toBeLessThan(
      simpleResult.readabilityScore
    );
  });

  it("gives a 100% diversity score when every word is unique", () => {
    const story = "Bright colors filled every corner of the quiet room today.";
    const result = analyzeVocabulary(story);
    expect(result.diversityScore).toBe(100);
  });

  it("lowers the diversity score as words repeat", () => {
    const repetitive = "walk walk walk walk walk walk walk walk walk walk";
    const varied = "walk run jump swim climb dive skip hop dash sprint";

    const repetitiveResult = analyzeVocabulary(repetitive);
    const variedResult = analyzeVocabulary(varied);

    expect(repetitiveResult.diversityScore).toBeLessThan(
      variedResult.diversityScore
    );
  });

  it("flags a word repeated 3+ times as a repeated word", () => {
    const story =
      "The shadow moved slowly. Another shadow followed close behind. A third shadow joined them near the wall.";
    const result = analyzeVocabulary(story);
    expect(result.repeatedWords).toContain("shadow");
  });

  it("does not flag stopwords as repeated words", () => {
    const story = "The the the the and and and but but but for for for.";
    const result = analyzeVocabulary(story);
    expect(result.repeatedWords).toEqual([]);
  });

  it("produces a synonym suggestion for a known overused word", () => {
    const story = "She said hello. He said goodbye. They said nothing at all.";
    const result = analyzeVocabulary(story);
    const saidSuggestion = result.suggestions.find((s) => s.word === "said");

    expect(saidSuggestion).toBeDefined();
    expect(saidSuggestion?.replacement).toBeTruthy();
  });

  it("does not produce a suggestion for a repeated word with no synonym entry", () => {
    const story =
      "The kraken surged forward. The kraken twisted sharply. The kraken vanished below.";
    const result = analyzeVocabulary(story);

    expect(result.repeatedWords).toContain("kraken");
    expect(result.suggestions.find((s) => s.word === "kraken")).toBeUndefined();
  });

  it("refreshVocabularyAnalysis returns the same result as analyzeVocabulary", () => {
    const story = "The quiet forest whispered secrets under the pale moonlight.";
    expect(refreshVocabularyAnalysis(story)).toEqual(analyzeVocabulary(story));
  });
});

describe("getReadabilityLevel", () => {
  it("buckets scores into the correct label", () => {
    expect(getReadabilityLevel(95)).toBe("Excellent");
    expect(getReadabilityLevel(80)).toBe("Good");
    expect(getReadabilityLevel(65)).toBe("Average");
    expect(getReadabilityLevel(30)).toBe("Needs Improvement");
  });
});