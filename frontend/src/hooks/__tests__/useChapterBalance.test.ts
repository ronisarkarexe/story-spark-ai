import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useChapterBalance from "../useChapterBalance";

describe("useChapterBalance", () => {
  it("returns chapter analysis for a story with chapters", () => {
    const story =
      "Chapter 1\nThis is chapter one content that has many words " +
      "to make it long enough. ".repeat(30) +
      "\n\nChapter 2\nThis is chapter two content that is also long " +
      "enough to trigger the balanced status. ".repeat(30);
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current).toHaveLength(2);
    expect(result.current[0].chapter).toBe(1);
    expect(result.current[1].chapter).toBe(2);
  });

  it("returns empty array for empty story string", () => {
    const { result } = renderHook(() => useChapterBalance(""));
    expect(result.current).toHaveLength(0);
  });

  it("memoizes result when story does not change", () => {
    const story = "Chapter 1\nSome content here.";
    const { result, rerender } = renderHook(
      ({ s }) => useChapterBalance(s),
      { initialProps: { s: story } }
    );
    const firstResult = result.current;
    rerender({ s: story });
    expect(result.current).toBe(firstResult);
  });

  it("recomputes when story changes", () => {
    const story1 = "Chapter 1\nContent one.";
    const story2 = "Chapter 1\nContent one.\n\nChapter 2\nContent two.";
    const { result, rerender } = renderHook(
      ({ s }) => useChapterBalance(s),
      { initialProps: { s: story1 } }
    );
    expect(result.current).toHaveLength(1);
    rerender({ s: story2 });
    expect(result.current).toHaveLength(2);
  });

  it("returns correct status for short chapter", () => {
    const story = "Chapter 1\nShort content.";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current[0].status).toBe("Needs Review");
  });

  it("returns correct status for balanced chapter", () => {
    const filler = Array(600).fill("word").join(" ");
    const story = `Chapter 1\n${filler}`;
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current[0].status).toBe("Balanced");
  });
});
