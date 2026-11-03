import { describe, it, expect } from 'vitest';
import { splitIntoChapters, renumberChapters, type Chapter } from "./chapterUtils";

describe("splitIntoChapters", () => {
  it("parses a story with numbered chapters", () => {
    const story =
      "Chapter 1\nOnce upon a time\n\nChapter 2\nThere was a hero\n\nChapter 3\nThe end";
    const chapters = splitIntoChapters(story);

    expect(chapters).toHaveLength(3);
    expect(chapters[0]).toEqual({
      id: 1,
      title: "Chapter 1",
      content: "Once upon a time",
    });
    expect(chapters[1]).toEqual({
      id: 2,
      title: "Chapter 2",
      content: "There was a hero",
    });
    expect(chapters[2]).toEqual({
      id: 3,
      title: "Chapter 3",
      content: "The end",
    });
  });

  it("parses a story with chapter keyword in any case", () => {
    const story = "CHAPTER 1\nFirst\nchapter 2\nSecond";
    const chapters = splitIntoChapters(story);

    expect(chapters).toHaveLength(2);
    expect(chapters[0].title).toBe("CHAPTER 1");
    expect(chapters[1].title).toBe("chapter 2");
  });

  it("returns empty array for story with no chapter markers", () => {
    const story = "This is a story without chapters";
    const chapters = splitIntoChapters(story);

    expect(chapters).toHaveLength(1);
    expect(chapters[0].id).toBe(1);
    expect(chapters[0].title).toBe("This is a story without chapters");
    expect(chapters[0].content).toBe("");
  });

  it("skips empty parts after splitting", () => {
    const story = "Chapter 1\nContent\n\n\nChapter 2\nMore content";
    const chapters = splitIntoChapters(story);

    expect(chapters).toHaveLength(2);
  });

  it("handles chapter with empty content", () => {
    const story = "Chapter 1\n\nChapter 2\nHas content";
    const chapters = splitIntoChapters(story);

    expect(chapters[0].content).toBe("");
    expect(chapters[1].content).toBe("Has content");
  });

  it("handles multiline chapter content", () => {
    const story =
      "Chapter 1\nLine one\nLine two\nLine three";
    const chapters = splitIntoChapters(story);

    expect(chapters).toHaveLength(1);
    expect(chapters[0].content).toBe("Line one\nLine two\nLine three");
  });

  it("uses default title when chapter header is empty", () => {
    const story = "\nContent without title";
    const chapters = splitIntoChapters(story);

    expect(chapters[0].title).toMatch(/Chapter 1/);
  });
});

describe("renumberChapters", () => {
  it("renumbers chapters starting from 1", () => {
    const chapters: Chapter[] = [
      { id: 5, title: "Old Chapter 5", content: "Content" },
      { id: 10, title: "Old Chapter 10", content: "More content" },
    ];

    const result = renumberChapters(chapters);

    expect(result[0].id).toBe(1);
    expect(result[0].title).toBe("Chapter 1");
    expect(result[1].id).toBe(2);
    expect(result[1].title).toBe("Chapter 2");
  });

  it("updates titles to reflect new numbering", () => {
    const chapters: Chapter[] = [
      { id: 1, title: "Chapter 1", content: "First" },
      { id: 2, title: "Chapter 2", content: "Second" },
      { id: 3, title: "Chapter 3", content: "Third" },
    ];

    const result = renumberChapters(chapters);

    expect(result.map((c) => c.title)).toEqual([
      "Chapter 1",
      "Chapter 2",
      "Chapter 3",
    ]);
  });

  it("preserves content of each chapter", () => {
    const chapters: Chapter[] = [
      { id: 1, title: "Chapter 1", content: "Alpha content" },
      { id: 2, title: "Chapter 2", content: "Beta content" },
    ];

    const result = renumberChapters(chapters);

    expect(result.map((c) => c.content)).toEqual([
      "Alpha content",
      "Beta content",
    ]);
  });

  it("handles single chapter", () => {
    const chapters: Chapter[] = [{ id: 99, title: "Chapter 99", content: "Only" }];
    const result = renumberChapters(chapters);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].title).toBe("Chapter 1");
    expect(result[0].content).toBe("Only");
  });

  it("handles empty chapter array", () => {
    const result = renumberChapters([]);
    expect(result).toHaveLength(0);
  });
});
