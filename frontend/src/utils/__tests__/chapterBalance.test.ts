import { describe, test, expect } from "vitest";
import { analyzeChapterBalance } from "../chapterBalance";

describe("analyzeChapterBalance", () => {
  test("parses a single chapter and returns one entry", () => {
    const story = "Chapter 1\nThis is the story content that is long enough.";
    const result = analyzeChapterBalance(story);
    expect(result).toHaveLength(1);
    expect(result[0].chapter).toBe(1);
  });

  test("parses multiple chapters in order", () => {
    const story =
      "Chapter 1\nContent one here.\n\nChapter 2\nContent two here.\n\nChapter 3\nContent three here.";
    const result = analyzeChapterBalance(story);
    expect(result).toHaveLength(3);
    expect(result[0].chapter).toBe(1);
    expect(result[1].chapter).toBe(2);
    expect(result[2].chapter).toBe(3);
  });

  test("returns empty array for empty story string", () => {
    const result = analyzeChapterBalance("");
    expect(result).toHaveLength(0);
  });

  test("treats story without chapter markers as one chapter", () => {
    const story = "This is a long story without any chapter markers.";
    const result = analyzeChapterBalance(story);
    expect(result).toHaveLength(1);
    expect(result[0].chapter).toBe(1);
  });

  test("returns Balanced status for chapter with 400-1200 words", () => {
    // ~500 words of filler text
    const filler = Array(500).fill("word").join(" ");
    const story = `Chapter 1\n${filler}`;
    const result = analyzeChapterBalance(story);
    expect(result[0].status).toBe("Balanced");
  });

  test("returns Needs Review status for chapter with fewer than 400 words", () => {
    // ~200 words of filler text
    const filler = Array(200).fill("word").join(" ");
    const story = `Chapter 1\n${filler}`;
    const result = analyzeChapterBalance(story);
    expect(result[0].status).toBe("Needs Review");
  });

  test("returns Needs Review status for chapter with more than 1200 words", () => {
    // ~1500 words of filler text
    const filler = Array(1500).fill("word").join(" ");
    const story = `Chapter 1\n${filler}`;
    const result = analyzeChapterBalance(story);
    expect(result[0].status).toBe("Needs Review");
  });

  test("score is capped at 100", () => {
    // ~5000 words - score would be 625 without cap
    const filler = Array(5000).fill("word").join(" ");
    const story = `Chapter 1\n${filler}`;
    const result = analyzeChapterBalance(story);
    expect(result[0].score).toBe(100);
  });

  test("score is a rounded integer", () => {
    // 800 words = exactly 100 score
    const filler = Array(800).fill("word").join(" ");
    const story = `Chapter 1\n${filler}`;
    const result = analyzeChapterBalance(story);
    expect(result[0].score).toBe(100);
  });

  test("chapter detection is case-insensitive", () => {
    const story = "CHAPTER 1\nContent.\nchapter 2\nContent.";
    const result = analyzeChapterBalance(story);
    expect(result).toHaveLength(2);
  });

  test("words count excludes chapter header line", () => {
    const story = "Chapter 1\none two three four five six seven eight nine ten";
    const result = analyzeChapterBalance(story);
    // chapter header excluded, so only 10 words in content
    expect(result[0].words).toBe(10);
    expect(result[0].status).toBe("Needs Review");
  });

  test("returns empty array for story with only chapter headers and no content", () => {
    const story = "Chapter 1\nChapter 2\nChapter 3";
    const result = analyzeChapterBalance(story);
    // split by chapter header leaves only newlines between headers;
    // trim() removes them, resulting in empty strings filtered out
    expect(result).toHaveLength(0);
  });
});
