/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";

import useChapterBalance from "../useChapterBalance";

describe("useChapterBalance", () => {
  it("returns an array of ChapterAnalysis objects", () => {
    const story = `
      Chapter 1
      This is a sample chapter with some words.
    `;

    const { result } = renderHook(() => useChapterBalance(story));

    expect(Array.isArray(result.current)).toBe(true);

    result.current.forEach((chapter) => {
      expect(chapter).toHaveProperty("chapter");
      expect(chapter).toHaveProperty("words");
      expect(chapter).toHaveProperty("score");
      expect(chapter).toHaveProperty("status");
    });
  });

  it("returns an empty array for an empty story", () => {
    const { result } = renderHook(() => useChapterBalance(""));

    expect(result.current).toEqual([]);
  });

  it("splits chapters correctly and computes word counts", () => {
    const story = `
      Chapter 1
      one two three four

      Chapter 2
      one two three four five six
    `;

    const { result } = renderHook(() => useChapterBalance(story));

    expect(result.current).toHaveLength(2);

    expect(result.current[0]).toMatchObject({
      chapter: 1,
      words: 4,
      score: 1,
      status: "Needs Review",
    });

    expect(result.current[1]).toMatchObject({
      chapter: 2,
      words: 6,
      score: 1,
      status: "Needs Review",
    });
  });

  it("handles chapter markers case-insensitively", () => {
    const story = `
      CHAPTER 1
      one two three

      chapter 2
      one two three four
    `;

    const { result } = renderHook(() => useChapterBalance(story));

    expect(result.current).toHaveLength(2);
    expect(result.current[0].chapter).toBe(1);
    expect(result.current[1].chapter).toBe(2);
  });

  it("assigns Balanced status when chapter word count is within range", () => {
    const chapterText = Array.from({ length: 500 })
      .map(() => "word")
      .join(" ");

    const story = `
      Chapter 1
      ${chapterText}
    `;

    const { result } = renderHook(() => useChapterBalance(story));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].words).toBe(500);
    expect(result.current[0].status).toBe("Balanced");
  });
});