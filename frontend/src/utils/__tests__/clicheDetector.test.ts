import { describe, it, expect } from "vitest";
import { detectCliches } from "../clicheDetector";

describe("detectCliches", () => {
  it("returns an empty array for text with no cliches", () => {
    const result = detectCliches(
      "The hero set out on a grand adventure through the ancient forest."
    );
    expect(result).toEqual([]);
  });

  it("detects the once upon a time cliche", () => {
    const result = detectCliches("Once upon a time there lived a king.");
    expect(result).toHaveLength(1);
    expect(result[0].phrase).toBe("once upon a time");
    expect(result[0].reason).toBeTruthy();
    expect(result[0].suggestion).toBeTruthy();
  });

  it("detects the happily ever after cliche", () => {
    const result = detectCliches("The couple lived happily ever after.");
    expect(result).toHaveLength(1);
    expect(result[0].phrase).toBe("happily ever after");
  });

  it("detects the chosen one cliche", () => {
    const result = detectCliches("He was the chosen one, destined to save the world.");
    expect(result).toHaveLength(1);
    expect(result[0].phrase).toBe("chosen one");
  });

  it("detects the it was all a dream cliche", () => {
    const result = detectCliches("In the end, it was all a dream.");
    expect(result).toHaveLength(1);
    expect(result[0].phrase).toBe("it was all a dream");
  });

  it("detects multiple cliches in the same text", () => {
    const result = detectCliches(
      "Once upon a time, he was the chosen one, and it was all a dream."
    );
    expect(result).toHaveLength(3);
    const phrases = result.map((r) => r.phrase);
    expect(phrases).toContain("once upon a time");
    expect(phrases).toContain("chosen one");
    expect(phrases).toContain("it was all a dream");
  });

  it("is case insensitive", () => {
    const result = detectCliches("ONCE UPON A TIME there was a story.");
    expect(result).toHaveLength(1);
    expect(result[0].phrase).toBe("once upon a time");
  });

  it("returns non-empty suggestion and reason for each result", () => {
    const result = detectCliches(
      "Once upon a time, happily ever after."
    );
    expect(result).toHaveLength(2);
    for (const cliche of result) {
      expect(typeof cliche.reason).toBe("string");
      expect(cliche.reason.length).toBeGreaterThan(0);
      expect(typeof cliche.suggestion).toBe("string");
      expect(cliche.suggestion.length).toBeGreaterThan(0);
    }
  });
});
