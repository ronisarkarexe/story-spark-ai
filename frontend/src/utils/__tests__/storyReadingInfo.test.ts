import { describe, it, expect } from "vitest";
import { analyzeReadingInfo } from "../storyReadingInfo";

describe("analyzeReadingInfo - zero reading time for empty text", () => {
  it("returns readingTime 0 for an empty string", () => {
    const r = analyzeReadingInfo("");
    expect(r.wordCount).toBe(0);
    expect(r.readingTime).toBe(0);
    expect(r.difficulty).toBe("Beginner");
  });

  it("returns readingTime 0 for whitespace-only text", () => {
    const r = analyzeReadingInfo("   \n\t  ");
    expect(r.wordCount).toBe(0);
    expect(r.readingTime).toBe(0);
  });

  it("returns readingTime >= 1 for non-empty text", () => {
    const r = analyzeReadingInfo("one two three four");
    expect(r.wordCount).toBe(4);
    expect(r.readingTime).toBeGreaterThanOrEqual(1);
  });

  it("scales readingTime with word count", () => {
    const short = analyzeReadingInfo("a b c");
    const long = analyzeReadingInfo("w ".repeat(500).trim());
    expect(long.readingTime).toBeGreaterThan(short.readingTime);
  });

  it("classifies difficulty by word count", () => {
    expect(analyzeReadingInfo("a b c").difficulty).toBe("Beginner");
    const mid = analyzeReadingInfo("w ".repeat(1200).trim());
    expect(mid.difficulty).toBe("Intermediate");
    const big = analyzeReadingInfo("w ".repeat(3200).trim());
    expect(big.difficulty).toBe("Advanced");
  });
});
