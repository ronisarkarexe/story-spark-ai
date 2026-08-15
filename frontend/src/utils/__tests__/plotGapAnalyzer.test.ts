import { describe, it, expect } from "vitest";
import { analyzePlotGaps } from "../plotGapAnalyzer";

const VALID_SEVERITIES = ["Low", "Medium", "High"] as const;

describe("analyzePlotGaps", () => {
  it("returns a 'No Issues' finding for an empty/whitespace story", () => {
    const r = analyzePlotGaps("");
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("No Issues");
    expect(r[0].severity).toBe("Low");
  });

  it("returns a 'No Issues' finding for a story with no triggers", () => {
    const r = analyzePlotGaps("A calm story about daily life and routine.");
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("No Issues");
  });

  it("detects an Abrupt Transition when 'suddenly' is present", () => {
    const r = analyzePlotGaps("Suddenly, everything changed.");
    expect(r.some((f) => f.type === "Abrupt Transition")).toBe(true);
  });

  it("detects Abrupt Transition case-insensitively", () => {
    const r = analyzePlotGaps("SUDDENLY the scene shifted.");
    expect(r.some((f) => f.type === "Abrupt Transition")).toBe(true);
  });

  it("detects an Unresolved Plot when 'mystery' is present without 'solved'", () => {
    const r = analyzePlotGaps("A deep mystery unfolded in the woods.");
    expect(r.some((f) => f.type === "Unresolved Plot")).toBe(true);
    expect(r.some((f) => f.type === "Unresolved Plot" && f.severity === "High")).toBe(true);
  });

  it("does NOT flag an Unresolved Plot when the mystery is solved", () => {
    const r = analyzePlotGaps("The mystery was eventually solved by the detective.");
    expect(r.some((f) => f.type === "Unresolved Plot")).toBe(false);
  });

  it("detects a Location Gap with castle+forest and no travel", () => {
    const r = analyzePlotGaps("They stood at the castle then appeared in the forest.");
    expect(r.some((f) => f.type === "Location Gap")).toBe(true);
  });

  it("does NOT flag a Location Gap when travel is mentioned", () => {
    const r = analyzePlotGaps("They traveled from the castle to the forest.");
    expect(r.some((f) => f.type === "Location Gap")).toBe(false);
  });

  it("each finding has the required fields and a valid severity", () => {
    const r = analyzePlotGaps("suddenly a mystery at the castle and the forest");
    for (const f of r) {
      expect(typeof f.id).toBe("number");
      expect(typeof f.type).toBe("string");
      expect(f.type.length).toBeGreaterThan(0);
      expect(VALID_SEVERITIES).toContain(f.severity);
      expect(typeof f.description).toBe("string");
      expect(f.description.length).toBeGreaterThan(0);
      expect(typeof f.suggestion).toBe("string");
      expect(f.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("finding ids are unique and sequential", () => {
    const r = analyzePlotGaps("suddenly a mystery at the castle and the forest");
    const ids = r.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("is deterministic for the same input", () => {
    const story = "suddenly a mystery at the castle and the forest";
    expect(analyzePlotGaps(story)).toEqual(analyzePlotGaps(story));
  });
});
