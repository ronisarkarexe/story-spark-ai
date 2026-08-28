import { describe, it, expect } from "vitest";
import { analyzeChapterBalance, type ChapterAnalysis } from "../chapterBalance";

describe("analyzeChapterBalance", () => {
  it("parses a story with multiple numbered chapters", () => {
    const story =
      "Chapter 1\nOnce upon a time in a land far away\n\nChapter 2\nThere lived a brave hero named Arthur\n\nChapter 3\nAnd they lived happily ever after";
    const result = analyzeChapterBalance(story);

    expect(result).toHaveLength(3);
    expect(result[0].chapter).toBe(1);
    expect(result[1].chapter).toBe(2);
    expect(result[2].chapter).toBe(3);
  });

  it("parses chapter markers case-insensitively", () => {
    const story =
      "CHAPTER 1\nFirst chapter content here\nchapter 2\nSecond chapter content here";
    const result = analyzeChapterBalance(story);

    expect(result).toHaveLength(2);
  });

  it("calculates word count correctly", () => {
    const story = "Chapter 1\none two three four five";
    const result = analyzeChapterBalance(story);

    expect(result[0].words).toBe(5);
  });

  it("calculates score as words divided by 800 times 100, capped at 100", () => {
    const story = "Chapter 1\n" + "word ".repeat(800);
    const result = analyzeChapterBalance(story);

    expect(result[0].score).toBe(100);
  });

  it("marks chapter as Balanced when words between 400 and 1200", () => {
    const story = "Chapter 1\n" + "word ".repeat(600);
    const result = analyzeChapterBalance(story);

    expect(result[0].status).toBe("Balanced");
  });

  it("marks chapter as Needs Review when words below 400", () => {
    const story = "Chapter 1\nword word word";
    const result = analyzeChapterBalance(story);

    expect(result[0].status).toBe("Needs Review");
  });

  it("marks chapter as Needs Review when words above 1200", () => {
    const story = "Chapter 1\n" + "word ".repeat(1500);
    const result = analyzeChapterBalance(story);

    expect(result[0].status).toBe("Needs Review");
  });

  it("handles chapter with exactly 400 words (boundary - Balanced)", () => {
    const story = "Chapter 1\n" + "word ".repeat(400);
    const result = analyzeChapterBalance(story);

    expect(result[0].status).toBe("Balanced");
  });

  it("handles chapter with exactly 1200 words (boundary - Balanced)", () => {
    const story = "Chapter 1\n" + "word ".repeat(1200);
    const result = analyzeChapterBalance(story);

    expect(result[0].status).toBe("Balanced");
  });

  it("handles chapter with 399 words (boundary - Needs Review)", () => {
    const story = "Chapter 1\n" + "word ".repeat(399);
    const result = analyzeChapterBalance(story);

    expect(result[0].status).toBe("Needs Review");
  });

  it("handles chapter with 1201 words (boundary - Needs Review)", () => {
    const story = "Chapter 1\n" + "word ".repeat(1201);
    const result = analyzeChapterBalance(story);

    expect(result[0].status).toBe("Needs Review");
  });

  it("handles chapter with very little content", () => {
    const story = "Chapter 1\n\n\n\nChapter 2\nHas content";
    const result = analyzeChapterBalance(story);

    // First chapter is the empty part between chapter headers, has minimal words
    expect(result[0].words).toBeLessThan(5);
    expect(result[0].status).toBe("Needs Review");
  });

  it("returns one entry for story with no chapter markers", () => {
    const story = "This is a story with no chapter markers at all";
    const result = analyzeChapterBalance(story);

    expect(result).toHaveLength(1);
    expect(result[0].chapter).toBe(1);
  });

  it("returns empty array for empty story string", () => {
    const result = analyzeChapterBalance("");
    expect(result).toHaveLength(0);
  });

  it("skips empty parts after splitting on chapter markers", () => {
    const story =
      "Chapter 1\nContent here\n\n\n\nChapter 2\nMore content";
    const result = analyzeChapterBalance(story);

    expect(result).toHaveLength(2);
  });

  it("returns ChapterAnalysis type objects with all required fields", () => {
    const story = "Chapter 1\nSome content here";
    const result = analyzeChapterBalance(story);

    expect(result[0]).toHaveProperty("chapter");
    expect(result[0]).toHaveProperty("words");
    expect(result[0]).toHaveProperty("score");
    expect(result[0]).toHaveProperty("status");
  });
});
