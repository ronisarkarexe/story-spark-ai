import { describe, it, expect } from "vitest";
import { analyzeNarrativeFlow } from "../narrativeFlowAnalyzer";

describe("analyzeNarrativeFlow", () => {
  it("returns an empty array for a clean story", () => {
    const issues = analyzeNarrativeFlow("The hero walked calmly through the valley.");
    expect(issues).toEqual([]);
  });

  it("flags 'Suddenly' as an abrupt transition", () => {
    const issues = analyzeNarrativeFlow("Suddenly the door burst open.");
    const abrupt = issues.find((i) => i.type === "Abrupt Transition");
    expect(abrupt).toBeDefined();
    expect(abrupt?.severity).toBe("High");
  });

  it("flags repeated 'Then' usage as repetition", () => {
    const story = "Then he left. Then she cried. Then he returned. Then they talked. Then they parted. Then it ended.";
    const issues = analyzeNarrativeFlow(story);
    const repetition = issues.find((i) => i.type === "Repetition");
    expect(repetition).toBeDefined();
    expect(repetition?.severity).toBe("Medium");
  });

  it("does not flag a single 'Then'", () => {
    const issues = analyzeNarrativeFlow("Then he left.");
    expect(issues.find((i) => i.type === "Repetition")).toBeUndefined();
  });

  it("returns issues with the expected shape", () => {
    const issues = analyzeNarrativeFlow("Suddenly everything changed.");
    const issue = issues[0];
    expect(issue).toHaveProperty("id");
    expect(issue).toHaveProperty("type");
    expect(issue).toHaveProperty("severity");
    expect(issue).toHaveProperty("scene");
    expect(issue).toHaveProperty("explanation");
    expect(issue).toHaveProperty("suggestion");
  });
});
