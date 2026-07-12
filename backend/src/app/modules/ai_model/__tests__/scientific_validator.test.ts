import { validateScientificContent } from "../scientific_validator";

describe("Scientific Fact-Checking / Validation Layer", () => {
  describe("Spider Classification Rule", () => {
    it("should flag when a spider is directly called an insect", async () => {
      const text = "Suddenly, the boy saw a spider. He knew that spiders are small insects with many legs.";
      const warnings = await validateScientificContent(text);
      expect(warnings.length).toBe(1);
      expect(warnings[0].detectedIssue).toBe("Spiders classified as insects");
      expect(warnings[0].suggestedCorrection).toContain("arachnids");
    });

    it("should flag when insects are listed as including spiders", async () => {
      const text = "The garden was filled with insects like spiders and butterflies.";
      const warnings = await validateScientificContent(text);
      expect(warnings.length).toBe(1);
      expect(warnings[0].detectedIssue).toBe("Spiders classified as insects");
    });

    it("should flag when spiders are grouped as 'other insects'", async () => {
      const text = "He loved to collect spiders and other insects in his jar.";
      const warnings = await validateScientificContent(text);
      expect(warnings.length).toBe(1);
      expect(warnings[0].detectedIssue).toBe("Spiders classified as insects");
    });

    it("should NOT flag when the statement correctly negates the misconception", async () => {
      const text = "Spiders are not insects; they are actually arachnids.";
      const warnings = await validateScientificContent(text);
      expect(warnings.length).toBe(0);
    });

    it("should NOT flag when unlike is used to separate spiders and insects", async () => {
      const text = "Unlike insects, spiders have eight legs instead of six.";
      const warnings = await validateScientificContent(text);
      expect(warnings.length).toBe(0);
    });
  });

  describe("Insects Class Size Rule", () => {
    it("should flag when insects are described as 'one of the largest' classes", async () => {
      const text = "Insects are one of the largest classes of animals on Earth.";
      const warnings = await validateScientificContent(text);
      expect(warnings.length).toBe(1);
      expect(warnings[0].detectedIssue).toBe("Insects described as 'one of the largest' classes");
    });

    it("should flag when insects are described as 'among the largest' groups", async () => {
      const text = "Among the largest groups of animals are the insects, flying everywhere.";
      const warnings = await validateScientificContent(text);
      expect(warnings.length).toBe(1);
      expect(warnings[0].detectedIssue).toBe("Insects described as 'one of the largest' classes");
    });

    it("should NOT flag when insects are correctly described as the absolute largest class", async () => {
      const text = "Insects represent the largest class of animals by species count.";
      const warnings = await validateScientificContent(text);
      expect(warnings.length).toBe(0);
    });
  });

  describe("Extensibility and multiple flags", () => {
    it("should return multiple warnings if a story contains multiple misconceptions", async () => {
      const text = "A spider is an insect. Also, insects are one of the largest groups of animals.";
      const warnings = await validateScientificContent(text);
      expect(warnings.length).toBe(2);
      expect(warnings[0].detectedIssue).toBe("Spiders classified as insects");
      expect(warnings[1].detectedIssue).toBe("Insects described as 'one of the largest' classes");
    });
  });
});
