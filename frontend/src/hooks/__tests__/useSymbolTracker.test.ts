import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useSymbolTracker from "../useSymbolTracker";

describe("useSymbolTracker", () => {
  it("returns an array of story symbols", () => {
    const { result } = renderHook(() => useSymbolTracker("The ring and the sword"));
    expect(Array.isArray(result.current)).toBe(true);
  });

  it("each symbol has symbol, occurrences, and status fields", () => {
    const { result } = renderHook(() => useSymbolTracker("The ring and the sword"));
    result.current.forEach((symbol) => {
      expect(symbol).toHaveProperty("symbol");
      expect(symbol).toHaveProperty("occurrences");
      expect(symbol).toHaveProperty("status");
      expect(typeof symbol.symbol).toBe("string");
      expect(typeof symbol.occurrences).toBe("number");
      expect(["Resolved", "Unresolved"]).toContain(symbol.status);
    });
  });

  it("memoizes results: same story does not recompute", () => {
    const { result, rerender } = renderHook(
      ({ story }) => useSymbolTracker(story),
      { initialProps: { story: "The ring and the sword" } }
    );
    const firstResult = result.current;
    rerender({ story: "The ring and the sword" });
    expect(result.current).toBe(firstResult);
  });

  it("recomputes when story changes", () => {
    const { result, rerender } = renderHook(
      ({ story }) => useSymbolTracker(story),
      { initialProps: { story: "The ring" } }
    );
    const firstResult = result.current;
    rerender({ story: "The ring and the sword and the moon" });
    // Results should differ as story changed
    expect(result.current).not.toBe(firstResult);
  });

  it("handles empty story string", () => {
    const { result } = renderHook(() => useSymbolTracker(""));
    expect(Array.isArray(result.current)).toBe(true);
    // No symbols should be found in empty string
    expect(result.current.every((s) => s.occurrences === 0)).toBe(true);
  });
});
