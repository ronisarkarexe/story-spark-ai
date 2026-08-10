import { describe, it, expect } from "vitest";
import {
  analyzeConflictResolution,
  refreshConflictAnalysis,
} from "../storyConflictResolutionEvaluator";

const VALID_TYPES = ["Primary", "Secondary"] as const;
const VALID_RESOLUTIONS = ["Resolved", "Partially Resolved", "Unresolved"] as const;

describe("analyzeConflictResolution", () => {
  it("returns [] for empty/whitespace input", () => {
    expect(analyzeConflictResolution("")).toEqual([]);
    expect(analyzeConflictResolution("   \n  ")).toEqual([]);
  });

  it("returns a non-empty list of conflicts for non-empty input", () => {
    const r = analyzeConflictResolution("A story with conflict.");
    expect(r.length).toBeGreaterThan(0);
  });

  it("each conflict has the required fields with valid type/resolution", () => {
    const r = analyzeConflictResolution("A story.");
    for (const c of r) {
      expect(typeof c.id).toBe("number");
      expect(typeof c.title).toBe("string");
      expect(c.title.length).toBeGreaterThan(0);
      expect(VALID_TYPES).toContain(c.type);
      expect(VALID_RESOLUTIONS).toContain(c.resolution);
      expect(typeof c.description).toBe("string");
      expect(c.description.length).toBeGreaterThan(0);
      expect(typeof c.suggestion).toBe("string");
      expect(c.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("conflict ids are unique and sequential", () => {
    const r = analyzeConflictResolution("A story.");
    const ids = r.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("includes exactly one Primary conflict", () => {
    const r = analyzeConflictResolution("A story.");
    const primaries = r.filter((c) => c.type === "Primary");
    expect(primaries.length).toBe(1);
  });

  it("is deterministic for the same input", () => {
    const story = "A deterministic story.";
    expect(analyzeConflictResolution(story)).toEqual(analyzeConflictResolution(story));
  });
});

describe("refreshConflictAnalysis", () => {
  it("delegates to analyzeConflictResolution", () => {
    const story = "A story to refresh.";
    expect(refreshConflictAnalysis(story)).toEqual(analyzeConflictResolution(story));
  });

  it("returns [] for empty input", () => {
    expect(refreshConflictAnalysis("")).toEqual([]);
  });
});
