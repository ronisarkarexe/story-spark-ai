import { getWordCount, calculateReadingTime, formatReadingStats } from "../story-utils";

describe("story-utils", () => {
  describe("getWordCount", () => {
    it("should return 0 for undefined", () => {
      expect(getWordCount(undefined)).toBe(0);
    });

    it("should return 0 for empty string", () => {
      expect(getWordCount("")).toBe(0);
    });

    it("should return 0 for whitespace string", () => {
      expect(getWordCount("   ")).toBe(0);
    });

    it("should return correct count for simple sentence", () => {
      expect(getWordCount("This is a test.")).toBe(4);
    });

    it("should handle multiple spaces between words", () => {
      expect(getWordCount("This  is   a test.")).toBe(4);
    });

    it("should count words with punctuation and contractions", () => {
      expect(getWordCount("Don't stop, it's working.")).toBe(4);
    });

    it("should ignore trailing line breaks and mixed whitespace", () => {
      expect(getWordCount("Hello\nworld\t\tfrom\r\nfrontend   ")).toBe(4);
    });

    it("should return 0 for whitespace-only unicode separators", () => {
      expect(getWordCount("\u00a0\u00a0\t\n")).toBe(0);
    });
  });

  describe("calculateReadingTime", () => {
    it("should return 1 for short content", () => {
      expect(calculateReadingTime("Short content.")).toBe(1);
    });

    it("should return 1 for exactly 200 words", () => {
      const content = new Array(200).fill("word").join(" ");
      expect(calculateReadingTime(content)).toBe(1);
    });

    it("should return 2 for 201 words", () => {
      const content = new Array(201).fill("word").join(" ");
      expect(calculateReadingTime(content)).toBe(2);
    });

    it("should return 1 for undefined or empty content", () => {
      expect(calculateReadingTime(undefined)).toBe(1);
      expect(calculateReadingTime("")).toBe(1);
    });
  });

  describe("formatReadingStats", () => {
    it("should format stats correctly", () => {
      const content = "This is a five word story.";
      expect(formatReadingStats(content)).toBe("1 min read - 6 words"); // "This", "is", "a", "five", "word", "story."
    });
  });
});
