jest.mock("../utils/storyboard_image_generation", () => ({
  generateStoryboardImage: jest.fn(),
}));

import { generateStoryboardImage } from "../utils/storyboard_image_generation";
import {
  buildCharacterPortraitPrompt,
  generateCharacterPortrait,
} from "../utils/character_portrait_generation";

const mockGenerateStoryboardImage =
  generateStoryboardImage as jest.MockedFunction<
    typeof generateStoryboardImage
  >;

describe("Character portrait generation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buildCharacterPortraitPrompt", () => {
    it("builds a detailed prompt from character attributes", () => {
      const prompt = buildCharacterPortraitPrompt({
        name: "Aria Vale",
        role: "Protagonist",
        age: 27,
        personality: "Brave and compassionate",
        appearance: "Long silver hair and green eyes",
        background: "Raised in a remote mountain village",
        traits: ["loyal", "curious"],
      });

      expect(prompt).toContain(
        "Create a high-quality fictional character portrait of Aria Vale."
      );
      expect(prompt).toContain("Role: Protagonist");
      expect(prompt).toContain("Age: 27");
      expect(prompt).toContain(
        "Personality: Brave and compassionate"
      );
      expect(prompt).toContain(
        "Appearance: Long silver hair and green eyes"
      );
      expect(prompt).toContain(
        "Background: Raised in a remote mountain village"
      );
      expect(prompt).toContain("Traits: loyal, curious");
      expect(prompt).toContain("no text, no watermark");
    });

    it("omits optional attributes that are not provided", () => {
      const prompt = buildCharacterPortraitPrompt({
        name: "Kai",
      });

      expect(prompt).toContain(
        "Create a high-quality fictional character portrait of Kai."
      );
      expect(prompt).not.toContain("Role:");
      expect(prompt).not.toContain("Age:");
      expect(prompt).not.toContain("Personality:");
      expect(prompt).not.toContain("Appearance:");
      expect(prompt).not.toContain("Background:");
      expect(prompt).not.toContain("Traits:");
    });
  });

  describe("generateCharacterPortrait", () => {
    it("uses the existing image-generation infrastructure", async () => {
      mockGenerateStoryboardImage.mockResolvedValue(
        "data:image/png;base64,generated-portrait"
      );

      const result = await generateCharacterPortrait({
        name: "Aria Vale",
        role: "Protagonist",
        traits: ["brave"],
      });

      expect(mockGenerateStoryboardImage).toHaveBeenCalledTimes(1);

      const generatedPrompt =
        mockGenerateStoryboardImage.mock.calls[0][0];

      expect(generatedPrompt).toContain("Aria Vale");
      expect(generatedPrompt).toContain("Role: Protagonist");
      expect(generatedPrompt).toContain("Traits: brave");

      expect(result).toBe(
        "data:image/png;base64,generated-portrait"
      );
    });

    it("returns null when the image provider cannot generate a portrait", async () => {
      mockGenerateStoryboardImage.mockResolvedValue(null);

      const result = await generateCharacterPortrait({
        name: "Aria Vale",
      });

      expect(result).toBeNull();
    });
  });
});
