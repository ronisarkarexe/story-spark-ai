// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { detectCliches } from "./clicheDetector";

describe("clicheDetector", () => {
  describe("detectCliches", () => {
    it("returns an empty array when text contains no known cliches", () => {
      const result = detectCliches("The quick brown fox jumped over the lazy dog.");
      expect(result).toEqual([]);
    });

    it("detects 'once upon a time' cliche", () => {
      const result = detectCliches("Once upon a time in a distant land...");
      expect(result).toHaveLength(1);
      expect(result[0].phrase).toBe("once upon a time");
      expect(result[0].reason).toBe("Very common story opening.");
      expect(result[0].suggestion).toBe("Open with an action or unique scene.");
    });

    it("detects 'happily ever after' cliche", () => {
      const result = detectCliches("They lived happily ever after.");
      expect(result).toHaveLength(1);
      expect(result[0].phrase).toBe("happily ever after");
      expect(result[0].reason).toBe("Frequently used ending.");
      expect(result[0].suggestion).toBe("Create a more memorable conclusion.");
    });

    it("detects 'chosen one' cliche", () => {
      const result = detectCliches("He was the chosen one destined to save the world.");
      expect(result).toHaveLength(1);
      expect(result[0].phrase).toBe("chosen one");
      expect(result[0].reason).toBe("Overused fantasy trope.");
    });

    it("detects 'it was all a dream' cliche", () => {
      const result = detectCliches("In the end, it was all a dream.");
      expect(result).toHaveLength(1);
      expect(result[0].phrase).toBe("it was all a dream");
      expect(result[0].reason).toBe("Predictable plot twist.");
    });

    it("detects multiple cliches in the same text", () => {
      const result = detectCliches(
        "Once upon a time there was a chosen one who lived happily ever after."
      );
      expect(result).toHaveLength(3);
      const phrases = result.map((r) => r.phrase);
      expect(phrases).toContain("once upon a time");
      expect(phrases).toContain("chosen one");
      expect(phrases).toContain("happily ever after");
    });

    it("returns empty array for empty string", () => {
      const result = detectCliches("");
      expect(result).toEqual([]);
    });

    it("is case-insensitive when detecting cliches", () => {
      const result = detectCliches("ONCE UPON A TIME there lived a hero.");
      expect(result).toHaveLength(1);
      expect(result[0].phrase).toBe("once upon a time");
    });
  });
});
