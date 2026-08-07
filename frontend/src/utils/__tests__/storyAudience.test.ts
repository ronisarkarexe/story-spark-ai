import { describe, it, expect } from "vitest";
import {
  audienceOptions,
  getAudienceById,
  validateAudience,
  buildAudiencePrompt,
  generateAudienceStory,
} from "../storyAudience";

describe("audienceOptions", () => {
  it("contains five audience options", () => {
    expect(audienceOptions).toHaveLength(5);
  });

  it("includes the general audience option", () => {
    const general = audienceOptions.find((o) => o.id === "general");
    expect(general?.name).toBe("General Audience");
  });
});

describe("getAudienceById", () => {
  it("returns the matching audience option", () => {
    const result = getAudienceById("teenagers");
    expect(result?.name).toBe("Teenagers");
  });

  it("returns undefined for an unknown id", () => {
    expect(getAudienceById("unknown")).toBeUndefined();
  });
});

describe("validateAudience", () => {
  it("accepts known audience names", () => {
    expect(validateAudience("Children")).toBe(true);
    expect(validateAudience("General Audience")).toBe(true);
  });

  it("rejects unknown audience names", () => {
    expect(validateAudience("Aliens")).toBe(false);
    expect(validateAudience("")).toBe(false);
  });
});

describe("buildAudiencePrompt", () => {
  it("includes the audience name in the prompt", () => {
    const prompt = buildAudiencePrompt("Children", "A story about a cat.");
    expect(prompt).toContain("Children");
  });

  it("includes the original prompt", () => {
    const prompt = buildAudiencePrompt("Adults", "A mystery in the city.");
    expect(prompt).toContain("A mystery in the city.");
  });

  it("generateAudienceStory returns the same prompt", () => {
    expect(generateAudienceStory("Teenagers", "A school adventure.")).toBe(
      buildAudiencePrompt("Teenagers", "A school adventure.")
    );
  });
});
