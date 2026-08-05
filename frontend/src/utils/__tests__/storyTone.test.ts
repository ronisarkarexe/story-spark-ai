import { describe, it, expect } from "vitest";
import {
  tonePresets,
  buildTonePrompt,
  regenerateWithTone,
} from "../storyTone";

describe("tonePresets", () => {
  it("contains exactly 6 presets", () => {
    expect(tonePresets).toHaveLength(6);
  });

  it("includes Humorous preset with correct id and description", () => {
    const preset = tonePresets.find((p) => p.id === "humorous");
    expect(preset).toBeDefined();
    expect(preset?.name).toBe("Humorous");
    expect(preset?.description.length).toBeGreaterThan(0);
  });

  it("includes Dark preset with correct id and description", () => {
    const preset = tonePresets.find((p) => p.id === "dark");
    expect(preset).toBeDefined();
    expect(preset?.name).toBe("Dark");
  });

  it("includes Inspirational preset with correct id", () => {
    const preset = tonePresets.find((p) => p.id === "inspirational");
    expect(preset).toBeDefined();
    expect(preset?.name).toBe("Inspirational");
  });

  it("includes Suspenseful preset with correct id", () => {
    const preset = tonePresets.find((p) => p.id === "suspenseful");
    expect(preset).toBeDefined();
    expect(preset?.name).toBe("Suspenseful");
  });

  it("includes Emotional preset with correct id", () => {
    const preset = tonePresets.find((p) => p.id === "emotional");
    expect(preset).toBeDefined();
    expect(preset?.name).toBe("Emotional");
  });

  it("includes Dramatic preset with correct id", () => {
    const preset = tonePresets.find((p) => p.id === "dramatic");
    expect(preset).toBeDefined();
    expect(preset?.name).toBe("Dramatic");
  });

  it("all presets have a non-empty description", () => {
    for (const preset of tonePresets) {
      expect(preset.description.length).toBeGreaterThan(0);
    }
  });
});

describe("buildTonePrompt", () => {
  it("returns a string containing the tone name", () => {
    const result = buildTonePrompt("Humorous", "A story about cats.");
    expect(result).toContain("Humorous");
  });

  it("returns a string containing the original story text", () => {
    const story = "Once upon a time there was a dragon.";
    const result = buildTonePrompt("Dark", story);
    expect(result).toContain(story);
  });

  it("works for all tone types", () => {
    const tones = [
      "Humorous",
      "Dark",
      "Inspirational",
      "Suspenseful",
      "Emotional",
      "Dramatic",
    ] as const;
    for (const tone of tones) {
      const result = buildTonePrompt(tone, "A sample story.");
      expect(result).toContain(tone);
      expect(result).toContain("A sample story.");
    }
  });

  it("returns different prompts for different tones", () => {
    const story = "A brave knight battles a dragon.";
    const humorous = buildTonePrompt("Humorous", story);
    const dark = buildTonePrompt("Dark", story);
    expect(humorous).not.toBe(dark);
  });
});

describe("regenerateWithTone", () => {
  it("returns the same output as buildTonePrompt", () => {
    const tone = "Suspenseful";
    const story = "A mysterious letter arrived at midnight.";
    expect(regenerateWithTone(tone, story)).toBe(buildTonePrompt(tone, story));
  });

  it("works for Emotional tone", () => {
    const story = "The reunion brought tears to everyone's eyes.";
    expect(regenerateWithTone("Emotional", story)).toContain("Emotional");
    expect(regenerateWithTone("Emotional", story)).toContain(story);
  });
});
