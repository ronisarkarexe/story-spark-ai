import { describe, it, expect } from "vitest";
import { getReadingTime } from "../readingTime";

describe("readingTime", () => {
  describe("getReadingTime", () => {
    it("should return wordCount of 1 for empty string (split behavior)", () => {
      const result = getReadingTime("");
      expect(result.wordCount).toBe(1);
      expect(result.minutes).toBe(1);
    });

    it("should return wordCount of 1 for whitespace-only string", () => {
      const result = getReadingTime("   \t\n   ");
      expect(result.wordCount).toBe(1);
      expect(result.minutes).toBe(1);
    });

    it("should count a single word correctly", () => {
      const result = getReadingTime("hello");
      expect(result.wordCount).toBe(1);
      expect(result.minutes).toBe(1);
    });

    it("should count multiple words correctly", () => {
      const result = getReadingTime("The quick brown fox jumps over the lazy dog");
      expect(result.wordCount).toBe(9);
    });

    it("should count words with punctuation and contractions", () => {
      const result = getReadingTime("Don't stop, it's working.");
      expect(result.wordCount).toBe(4);
    });

    it("should handle multiple spaces between words", () => {
      const result = getReadingTime("hello    world");
      expect(result.wordCount).toBe(2);
    });

    it("should handle tabs and newlines as word separators", () => {
      const result = getReadingTime("hello\tworld\nfoo\tbar");
      expect(result.wordCount).toBe(4);
    });

    it("should calculate reading time as 1 minute for short text", () => {
      const result = getReadingTime("A short story.");
      expect(result.minutes).toBe(1);
    });

    it("should return an object with minutes and wordCount properties", () => {
      const result = getReadingTime("Hello world");
      expect(result).toHaveProperty("minutes");
      expect(result).toHaveProperty("wordCount");
      expect(typeof result.minutes).toBe("number");
      expect(typeof result.wordCount).toBe("number");
    });

    it("should always return at least 1 minute", () => {
      const result = getReadingTime("");
      expect(result.minutes).toBe(1);
    });
  });
});
