import { analyzeStoryConflicts, StoryConflict } from "../storyConflictAnalyzer";

describe("analyzeStoryConflicts", () => {
  it("returns empty array for empty string input", () => {
    expect(analyzeStoryConflicts("")).toEqual([]);
  });

  it("returns empty array for whitespace-only input", () => {
    expect(analyzeStoryConflicts("   \n\t  ")).toEqual([]);
  });

  it("returns an array of StoryConflict objects for non-empty input", () => {
    const result = analyzeStoryConflicts("A hero confronts a villain in battle.");
    expect(Array.isArray(result)).toBe(true);
    result.forEach((conflict) => {
      expect(conflict).toHaveProperty("id");
      expect(conflict).toHaveProperty("title");
      expect(conflict).toHaveProperty("type");
      expect(conflict).toHaveProperty("strength");
      expect(conflict).toHaveProperty("section");
      expect(conflict).toHaveProperty("suggestion");
    });
  });

  it("returns conflicts with valid type values", () => {
    const result = analyzeStoryConflicts("The character struggles against the environment.");
    const validTypes = [
      "Character vs Character",
      "Character vs Self",
      "Character vs Society",
      "Character vs Nature",
    ];
    result.forEach((conflict: StoryConflict) => {
      expect(validTypes).toContain(conflict.type);
    });
  });

  it("returns conflicts with strength as a number between 0 and 100", () => {
    const result = analyzeStoryConflicts("A warrior fights the dragon.");
    result.forEach((conflict: StoryConflict) => {
      expect(typeof conflict.strength).toBe("number");
      expect(conflict.strength).toBeGreaterThanOrEqual(0);
      expect(conflict.strength).toBeLessThanOrEqual(100);
    });
  });

  it("returns conflicts with non-empty title and suggestion", () => {
    const result = analyzeStoryConflicts("The detective solves the mystery.");
    result.forEach((conflict: StoryConflict) => {
      expect(conflict.title.length).toBeGreaterThan(0);
      expect(conflict.suggestion.length).toBeGreaterThan(0);
    });
  });

  it("assigns unique ids to each conflict", () => {
    const result = analyzeStoryConflicts(
      "The hero faces many challenges in the kingdom."
    );
    const ids = result.map((c: StoryConflict) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
