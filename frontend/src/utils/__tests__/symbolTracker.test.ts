import { describe, expect, it } from "vitest";
import { analyzeSymbols } from "../symbolTracker";

describe("analyzeSymbols", () => {
  it("counts known symbols and assigns status based on occurrences", () => {
    const result = analyzeSymbols(
      "The ring rested beside an altar. " +
        "She wore the ring beneath the moon."
    );

    expect(result).toEqual([
      { symbol: "ring", occurrences: 2, status: "Resolved" },
      { symbol: "moon", occurrences: 1, status: "Unresolved" },
    ]);
  });

  it("returns only symbols with at least one occurrence", () => {
    const result = analyzeSymbols("A sword crossed the forest.");

    expect(result).toEqual([
      { symbol: "sword", occurrences: 1, status: "Unresolved" },
      { symbol: "forest", occurrences: 1, status: "Unresolved" },
    ]);
  });

  it("marks a symbol as resolved when it occurs more than once", () => {
    const result = analyzeSymbols("The key opened the door; the key was old.");

    expect(result).toEqual([
      { symbol: "key", occurrences: 2, status: "Resolved" },
    ]);
  });

  it("returns an empty array when the story has no tracked symbols", () => {
    expect(analyzeSymbols("A traveler crossed a quiet valley at dawn.")).toEqual(
      []
    );
  });

  it("returns an empty array for an empty story", () => {
    expect(analyzeSymbols("")).toEqual([]);
  });
});
