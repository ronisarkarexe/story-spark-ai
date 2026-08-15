import { describe, it, expect } from "vitest";
import {
  calculateStoryMetrics,
  compareStories,
} from "../storyComparisonMetrics";

describe("calculateStoryMetrics", () => {
  it("returns an object with all required fields", () => {
    const r = calculateStoryMetrics("one two three four");
    expect(r).toHaveProperty("wordCount");
    expect(r).toHaveProperty("readingTime");
    expect(r).toHaveProperty("vocabularyRichness");
    expect(r).toHaveProperty("dialoguePercentage");
    expect(r).toHaveProperty("pacing");
    expect(r).toHaveProperty("sentiment");
  });

  it("wordCount matches the number of words", () => {
    expect(calculateStoryMetrics("a b c d e").wordCount).toBe(5);
  });

  it("readingTime is at least 1 and scales with word count (200 wpm)", () => {
    expect(calculateStoryMetrics("short").readingTime).toBe(1);
    expect(calculateStoryMetrics("w ".repeat(250).trim()).readingTime).toBe(2);
  });

  it("vocabularyRichness is a percentage 0-100 and 100% for all-unique words", () => {
    const r = calculateStoryMetrics("apple banana cherry");
    expect(r.vocabularyRichness).toBe(100);
    expect(r.vocabularyRichness).toBeGreaterThanOrEqual(0);
    expect(r.vocabularyRichness).toBeLessThanOrEqual(100);
  });

  it("vocabularyRichness is case-insensitive", () => {
    const r = calculateStoryMetrics("Apple apple APPLE");
    expect(r.wordCount).toBe(3);
    expect(r.vocabularyRichness).toBe(33);
  });

  it("dialoguePercentage is 0 without quotes and caps at 100", () => {
    expect(calculateStoryMetrics("no dialogue here").dialoguePercentage).toBe(0);
    // 20 quote pairs * 5 = 100, capped at 100.
    const many = '"a" '.repeat(20).trim();
    expect(calculateStoryMetrics(many).dialoguePercentage).toBe(100);
  });

  it("pacing increases with word count", () => {
    expect(calculateStoryMetrics("tiny").pacing).toBe(60);
    expect(calculateStoryMetrics("w ".repeat(450).trim()).pacing).toBe(75);
    expect(calculateStoryMetrics("w ".repeat(900).trim()).pacing).toBe(90);
  });

  it("sentiment is one of the valid values", () => {
    const r = calculateStoryMetrics("a story");
    expect(["Positive", "Neutral", "Negative"]).toContain(r.sentiment);
  });

  it("is deterministic for the same input", () => {
    const story = "a deterministic story with some words.";
    expect(calculateStoryMetrics(story)).toEqual(calculateStoryMetrics(story));
  });
});

describe("compareStories", () => {
  it("returns first and second metrics for the two stories", () => {
    const r = compareStories("a b c", "x y z w");
    expect(r.first.wordCount).toBe(3);
    expect(r.second.wordCount).toBe(4);
    expect(r.first).toHaveProperty("readingTime");
    expect(r.second).toHaveProperty("readingTime");
  });

  it("first/second are independent of order", () => {
    const a = "story one";
    const b = "story two is longer";
    const ab = compareStories(a, b);
    const ba = compareStories(b, a);
    expect(ab.first.wordCount).toBe(ba.second.wordCount);
    expect(ab.second.wordCount).toBe(ba.first.wordCount);
  });
});
