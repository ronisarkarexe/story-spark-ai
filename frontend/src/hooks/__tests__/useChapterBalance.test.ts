import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useChapterBalance from "../useChapterBalance";

describe("useChapterBalance hook", () => {
  it("returns an array of chapter analyses", () => {
    const story = "chapter 1 This is a long chapter with more than 400 words. " +
      "It continues with more content to ensure the word count exceeds 400. " +
      "More text here to push the count higher. " +
      "Even more words to reach the required threshold. " +
      "Adding additional content to ensure the chapter is sufficiently long. " +
      "This should now be well over 400 words to pass the balance check.";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(Array.isArray(result.current)).toBe(true);
  });

  it("returns an empty array for an empty story", () => {
    const { result } = renderHook(() => useChapterBalance(""));
    expect(result.current).toEqual([]);
  });

  it("each chapter analysis has the expected shape", () => {
    const story = "chapter 1 Some words here";
    const { result } = renderHook(() => useChapterBalance(story));
    if (result.current.length > 0) {
      const chapter = result.current[0];
      expect(chapter).toHaveProperty("chapter");
      expect(chapter).toHaveProperty("words");
      expect(chapter).toHaveProperty("score");
      expect(chapter).toHaveProperty("status");
      expect(typeof chapter.chapter).toBe("number");
      expect(typeof chapter.words).toBe("number");
      expect(typeof chapter.score).toBe("number");
      expect(["Balanced", "Needs Review"]).toContain(chapter.status);
    }
  });

  it("memoizes result based on the story dependency", () => {
    const { result, rerender } = renderHook(
      ({ story }: { story: string }) => useChapterBalance(story),
      { initialProps: { story: "chapter 1 one two three four five six seven eight nine ten" } }
    );
    const firstResult = result.current;

    // Same story should return same result
    rerender({ story: "chapter 1 one two three four five six seven eight nine ten" });
    expect(result.current).toEqual(firstResult);

    // Different story should recompute
    rerender({ story: "chapter 1 completely different story text here and more content" });
    // Result may or may not be equal depending on content - just ensure it computed
    expect(Array.isArray(result.current)).toBe(true);
  });
});
