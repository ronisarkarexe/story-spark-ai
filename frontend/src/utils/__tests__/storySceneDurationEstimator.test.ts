import { describe, it, expect } from "vitest";
import {
  estimateSceneDurations,
  refreshSceneDurations,
} from "../storySceneDurationEstimator";

describe("estimateSceneDurations", () => {
  it("returns empty scenes and zero total for empty text", () => {
    const result = estimateSceneDurations("");
    expect(result.scenes).toEqual([]);
    expect(result.totalReadingTime).toBe(0);
  });

  it("splits scenes by double newline", () => {
    const result = estimateSceneDurations("Scene one.\n\nScene two.");
    expect(result.scenes).toHaveLength(2);
  });

  it("counts words per scene", () => {
    const result = estimateSceneDurations("one two three");
    expect(result.scenes[0].wordCount).toBe(3);
  });

  it("computes reading time as ceil(words / 200)", () => {
    const result = estimateSceneDurations("word ".repeat(400));
    expect(result.scenes[0].readingTime).toBe(2);
  });

  it("sums the total reading time across scenes", () => {
    const result = estimateSceneDurations("word ".repeat(200) + "\n\n" + "word ".repeat(200));
    expect(result.totalReadingTime).toBe(2);
  });

  it("assigns sequential ids and titles", () => {
    const result = estimateSceneDurations("One.\n\nTwo.");
    expect(result.scenes[0].id).toBe(1);
    expect(result.scenes[0].title).toBe("Scene 1");
    expect(result.scenes[1].id).toBe(2);
    expect(result.scenes[1].title).toBe("Scene 2");
  });

  it("refreshSceneDurations returns the same result", () => {
    const story = "Scene one.\n\nScene two.";
    expect(refreshSceneDurations(story)).toEqual(estimateSceneDurations(story));
  });
});
