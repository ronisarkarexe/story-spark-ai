import { narrativeFlowAnalyzer } from "../narrativeFlowAnalyzer";

describe("narrativeFlowAnalyzer", () => {
  it("detects Abrupt Transition when story contains 'Suddenly'", () => {
    const story = "The hero was walking. Suddenly, a dragon appeared.";
    const result = narrativeFlowAnalyzer(story);
    
    // We expect the array of issues to contain an object with type: "Abrupt Transition"
    expect(result).toContainEqual(
      expect.objectContaining({ type: "Abrupt Transition" })
    );
  });

  it("detects Repetition when story contains MORE THAN 5 occurrences of 'Then'", () => {
    const story = "Then he went to the store. Then he bought milk. Then he went home. Then he drank it. Then he slept. Then he woke up.";
    const result = narrativeFlowAnalyzer(story);
    
    // We expect the array of issues to contain an object with type: "Repetition"
    expect(result).toContainEqual(
      expect.objectContaining({ type: "Repetition" })
    );
  });

  it("returns no issues for normal story text", () => {
    const story = "The hero walked gracefully through the peaceful village, enjoying the morning breeze.";
    const result = narrativeFlowAnalyzer(story);
    
    // We expect an empty array when there are no issues
    expect(result).toEqual([]);
  });

  it("handles empty string without throwing and returns []", () => {
    expect(() => narrativeFlowAnalyzer("")).not.toThrow();
    
    const result = narrativeFlowAnalyzer("");
    expect(result).toEqual([]);
  });
});
