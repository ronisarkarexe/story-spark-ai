import { describe, it, expect } from "vitest";
import {
  estimateSceneDurations,
  refreshSceneDurations,
} from "../storySceneDurationEstimator";

describe("estimateSceneDurations", () => {
  it("returns empty scenes and 0 total for empty/whitespace input", () => {
    const expected = { scenes: [], totalReadingTime: 0 };
    expect(estimateSceneDurations("")).toEqual(expected);
    expect(estimateSceneDurations("   \n  ")).toEqual(expected);
  });

  it("splits the story into scenes by blank lines", () => {
    const story = "Scene one text here.\n\nScene two text here.";
    const r = estimateSceneDurations(story);
    expect(r.scenes.length).toBe(2);
    expect(r.scenes[0].id).toBe(1);
    expect(r.scenes[1].id).toBe(2);
    expect(r.scenes[0].title).toBe("Scene 1");
    expect(r.scenes[1].title).toBe("Scene 2");
  });

  it("computes wordCount per scene", () => {
    const r = estimateSceneDurations("one two three\n\nfour five");
    expect(r.scenes[0].wordCount).toBe(3);
    expect(r.scenes[1].wordCount).toBe(2);
  });

  it("readingTime is at least 1 minute per non-empty scene", () => {
    const r = estimateSceneDurations("tiny\n\nanother");
    for (const s of r.scenes) {
      expect(s.readingTime).toBeGreaterThanOrEqual(1);
    }
  });

  it("readingTime scales with word count (200 wpm)", () => {
    const big = "w ".repeat(250).trim();
    const r = estimateSceneDurations(big);
    expect(r.scenes[0].readingTime).toBe(2);
  });

  it("totalReadingTime is the sum of scene reading times", () => {
    const r = estimateSceneDurations("a b c\n\nd e f g h");
    const sum = r.scenes.reduce((acc, s) => acc + s.readingTime, 0);
    expect(r.totalReadingTime).toBe(sum);
  });

  it("ignores blank/whitespace-only scenes", () => {
    const r = estimateSceneDurations("real scene\n\n   \n\nanother real scene");
    expect(r.scenes.length).toBe(2);
  });

  it("each scene has id, title, wordCount, readingTime", () => {
    const r = estimateSceneDurations("a story");
    for (const s of r.scenes) {
      expect(typeof s.id).toBe("number");
      expect(typeof s.title).toBe("string");
      expect(typeof s.wordCount).toBe("number");
      expect(typeof s.readingTime).toBe("number");
    }
  });
});

describe("refreshSceneDurations", () => {
  it("delegates to estimateSceneDurations", () => {
    const story = "A story to refresh.";
    expect(refreshSceneDurations(story)).toEqual(estimateSceneDurations(story));
  });

  it("returns the empty result for empty input", () => {
    expect(refreshSceneDurations("")).toEqual({ scenes: [], totalReadingTime: 0 });
  });
});
