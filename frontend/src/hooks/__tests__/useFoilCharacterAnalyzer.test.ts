import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useFoilCharacterAnalyzer from "../useFoilCharacterAnalyzer";

describe("useFoilCharacterAnalyzer", () => {
  it("returns pairs from analyzeFoilCharacters", () => {
    const { result } = renderHook(() => useFoilCharacterAnalyzer());
    expect(result.current.pairs).toBeDefined();
    expect(Array.isArray(result.current.pairs)).toBe(true);
    expect(result.current.pairs.length).toBeGreaterThan(0);
  });

  it("pairs have protagonist, foil, contrast, and suggestion fields", () => {
    const { result } = renderHook(() => useFoilCharacterAnalyzer());
    const firstPair = result.current.pairs[0];
    expect(firstPair).toHaveProperty("protagonist");
    expect(firstPair).toHaveProperty("foil");
    expect(firstPair).toHaveProperty("contrast");
    expect(firstPair).toHaveProperty("suggestion");
    expect(typeof firstPair.protagonist).toBe("string");
    expect(typeof firstPair.foil).toBe("string");
  });

  it("totalCharacters equals pairs.length * 2", () => {
    const { result } = renderHook(() => useFoilCharacterAnalyzer());
    expect(result.current.totalCharacters).toBe(result.current.pairs.length * 2);
  });

  it("pairs are memoized and stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useFoilCharacterAnalyzer());
    const pairsFirst = result.current.pairs;
    rerender();
    expect(result.current.pairs).toBe(pairsFirst);
  });

  it("totalCharacters is stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useFoilCharacterAnalyzer());
    const totalFirst = result.current.totalCharacters;
    rerender();
    expect(result.current.totalCharacters).toBe(totalFirst);
  });
});
