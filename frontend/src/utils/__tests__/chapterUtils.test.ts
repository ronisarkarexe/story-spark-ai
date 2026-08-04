import { describe, it, expect } from "vitest";
import { splitIntoChapters, renumberChapters } from "../chapterUtils";

describe("splitIntoChapters", () => {
  it("returns an empty array for an empty string", () => {
    const result = splitIntoChapters("");
    expect(result).toEqual([]);
  });

  it("returns a single chapter when no chapter markers are present", () => {
    const story = "Once upon a time in a distant land.";
    const result = splitIntoChapters(story);
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe(story);
    expect(result[0].title).toBe(story);
  });

  it("splits a story with Chapter markers", () => {
    const story =
      "Chapter 1\nOnce upon a time.\n\nChapter 2\nThere was a hero.";
    const result = splitIntoChapters(story);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Chapter 1");
    expect(result[0].content).toBe("Once upon a time.");
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

  it("filters out empty parts", () => {
    const story = "Chapter 1\nContent\n\n\nChapter 2\nMore content";
    const result = splitIntoChapters(story);
    expect(result).toHaveLength(2);
  });

  it("assigns sequential ids starting from 1", () => {
    const story =
      "Chapter 1\nContent one\nChapter 5\nContent five\nChapter 3\nContent three";
    const result = splitIntoChapters(story);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
    expect(result[2].id).toBe(3);
  });
});

describe("renumberChapters", () => {
  it("returns an empty array for an empty input", () => {
    const result = renumberChapters([]);
    expect(result).toEqual([]);
  });

  it("renumbers a single chapter starting from 1", () => {
    const chapters = [{ id: 99, title: "Old Title", content: "Some content" }];
    const result = renumberChapters(chapters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].title).toBe("Chapter 1");
    expect(result[0].content).toBe("Some content");
  });

  it("renumbers multiple chapters starting from 1", () => {
    const chapters = [
      { id: 1, title: "Old Title", content: "Content 1" },
      { id: 2, title: "Old Title 2", content: "Content 2" },
      { id: 3, title: "Old Title 3", content: "Content 3" },
    ];
    const result = renumberChapters(chapters);
    expect(result[0].id).toBe(1);
    expect(result[0].title).toBe("Chapter 1");
    expect(result[1].id).toBe(2);
    expect(result[1].title).toBe("Chapter 2");
    expect(result[2].id).toBe(3);
    expect(result[2].title).toBe("Chapter 3");
  });

  it("preserves content of each chapter", () => {
    const chapters = [
      { id: 1, title: "Chapter One", content: "Long ago..." },
    ];
    const result = renumberChapters(chapters);
    expect(result[0].content).toBe("Long ago...");
  });
});
