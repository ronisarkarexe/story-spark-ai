import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import useChapterBalance from "../useChapterBalance";

describe("useChapterBalance", () => {
  it("returns an array of ChapterAnalysis objects", () => {
    const { result } = renderHook(() =>
      useChapterBalance("Chapter 1 Once upon a time there was a hero.")
    );

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toMatchObject({
      chapter: 1,
      words: expect.any(Number),
      score: expect.any(Number),
      status: expect.stringMatching(/Balanced|Needs Review/),
    });
  });

  it("returns an empty array for an empty story", () => {
    const { result } = renderHook(() => useChapterBalance(""));

    expect(result.current).toEqual([]);
  });

  it("splits chapter markers correctly and computes word counts", () => {
    const story = `
      Chapter 1 Once upon a time there were two friends exploring the forest.
      Chapter 2 They discovered a hidden cave with a glowing stone.
    `;

    const { result } = renderHook(() => useChapterBalance(story));

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toMatchObject({
      chapter: 1,
      words: 11,
      score: 1,
      status: "Needs Review",
    });
    expect(result.current[1]).toMatchObject({
      chapter: 2,
      words: 9,
      score: 1,
      status: "Needs Review",
    });
  });
});
