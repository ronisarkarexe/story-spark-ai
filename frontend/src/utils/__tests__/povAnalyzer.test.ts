import { describe, it, expect } from "vitest";
import { analyzePOV } from "../povAnalyzer";

describe("analyzePOV", () => {
  it("returns no issues when first-person narration matches expected POV", () => {
    const story = "I walked through the dark forest. My heart was racing. I saw a light ahead.";
    const issues = analyzePOV(story, "First Person");
    expect(issues).toEqual([]);
  });

  it("returns no issues when third-person narration matches expected POV", () => {
    const story = "She opened the door slowly. He stepped inside and looked around.";
    const issues = analyzePOV(story, "Third Person");
    expect(issues).toEqual([]);
  });

  it("flags third-person pronouns when first-person POV is expected", () => {
    const story = "I was nervous. He walked into the room.";
    const issues = analyzePOV(story, "First Person");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].detectedPOV).toBe("Third Person");
    expect(issues[0].sentence).toContain("He walked into the room");
  });

  it("flags first-person pronouns when third-person POV is expected", () => {
    const story = "She smiled. I felt relieved.";
    const issues = analyzePOV(story, "Third Person");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].detectedPOV).toBe("First Person");
    expect(issues[0].sentence).toContain("I felt relieved");
  });

  it("returns an empty array for an empty story", () => {
    const issues = analyzePOV("", "First Person");
    expect(issues).toEqual([]);
  });

  it("provides suggestion text for detected shifts", () => {
    const issues = analyzePOV("I waited. They arrived late.", "First Person");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].suggestion.length).toBeGreaterThan(0);
  });
});
