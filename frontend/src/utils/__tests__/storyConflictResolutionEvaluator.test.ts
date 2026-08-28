import { describe, it, expect } from "vitest";
import {
  analyzeConflictResolution,
  refreshConflictAnalysis,
} from "../storyConflictResolutionEvaluator";

describe("analyzeConflictResolution", () => {
  it("returns an empty array for empty text", () => {
    expect(analyzeConflictResolution("")).toEqual([]);
    expect(analyzeConflictResolution("   ")).toEqual([]);
  });

  it("returns conflicts for a non-empty story", () => {
    const result = analyzeConflictResolution("The hero faced the villain in the final battle.");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns items with the expected shape", () => {
    const result = analyzeConflictResolution("Two brothers argued over the ancient artifact.");
    const conflict = result[0];
    expect(conflict).toHaveProperty("id");
    expect(conflict).toHaveProperty("title");
    expect(conflict).toHaveProperty("type");
    expect(conflict).toHaveProperty("resolution");
    expect(conflict).toHaveProperty("suggestion");
  });

  it("classifies type as Primary or Secondary", () => {
    const result = analyzeConflictResolution("The siblings finally reconciled.");
    const valid = ["Primary", "Secondary"];
    for (const conflict of result) {
      expect(valid).toContain(conflict.type);
    }
  });

  it("classifies resolution as Resolved, Partially Resolved, or Unresolved", () => {
    const result = analyzeConflictResolution("The mystery of the artifact remained unsolved.");
    const valid = ["Resolved", "Partially Resolved", "Unresolved"];
    for (const conflict of result) {
      expect(valid).toContain(conflict.resolution);
    }
  });

  it("assigns sequential ids", () => {
    const result = analyzeConflictResolution("The kingdom was at peace once more.");
    result.forEach((conflict, index) => {
      expect(conflict.id).toBe(index + 1);
    });
  });

  it("refreshConflictAnalysis returns the same result", () => {
    const story = "The hero defeated the antagonist.";
    expect(refreshConflictAnalysis(story)).toEqual(analyzeConflictResolution(story));
  });
});
