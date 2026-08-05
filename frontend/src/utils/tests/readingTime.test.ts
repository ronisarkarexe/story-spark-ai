import { describe, it, expect } from "vitest";
import { getReadingTime } from "../readingTime";

describe("getReadingTime", () => {
  const generateWords = (count: number): string => {
    return new Array(count).fill("word").join(" ");
  };

  // 1. Empty string
  it("should return 0 wordCount and 1 minute for empty string", () => {
    const result = getReadingTime("");
    expect(result.wordCount).toBe(0);
    expect(result.minutes).toBe(1);
  });

  // 2. Whitespace-only string
  it("should return 0 wordCount and 1 minute for whitespace-only string", () => {
    const result = getReadingTime("   \n\t  ");
    expect(result.wordCount).toBe(0);
    expect(result.minutes).toBe(1);
  });

  // 3. Single word
  it("should return 1 wordCount and 1 minute for single word", () => {
    const result = getReadingTime("hello");
    expect(result.wordCount).toBe(1);
    expect(result.minutes).toBe(1);
  });

  // 4. Standard 200-word paragraph
  it("should return 200 wordCount and 1 minute for 200 words", () => {
    const content = generateWords(200);
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(200);
    expect(result.minutes).toBe(1);
  });

  // 5. Standard 400-word paragraph
  it("should return 400 wordCount and 2 minutes for 400 words", () => {
    const content = generateWords(400);
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(400);
    expect(result.minutes).toBe(2);
  });

  // 6. Multiple consecutive spaces between words
  it("should ignore multiple consecutive spaces when counting words", () => {
    const content = "hello     world   from   vitest";
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(4);
    expect(result.minutes).toBe(1);
  });

  // 7. Mixed whitespace (spaces, tabs, newlines)
  it("should handle mixed whitespaces (tabs, newlines) correctly", () => {
    const content = "hello\n\tworld\t  from\n\nvitest";
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(4);
    expect(result.minutes).toBe(1);
  });

  // 8. 199-word content
  it("should return 199 wordCount and 1 minute for 199 words", () => {
    const content = generateWords(199);
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(199);
    expect(result.minutes).toBe(1);
  });

  // 9. 201-word content
  it("should return 201 wordCount and 1 minute for 201 words (rounding down)", () => {
    const content = generateWords(201);
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(201);
    expect(result.minutes).toBe(1);
  });

  it("should return 300 wordCount and 2 minutes for 300 words (rounding up threshold)", () => {
    const content = generateWords(300);
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(300);
    expect(result.minutes).toBe(2);
  });

  // 10. Very large content sample
  it("should calculate correctly for very large content samples", () => {
    const content = generateWords(10000);
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(10000);
    expect(result.minutes).toBe(50); // 10000 / 200 = 50
  });
});
