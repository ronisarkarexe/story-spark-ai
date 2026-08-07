import { describe, it, expect } from "vitest";
import { analyzePlotGaps } from "../plotGapAnalyzer";

describe("analyzePlotGaps", () => {
  it("returns a no-issues fallback when no gaps are found", () => {
    const result = analyzePlotGaps("A calm story with no abrupt changes.");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("No Issues");
    expect(result[0].severity).toBe("Low");
  });

  it("detects abrupt transitions", () => {
    const result = analyzePlotGaps("Suddenly the scene changed.");
    const abrupt = result.find((g) => g.type === "Abrupt Transition");
    expect(abrupt).toBeDefined();
    expect(abrupt?.severity).toBe("Medium");
  });

  it("detects unresolved mysteries", () => {
    const result = analyzePlotGaps("A mystery was introduced without any resolution.");
    const unresolved = result.find((g) => g.type === "Unresolved Plot");
    expect(unresolved).toBeDefined();
    expect(unresolved?.severity).toBe("High");
  });

  it("does not flag a mystery when it is solved", () => {
    const result = analyzePlotGaps("A mystery was introduced and solved later.");
    const unresolved = result.find((g) => g.type === "Unresolved Plot");
    expect(unresolved).toBeUndefined();
  });

  it("detects location gaps", () => {
    const result = analyzePlotGaps("He was in the castle, then the forest.");
    const locationGap = result.find((g) => g.type === "Location Gap");
    expect(locationGap).toBeDefined();
  });

  it("does not flag a location gap when travel is mentioned", () => {
    const result = analyzePlotGaps("He traveled from the castle to the forest.");
    const locationGap = result.find((g) => g.type === "Location Gap");
    expect(locationGap).toBeUndefined();
  });

  it("assigns sequential ids to findings", () => {
    const result = analyzePlotGaps("Suddenly a mystery appeared in the castle and the forest.");
    result.forEach((gap, index) => {
      expect(gap.id).toBe(index + 1);
    });
  });

  it("provides a suggestion for every finding", () => {
    const result = analyzePlotGaps("Suddenly the hero appeared.");
    for (const gap of result) {
      expect(gap.suggestion.length).toBeGreaterThan(0);
    }
  });
});
