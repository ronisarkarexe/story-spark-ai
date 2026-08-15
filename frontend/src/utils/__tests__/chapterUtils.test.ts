import { describe, it, expect } from "vitest";
import { splitIntoChapters, renumberChapters } from "../chapterUtils";

describe("splitIntoChapters", () => {
  it("returns an empty array for an empty string", () => {
    expect(splitIntoChapters("")).toEqual([]);
  });

  it("returns an empty array for whitespace-only content", () => {
    expect(splitIntoChapters("   \n  \n  ")).toEqual([]);
  });

  it("returns a single chapter when no chapter markers are present", () => {
    const story = "Once upon a time in a distant land.";
    const result = splitIntoChapters(story);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].title).toBe(story);
    expect(result[0].content).toBe("");
  });

  it("splits a story with multiple Chapter markers", () => {
    const story = "Chapter 1\nOnce upon a time.\n\nChapter 2\nThere was a hero.";
    const result = splitIntoChapters(story);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[0].title).toBe("Chapter 1");
    expect(result[0].content).toBe("Once upon a time.");
    expect(result[1].id).toBe(2);
    expect(result[1].title).toBe("Chapter 2");
    expect(result[1].content).toBe("There was a hero.");
  });

  it("handles case-insensitive chapter markers", () => {
    const story = "CHAPTER 1\nIntro text\nchapter 2\nMore text";
    const result = splitIntoChapters(story);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("CHAPTER 1");
    expect(result[1].title).toBe("chapter 2");
  });

  it("handles multi-digit chapter numbers", () => {
    const story = "Chapter 1\nFirst\nChapter 10\nTenth";
    const result = splitIntoChapters(story);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Chapter 1");
    expect(result[1].title).toBe("Chapter 10");
  });

  it("filters out empty/whitespace-only parts", () => {
    const story = "Chapter 1\nContent\n\n\nChapter 2\nMore content";
    const result = splitIntoChapters(story);
    expect(result).toHaveLength(2);
  });

  it("assigns sequential ids starting from 1 regardless of marker numbers", () => {
    const story = "Chapter 1\nContent one\nChapter 5\nContent five\nChapter 3\nContent three";
    const result = splitIntoChapters(story);
    expect(result.map((c) => c.id)).toEqual([1, 2, 3]);
  });

  it("is deterministic for the same input", () => {
    const story = "Chapter 1\nA\nChapter 2\nB";
    expect(splitIntoChapters(story)).toEqual(splitIntoChapters(story));
  });
});

describe("renumberChapters", () => {
  it("returns an empty array for empty input", () => {
    expect(renumberChapters([])).toEqual([]);
  });

  it("renumbers a single chapter starting from 1", () => {
    const chapters = [{ id: 99, title: "Old Title", content: "Some content" }];
    const result = renumberChapters(chapters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].title).toBe("Chapter 1");
    expect(result[0].content).toBe("Some content");
  });

  it("renumbers multiple chapters sequentially starting at 1", () => {
    const chapters = [
      { id: 5, title: "Old Title 5", content: "Content 5" },
      { id: 10, title: "Old Title 10", content: "Content 10" },
      { id: 99, title: "Old Title 99", content: "Content 99" },
    ];
    const result = renumberChapters(chapters);
    expect(result.map((c) => c.id)).toEqual([1, 2, 3]);
    expect(result.map((c) => c.title)).toEqual(["Chapter 1", "Chapter 2", "Chapter 3"]);
    expect(result[0].content).toBe("Content 5");
    expect(result[1].content).toBe("Content 10");
    expect(result[2].content).toBe("Content 99");
  });

  it("preserves content of each chapter", () => {
    const chapters = [{ id: 1, title: "Chapter One", content: "Long ago..." }];
    const result = renumberChapters(chapters);
    expect(result[0].content).toBe("Long ago...");
  });

  it("does not mutate the input array", () => {
    const chapters = [{ id: 7, title: "Old", content: "x" }];
    renumberChapters(chapters);
    expect(chapters[0].id).toBe(7);
    expect(chapters[0].title).toBe("Old");
  });
});
