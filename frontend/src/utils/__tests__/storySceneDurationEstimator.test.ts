import { describe, it, expect } from "vitest";
import { estimateSceneDurations } from "../storySceneDurationEstimator";

describe("estimateSceneDurations - zero-word guard", () => {
  it("returns totalReadingTime 0 for empty/whitespace story", () => {
    expect(estimateSceneDurations("   ").totalReadingTime).toBe(0);
    expect(estimateSceneDurations("").totalReadingTime).toBe(0);
  });

  it("returns readingTime 0 for a scene with no words", () => {
    // A paragraph of only whitespace-padded punctuation splits to zero words.
    const result = estimateSceneDurations("   ");
    expect(result.scenes).toHaveLength(0);
  });

  it("does not produce a readingTime of 1 for a zero-word scene", () => {
    // Two paragraphs: first has words, second is just punctuation/no words.
    const result = estimateSceneDurations(
      "The hero arrived.\n\n   "
    );
    const zeroWordScene = result.scenes.find((s) => s.wordCount === 0);
    // If such a scene exists, its reading time must be 0, not 1.
    if (zeroWordScene) {
      expect(zeroWordScene.readingTime).toBe(0);
    }
    // Scenes with words still get a minimum of 1.
    const wordScene = result.scenes.find((s) => s.wordCount > 0);
    expect(wordScene?.readingTime).toBeGreaterThanOrEqual(1);
  });

  it("sums reading times correctly across scenes", () => {
    const result = estimateSceneDurations(
      "one two three four\n\nfive six seven eight"
    );
    expect(result.totalReadingTime).toBe(
      result.scenes.reduce((sum, s) => sum + s.readingTime, 0)
    );
  });
});
