import { describe, it, expect } from "vitest";
import { analyzeReadingInfo } from "../storyReadingInfo";

describe("analyzeReadingInfo", () => {
  it("returns zero word count for empty text", () => {
    const result = analyzeReadingInfo("");
    expect(result.wordCount).toBe(0);
    expect(result.difficulty).toBe("Beginner");
  });

  it("counts words in a normal story", () => {
    const result = analyzeReadingInfo("The quick brown fox jumps over the lazy dog.");
    expect(result.wordCount).toBe(9);
  });

  it("marks beginner difficulty for short stories", () => {
    const result = analyzeReadingInfo("A short story.");
    expect(result.difficulty).toBe("Beginner");
  });

  it("marks intermediate difficulty for stories over 1000 words", () => {
    const story = Array(1001).fill("word").join(" ");
    const result = analyzeReadingInfo(story);
    expect(result.difficulty).toBe("Intermediate");
  });

  it("marks advanced difficulty for stories over 3000 words", () => {
    const story = Array(3001).fill("word").join(" ");
    const result = analyzeReadingInfo(story);
    expect(result.difficulty).toBe("Advanced");
  });

  it("computes reading time as ceil(wordCount / 200)", () => {
    const story = Array(400).fill("word").join(" ");
    const result = analyzeReadingInfo(story);
    expect(result.readingTime).toBe(2);
  });
});
