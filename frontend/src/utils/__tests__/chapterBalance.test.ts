import { describe, it, expect } from "vitest";
import { analyzeChapterBalance } from "../chapterBalance";

describe("analyzeChapterBalance", () => {
  it("returns [] for an empty story", () => {
    expect(analyzeChapterBalance("")).toEqual([]);
  });

  it("returns [] for a whitespace-only story", () => {
    expect(analyzeChapterBalance("   \n  ")).toEqual([]);
  });

  it("splits by 'chapter N' markers into sequential chapters", () => {
    const story = "chapter 1 " + "word ".repeat(500) + " chapter 2 " + "word ".repeat(500);
    const r = analyzeChapterBalance(story);
    expect(r.map((c) => c.chapter)).toEqual([1, 2]);
  });

  it("counts words per chapter", () => {
    const story = "chapter 1 " + "word ".repeat(500).trim();
    const r = analyzeChapterBalance(story);
    expect(r[0].words).toBeGreaterThan(0);
  });

  it("marks a 400-1200 word chapter as Balanced", () => {
    const story = "chapter 1 " + "word ".repeat(500);
    const r = analyzeChapterBalance(story);
    expect(r[0].status).toBe("Balanced");
  });

  it("marks a short (< 400 words) chapter as Needs Review", () => {
    const story = "chapter 1 a b c";
    const r = analyzeChapterBalance(story);
    expect(r[0].status).toBe("Needs Review");
  });

  it("marks a long (> 1200 words) chapter as Needs Review", () => {
    const story = "chapter 1 " + "word ".repeat(1300);
    const r = analyzeChapterBalance(story);
    expect(r[0].status).toBe("Needs Review");
  });

  it("score is capped at 100", () => {
    const story = "chapter 1 " + "word ".repeat(2000);
    const r = analyzeChapterBalance(story);
    expect(r[0].score).toBeLessThanOrEqual(100);
  });

  it("score is a non-negative integer", () => {
    const story = "chapter 1 a b c";
    const r = analyzeChapterBalance(story);
    expect(Number.isInteger(r[0].score)).toBe(true);
    expect(r[0].score).toBeGreaterThanOrEqual(0);
  });

  it("each result has the required fields with a valid status", () => {
    const story = "chapter 1 " + "word ".repeat(500) + " chapter 2 a b c";
    const r = analyzeChapterBalance(story);
    for (const c of r) {
      expect(typeof c.chapter).toBe("number");
      expect(typeof c.words).toBe("number");
      expect(typeof c.score).toBe("number");
      expect(["Balanced", "Needs Review"]).toContain(c.status);
    }
  });

  it("chapter ids are unique and sequential", () => {
    const story = "chapter 1 " + "word ".repeat(500) + " chapter 2 " + "word ".repeat(500) + " chapter 3 " + "word ".repeat(500);
    const r = analyzeChapterBalance(story);
    expect(r.map((c) => c.chapter)).toEqual([1, 2, 3]);
  });

  it("is deterministic for the same input", () => {
    const story = "chapter 1 " + "word ".repeat(500);
    expect(analyzeChapterBalance(story)).toEqual(analyzeChapterBalance(story));
  });
});
