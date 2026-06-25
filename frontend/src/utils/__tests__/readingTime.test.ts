import { describe, it, expect } from "vitest";
import { getReadingTime } from "../readingTime";

describe("readingTime utility", () => {
  it("returns wordCount of 0 and minutes of 1 for empty string", () => {
    const result = getReadingTime("");
    expect(result.wordCount).toBe(0);
    expect(result.minutes).toBe(1);
  });

  it("returns wordCount of 0 and minutes of 1 for whitespace-only string", () => {
    const result = getReadingTime("   \t\n   ");
    expect(result.wordCount).toBe(0);
    expect(result.minutes).toBe(1);
  });

  it("counts a single word correctly", () => {
    const result = getReadingTime("Hello");
    expect(result.wordCount).toBe(1);
    expect(result.minutes).toBe(1);
  });

  it("counts multiple words correctly", () => {
    const result = getReadingTime("The quick brown fox jumps over the lazy dog");
    expect(result.wordCount).toBe(9);
    expect(result.minutes).toBe(1);
  });

  it("handles multiple spaces between words", () => {
    const result = getReadingTime("Hello    world");
    expect(result.wordCount).toBe(2);
    expect(result.minutes).toBe(1);
  });

  it("calculates reading time for long text", () => {
    const words = Array(400).fill("word").join(" ");
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(400);
    expect(result.minutes).toBe(2);
  });
});
