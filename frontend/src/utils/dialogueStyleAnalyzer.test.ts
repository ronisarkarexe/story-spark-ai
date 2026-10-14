import { describe, expect, it } from "vitest";
import { analyzeDialogue } from "./dialogueStyleAnalyzer";

describe("analyzeDialogue", () => {
  it("returns no character analysis when the story has no attributed dialogue", () => {
    expect(analyzeDialogue("The rain fell over the empty town.")).toEqual([]);
  });

  it("extracts speakers from labeled and attributed dialogue", () => {
    const result = analyzeDialogue(
      [
        "Alice: The observatory glows with silver light!",
        'John asked, "Could the telescope reveal distant planets?"',
        '"Perhaps," Alice replied.',
      ].join("\n")
    );

    expect(result.map(({ character }) => character)).toEqual(["Alice", "John"]);
    expect(result[0].speechPattern).toContain("frequent exclamations");
    expect(result[1].speechPattern).toContain("frequent questions");
  });

  it("returns deterministic, story-dependent scores and suggestions", () => {
    const story = [
      "Alice: The observatory glows with silver light above the ancient valley.",
      "John: The observatory glows with silver light above the ancient valley.",
    ].join("\n");

    const first = analyzeDialogue(story);
    const second = analyzeDialogue(story);

    expect(first).toEqual(second);
    expect(first.map(({ uniquenessScore }) => uniquenessScore)).not.toEqual(
      analyzeDialogue("Alice: Echo echo echo echo echo.\nJohn: Echo echo echo echo echo.")
        .map(({ uniquenessScore }) => uniquenessScore)
    );
    expect(first[0].similarTo).toBe("John");
    expect(first[0].suggestions.some((suggestion) => suggestion.includes("John"))).toBe(
      true
    );
  });

  it("reports insufficient dialogue instead of inventing characters", () => {
    const result = analyzeDialogue("Mira: Go!");

    expect(result).toHaveLength(1);
    expect(result[0].character).toBe("Mira");
    expect(result[0].suggestions).toContain(
      "Add more dialogue for Mira to make the vocabulary analysis more reliable."
    );
  });
});
