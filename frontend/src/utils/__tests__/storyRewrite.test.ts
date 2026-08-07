import { describe, it, expect } from "vitest";
import {
  rewriteStory,
  getCreativityDescription,
} from "../storyRewrite";

describe("rewriteStory", () => {
  it("returns the story unchanged in the response", () => {
    const result = rewriteStory({ story: "A tale.", creativity: "Balanced" });
    expect(result.rewrittenStory).toBe("A tale.");
  });

  it("returns the expected response shape", () => {
    const result = rewriteStory({ story: "A tale.", creativity: "High" });
    expect(result).toHaveProperty("rewrittenStory");
  });
});

describe("getCreativityDescription", () => {
  it("describes the Low level", () => {
    expect(getCreativityDescription("Low")).toContain("original wording");
  });

  it("describes the Balanced level", () => {
    expect(getCreativityDescription("Balanced")).toContain("originality");
  });

  it("describes the High level", () => {
    expect(getCreativityDescription("High")).toContain("creative");
  });

  it("describes the Experimental level", () => {
    expect(getCreativityDescription("Experimental")).toContain("stylistic");
  });
});
