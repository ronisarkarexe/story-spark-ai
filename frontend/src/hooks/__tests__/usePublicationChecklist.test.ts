import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import usePublicationChecklist from "../usePublicationChecklist";

describe("usePublicationChecklist", () => {
  it("returns an array", () => {
    const { result } = renderHook(() => usePublicationChecklist());
    expect(Array.isArray(result.current)).toBe(true);
  });

  it("returns non-empty checklist items", () => {
    const { result } = renderHook(() => usePublicationChecklist());
    expect(result.current.length).toBeGreaterThan(0);
  });

  it("returns items with correct shape", () => {
    const { result } = renderHook(() => usePublicationChecklist());

    result.current.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("passed");
      expect(item).toHaveProperty("recommendation");
      expect(typeof item.id).toBe("number");
      expect(typeof item.title).toBe("string");
      expect(typeof item.passed).toBe("boolean");
      expect(typeof item.recommendation).toBe("string");
    });
  });

  it("returns items with unique ids", () => {
    const { result } = renderHook(() => usePublicationChecklist());
    const ids = result.current.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("contains expected checklist categories", () => {
    const { result } = renderHook(() => usePublicationChecklist());
    const titles = result.current.map((item) => item.title);

    const expectedTitles = [
      "Title Quality",
      "Grammar",
      "Readability",
      "Metadata",
      "Plot Threads",
      "Accessibility",
    ];

    expectedTitles.forEach((expected) => {
      expect(titles).toContain(expected);
    });
  });

  it("is memoized and returns same reference on re-render", () => {
    const { result, rerender } = renderHook(() => usePublicationChecklist());
    const firstResult = result.current;

    rerender();
    expect(result.current).toBe(firstResult);
  });

  it("contains at least one item marked as passed and one as not passed", () => {
    const { result } = renderHook(() => usePublicationChecklist());

    const passedItems = result.current.filter((item) => item.passed);
    const failedItems = result.current.filter((item) => !item.passed);

    expect(passedItems.length).toBeGreaterThan(0);
    expect(failedItems.length).toBeGreaterThan(0);
  });

  it("items have non-empty title and recommendation strings", () => {
    const { result } = renderHook(() => usePublicationChecklist());

    result.current.forEach((item) => {
      expect(item.title.trim().length).toBeGreaterThan(0);
      expect(item.recommendation.trim().length).toBeGreaterThan(0);
    });
  });
});
