import { describe, it, expect } from "vitest";
import { analyzePOV } from "../povAnalyzer";

describe("analyzePOV", () => {
  it("returns [] when the story matches the expected First Person POV", () => {
    const r = analyzePOV("I went to the store. I bought some food.", "First Person");
    expect(r).toEqual([]);
  });

  it("returns [] when the story matches the expected Third Person POV", () => {
    const r = analyzePOV("He went to the store. She bought some food.", "Third Person");
    expect(r).toEqual([]);
  });

  it("flags third-person pronouns when expecting First Person", () => {
    const r = analyzePOV("He walked away. I watched him.", "First Person");
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].detectedPOV).toBe("Third Person");
  });

  it("flags first-person pronouns when expecting Third Person", () => {
    const r = analyzePOV("I saw her. She smiled at me.", "Third Person");
    const firsts = r.filter((i) => i.detectedPOV === "First Person");
    expect(firsts.length).toBeGreaterThan(0);
  });

  it("each issue has the required fields with non-empty strings", () => {
    const r = analyzePOV("He walked away. I saw him.", "First Person");
    for (const i of r) {
      expect(typeof i.sentence).toBe("string");
      expect(typeof i.detectedPOV).toBe("string");
      expect(i.detectedPOV.length).toBeGreaterThan(0);
      expect(typeof i.reason).toBe("string");
      expect(i.reason.length).toBeGreaterThan(0);
      expect(typeof i.suggestion).toBe("string");
      expect(i.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("returns [] for an empty story", () => {
    expect(analyzePOV("", "First Person")).toEqual([]);
    expect(analyzePOV("", "Third Person")).toEqual([]);
  });

  it("does not flag a sentence with no pronouns", () => {
    expect(analyzePOV("The dog barked loudly.", "First Person")).toEqual([]);
    expect(analyzePOV("The dog barked loudly.", "Third Person")).toEqual([]);
  });

  it("suggestion for first-person POV mismatch mentions first-person", () => {
    const r = analyzePOV("He left.", "First Person");
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].suggestion.toLowerCase()).toContain("first-person");
  });

  it("suggestion for third-person POV mismatch mentions third-person", () => {
    const r = analyzePOV("I left.", "Third Person");
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].suggestion.toLowerCase()).toContain("third-person");
  });

  it("is deterministic for the same input", () => {
    const story = "He walked. I saw him.";
    expect(analyzePOV(story, "First Person")).toEqual(analyzePOV(story, "First Person"));
  });
});
