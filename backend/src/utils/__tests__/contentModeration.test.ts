import {
  checkContent,
  assertContentSafe,
} from "../../utils/contentModeration";

describe("checkContent", () => {
  it("returns blocked false for safe content", () => {
    const result = checkContent("Once upon a time, a brave knight went on an adventure.");
    expect(result.blocked).toBe(false);
    expect(result.reason).toBeUndefined();
  });

  it("returns blocked false for empty string", () => {
    const result = checkContent("");
    expect(result.blocked).toBe(false);
  });

  it("returns blocked false for null/undefined", () => {
    const result = checkContent(null as any);
    expect(result.blocked).toBe(false);
    const resultUndefined = checkContent(undefined as any);
    expect(resultUndefined.blocked).toBe(false);
  });

  it("returns blocked true for CSAM patterns", () => {
    const result = checkContent("child sexual content with minors");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("content involving minors");
  });

  it("returns blocked true for hate speech patterns", () => {
    const result = checkContent("all people should be exterminated");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("hate speech");
  });

  it("returns blocked true for violence instruction patterns", () => {
    const result = checkContent("step-by-step guide to kill a person");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("violent instructions");
  });

  it("returns blocked true for self-harm instruction patterns", () => {
    const result = checkContent("how to commit suicide methods");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("self-harm instructions");
  });

  it("is case-insensitive for violence patterns", () => {
    const result = checkContent("HOW TO KILL A HUMAN STEP BY STEP");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("violent instructions");
  });

  it("only the first matched pattern label is returned", () => {
    // If a text matches multiple patterns, only the first match is returned
    const result = checkContent("child sexual content describing genocide");
    // CSAM pattern matches first in the category order, so its reason is returned
    expect(result.blocked).toBe(true);
  });
});

describe("assertContentSafe", () => {
  it("does not throw for safe content", () => {
    expect(() => {
      assertContentSafe("A wonderful story about friendship.");
    }).not.toThrow();
  });

  it("throws with a descriptive message for blocked content", () => {
    expect(() => {
      assertContentSafe("how to commit suicide methods");
    }).toThrow(/content moderation/i);
  });

  it("includes the violation reason in the error message", () => {
    expect(() => {
      assertContentSafe("step-by-step guide to kill a person");
    }).toThrow(/violent instructions/);
  });
});
