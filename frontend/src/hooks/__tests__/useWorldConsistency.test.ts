import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWorldConsistency } from "../useWorldConsistency";
import { analyzeWorldConsistency } from "../../utils/worldConsistencyAnalyzer";

describe("useWorldConsistency", () => {
  it("starts with an empty rules list", () => {
    const { result } = renderHook(() => useWorldConsistency("any story"));
    expect(result.current.rules).toEqual([]);
  });

  it("populates rules via the analyzer after mount", () => {
    const story = "Dragon Kingdom and Dragon Empire appear together.";
    const expected = analyzeWorldConsistency(story);
    const { result } = renderHook(() => useWorldConsistency(story));
    expect(result.current.rules).toEqual(expected);
    expect(result.current.rules.length).toBeGreaterThan(0);
  });

  it("returns an empty rules list for a story with no conflicts", () => {
    const story = "A peaceful tale with no contradictions.";
    const { result } = renderHook(() => useWorldConsistency(story));
    expect(result.current.rules).toEqual([]);
  });

  it("detects the Kingdom Naming Conflict when both names appear", () => {
    const story = "The Dragon Kingdom fell. The Dragon Empire rose.";
    const { result } = renderHook(() => useWorldConsistency(story));
    const conflict = result.current.rules.find(
      (r) => r.title === "Kingdom Naming Conflict"
    );
    expect(conflict).toBeDefined();
    expect(conflict!.status).toBe("Conflict");
    expect(conflict!.category).toBe("Location");
  });

  it("detects the Magic Rule Conflict when contradictory magic phrases appear", () => {
    const story = "Magic cannot heal wounds. Yet, Magic healed instantly!";
    const { result } = renderHook(() => useWorldConsistency(story));
    const conflict = result.current.rules.find(
      (r) => r.title === "Magic Rule Conflict"
    );
    expect(conflict).toBeDefined();
    expect(conflict!.category).toBe("Magic");
  });

  it("exposes setRules so callers can override the rules", () => {
    const { result } = renderHook(() => useWorldConsistency("clean story"));
    expect(result.current.rules).toEqual([]);
    act(() => {
      result.current.setRules([
        {
          id: 99,
          category: "Custom",
          title: "Manual",
          description: "Manually added",
          status: "Conflict",
          suggestion: "Fix it",
        },
      ]);
    });
    expect(result.current.rules).toHaveLength(1);
    expect(result.current.rules[0].id).toBe(99);
  });

  it("recomputes rules when the story changes", () => {
    const { result, rerender } = renderHook(
      ({ story }: { story: string }) => useWorldConsistency(story),
      { initialProps: { story: "no conflicts here" } }
    );
    expect(result.current.rules).toEqual([]);

    rerender({ story: "Dragon Kingdom meets Dragon Empire" });
    expect(result.current.rules.length).toBeGreaterThan(0);
    expect(result.current.rules.some((r) => r.title === "Kingdom Naming Conflict")).toBe(true);
  });
});
