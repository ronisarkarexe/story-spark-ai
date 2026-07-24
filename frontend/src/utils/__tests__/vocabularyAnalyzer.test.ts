import { describe, it, expect } from "vitest";
import {
  analyzeVocabulary,
  refreshVocabularyAnalysis,
  getReadabilityLevel,
} from "../vocabularyAnalyzer";

describe("analyzeVocabulary", () => {
  it("returns all-zero scores for empty input", () => {
    const result = analyzeVocabulary("");
    expect(result.readabilityScore).toBe(0);
    expect(result.diversityScore).toBe(0);
    expect(result.repeatedWords).toEqual([]);
    expect(result.suggestions).toEqual([]);
  });

  it("does not return the old hardcoded stub values", () => {
    const result = analyzeVocabulary(
      "The quick brown fox jumps over the lazy dog."
    );
    expect(
      result.readabilityScore === 82 && result.diversityScore === 74
    ).toBe(false);
  });

  it("produces a higher readability score for simple short sentences than for long, complex ones", () => {
    const simple = "The cat sat. The dog ran. I am happy.";
    const complex =
      "The extraordinarily sophisticated and multifaceted philosophical " +
      "ramifications of the aforementioned circumstantial deliberations " +
      "necessitated an exceptionally comprehensive and meticulous investigation.";

    const simpleResult = analyzeVocabulary(simple);
    const complexResult = analyzeVocabulary(complex);

    expect(simpleResult.readabilityScore).toBeGreaterThan(
      complexResult.readabilityScore
    );
  });

  it("keeps scores within the 0-100 range for a long story", () => {
    const longStory = Array(200)
      .fill(
        "Every morning the old lighthouse keeper walked slowly down to the rocky shore."
      )
      .join(" ");

    const result = analyzeVocabulary(longStory);

    expect(result.readabilityScore).toBeGreaterThanOrEqual(0);
    expect(result.readabilityScore).toBeLessThanOrEqual(100);
    expect(result.diversityScore).toBeGreaterThanOrEqual(0);
    expect(result.diversityScore).toBeLessThanOrEqual(100);
  });

  it("gives a higher diversity score to varied text than to highly repetitive text", () => {
    const repetitive = "run run run run run run run run run run.";
    const varied =
      "The wandering traveler discovered ancient ruins beneath a crimson sky.";

    const repetitiveResult = analyzeVocabulary(repetitive);
    const variedResult = analyzeVocabulary(varied);

    expect(variedResult.diversityScore).toBeGreaterThan(
      repetitiveResult.diversityScore
    );
  });

  it("identifies actual overused non-stopwords in repeatedWords", () => {
    const text =
      "The shadow crept forward. The shadow grew larger. " +
      "Nobody noticed the shadow until it was too late, and the shadow consumed everything.";

    const result = analyzeVocabulary(text);

    expect(result.repeatedWords).toContain("shadow");
  });

  it("excludes common stopwords from repeatedWords even when frequent", () => {
    const text = "the the the the the the the cat sat on the the the mat";
    const result = analyzeVocabulary(text);

    expect(result.repeatedWords).not.toContain("the");
  });

  it("returns no repeated words for text with no meaningful repetition", () => {
    const text = "Rain fell softly over the quiet, sleeping village tonight.";
    const result = analyzeVocabulary(text);

    expect(result.repeatedWords).toEqual([]);
  });

  it("builds a synonym suggestion for a known overused word", () => {
    const text =
      "She said it was fine. He said nothing back. They said it again and again, said and said.";

    const result = analyzeVocabulary(text);

    expect(result.repeatedWords).toContain("said");
    const suggestion = result.suggestions.find((s) => s.word === "said");
    expect(suggestion).toBeDefined();
    expect(suggestion?.replacement.length).toBeGreaterThan(0);
  });

  it("skips suggestions for overused words with no known synonym entry", () => {
    const text = Array(5).fill("zzzxqplorp").join(" ") + " is a made up word.";
    const result = analyzeVocabulary(text);

    expect(result.repeatedWords).toContain("zzzxqplorp");
    expect(
      result.suggestions.some((s) => s.word === "zzzxqplorp")
    ).toBe(false);
  });
});

describe("refreshVocabularyAnalysis", () => {
  it("delegates to the same real analysis logic as analyzeVocabulary", () => {
    const text = "The brave knight rode swiftly through the misty forest.";
    expect(refreshVocabularyAnalysis(text)).toEqual(analyzeVocabulary(text));
  });
});

describe("getReadabilityLevel", () => {
  it("buckets scores correctly against the real score ranges", () => {
    expect(getReadabilityLevel(95)).toBe("Excellent");
    expect(getReadabilityLevel(90)).toBe("Excellent");
    expect(getReadabilityLevel(80)).toBe("Good");
    expect(getReadabilityLevel(75)).toBe("Good");
    expect(getReadabilityLevel(65)).toBe("Average");
    expect(getReadabilityLevel(60)).toBe("Average");
    expect(getReadabilityLevel(40)).toBe("Needs Improvement");
    expect(getReadabilityLevel(0)).toBe("Needs Improvement");
  });
});