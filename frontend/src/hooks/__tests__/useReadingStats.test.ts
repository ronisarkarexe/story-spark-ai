import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useReadingStats from "../useReadingStats";

describe("useReadingStats", () => {
  it("returns reading stats for a given text", () => {
    const { result } = renderHook(() =>
      useReadingStats("This is a test story with several words.")
    );
    expect(result.current).toHaveProperty("words");
    expect(result.current).toHaveProperty("paragraphs");
    expect(result.current).toHaveProperty("chapters");
    expect(result.current).toHaveProperty("sentences");
    expect(result.current).toHaveProperty("averageSentenceLength");
    expect(result.current).toHaveProperty("readingTime");
  });

  it("memoizes results: same text does not recompute", () => {
    const { result, rerender } = renderHook(
      ({ text }) => useReadingStats(text),
      { initialProps: { text: "This is a test story." } }
    );
    const firstResult = result.current;
    rerender({ text: "This is a test story." });
    expect(result.current).toBe(firstResult);
  });

  it("recomputes when text changes", () => {
    const { result, rerender } = renderHook(
      ({ text }) => useReadingStats(text),
      { initialProps: { text: "Short text." } }
    );
    const wordsFirst = result.current.words;
    rerender({ text: "A much longer text with many more words in it." });
    expect(result.current.words).not.toBe(wordsFirst);
  });

  it("handles empty string", () => {
    const { result } = renderHook(() => useReadingStats(""));
    expect(result.current.words).toBe(0);
    expect(result.current.sentences).toBe(0);
  });

  it("returns numeric values for all stat fields", () => {
    const { result } = renderHook(() =>
      useReadingStats("Hello world. This is a sentence.")
    );
    expect(typeof result.current.words).toBe("number");
    expect(typeof result.current.paragraphs).toBe("number");
    expect(typeof result.current.chapters).toBe("number");
    expect(typeof result.current.sentences).toBe("number");
    expect(typeof result.current.averageSentenceLength).toBe("number");
    expect(typeof result.current.readingTime).toBe("number");
  });
});
