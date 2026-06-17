import { Request, Response } from "express";
import httpStatus from "http-status";
import { PromptAnalysisService } from "./prompt_analysis.service";

/**
 * UNIT TESTS FOR PROMPT ANALYSIS SERVICE
 * 
 * Run with: npm test -- prompt_analysis.service.test.ts
 */

describe("PromptAnalysisService", () => {
  describe("analyzePrompt", () => {
    it("should analyze a valid prompt and return creativity score", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A young wizard discovers a hidden library containing spells of forgotten ages.",
        language: "English",
      });

      expect(result).toHaveProperty("creativityScore");
      expect(result.creativityScore).toBeGreaterThanOrEqual(0);
      expect(result.creativityScore).toBeLessThanOrEqual(100);
      expect(result).toHaveProperty("enhancedPrompt");
      expect(result).toHaveProperty("improvements");
      expect(result.improvements.length).toBeGreaterThanOrEqual(1);
    });

    it("should return keywords from the prompt", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A brave knight fights a dragon in an ancient castle",
      });

      expect(result.keywords).toBeDefined();
      expect(result.keywords.length).toBeGreaterThan(0);
      expect(result.keywords).toContain("knight");
      expect(result.keywords).toContain("dragon");
    });

    it("should calculate sentiment scores", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A happy princess dances in a beautiful magical kingdom",
      });

      expect(result.sentimentScore).toBeDefined();
      expect(result.sentimentScore.positive).toBeGreaterThan(0);
      expect(result.sentimentScore.positive + 
              result.sentimentScore.neutral + 
              result.sentimentScore.negative).toBeCloseTo(1, 1);
    });

    it("should determine complexity correctly", async () => {
      // Simple prompt
      const simpleResult = await PromptAnalysisService.analyzePrompt({
        prompt: "A cat sits",
      });
      expect(simpleResult.complexity).toBe("simple");

      // Complex prompt
      const complexResult = await PromptAnalysisService.analyzePrompt({
        prompt: "In a sprawling, multi-dimensional universe spanning countless galaxies, a brilliant yet troubled scientist discovers a revolutionary technology that could either save humanity or destroy it entirely; now she must navigate political intrigue, personal sacrifice, and the fundamental question of whether some knowledge should remain hidden.",
      });
      expect(complexResult.complexity).toBe("complex");
    });

    it("should reject prompts shorter than 10 characters", async () => {
      expect(async () => {
        await PromptAnalysisService.analyzePrompt({
          prompt: "short",
        });
      }).rejects.toThrow();
    });

    it("should reject prompts longer than 2000 characters", async () => {
      const longPrompt = "a".repeat(2001);
      expect(async () => {
        await PromptAnalysisService.analyzePrompt({
          prompt: longPrompt,
        });
      }).rejects.toThrow();
    });

    it("should handle different languages", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "Un joven mago descubre una biblioteca escondida",
        language: "Spanish",
      });

      expect(result).toHaveProperty("creativityScore");
      expect(result.keywords.length).toBeGreaterThan(0);
    });

    it("should estimate generation time correctly", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A wizard discovers a library. This is a test prompt with multiple words.",
      });

      expect(result.estimatedGenerationTime).toBeGreaterThan(0);
      expect(result.estimatedGenerationTime).toBeLessThanOrEqual(300); // Max 5 minutes
    });

    it("should include recommendations with impact levels", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A character does something interesting in a place",
      });

      expect(result.recommendations.length).toBeGreaterThan(0);
      result.recommendations.forEach((rec) => {
        expect(rec).toHaveProperty("title");
        expect(rec).toHaveProperty("description");
        expect(rec).toHaveProperty("impact");
        expect(["high", "medium", "low"]).toContain(rec.impact);
      });
    });
  });

  describe("Keyword Extraction", () => {
    it("should filter stop words", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "The wizard and the dragon and the princess",
      });

      // "the" and "and" should be filtered out
      expect(result.keywords).toContain("wizard");
      expect(result.keywords).toContain("dragon");
      expect(result.keywords).not.toContain("the");
      expect(result.keywords).not.toContain("and");
    });

    it("should rank keywords by frequency", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "magic magic magic crystal crystal adventure",
      });

      const magicIndex = result.keywords.indexOf("magic");
      const crystalIndex = result.keywords.indexOf("crystal");

      // Magic should appear before crystal (higher frequency)
      if (magicIndex !== -1 && crystalIndex !== -1) {
        expect(magicIndex).toBeLessThan(crystalIndex);
      }
    });
  });

  describe("Sentiment Analysis", () => {
    it("should detect positive sentiment correctly", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A happy, wonderful, beautiful princess experiences joy and love",
      });

      expect(result.sentimentScore.positive).toBeGreaterThan(
        result.sentimentScore.negative
      );
    });

    it("should detect negative sentiment correctly", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A terrible, evil villain with dark intentions and hatred",
      });

      expect(result.sentimentScore.negative).toBeGreaterThan(
        result.sentimentScore.positive
      );
    });

    it("should detect neutral sentiment", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A person walks in a forest during the morning",
      });

      expect(result.sentimentScore.neutral).toBeGreaterThan(0.5);
    });
  });

  describe("Creativity Score Calculation", () => {
    it("should give higher score to longer prompts in optimal range", async () => {
      const shortResult = await PromptAnalysisService.analyzePrompt({
        prompt: "A wizard and a dragon",
      });

      const longResult = await PromptAnalysisService.analyzePrompt({
        prompt: "A brilliant young wizard with ancient magical powers discovers an enchanted dragon living in a hidden mountain. Together they must save their realm from darkness.",
      });

      expect(longResult.creativityScore).toBeGreaterThan(shortResult.creativityScore);
    });

    it("should give higher score to prompts with specific details", async () => {
      const vagueResult = await PromptAnalysisService.analyzePrompt({
        prompt: "Someone does something in a place",
      });

      const detailedResult = await PromptAnalysisService.analyzePrompt({
        prompt: "Elena, a resourceful navigator, discovers an underground city beneath the Arctic ice",
      });

      expect(detailedResult.creativityScore).toBeGreaterThan(vagueResult.creativityScore);
    });

    it("should recognize intrigue and question words", async () => {
      const basicResult = await PromptAnalysisService.analyzePrompt({
        prompt: "A wizard lives in a tower",
      });

      const intriguingResult = await PromptAnalysisService.analyzePrompt({
        prompt: "What happens when a wizard discovers the tower contains a portal to another dimension?",
      });

      expect(intriguingResult.creativityScore).toBeGreaterThan(basicResult.creativityScore);
    });
  });

  describe("Enhanced Prompt Generation", () => {
    it("should return a different enhanced prompt", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A wizard finds a library",
      });

      expect(result.enhancedPrompt).not.toBe(result.prompt);
      expect(result.enhancedPrompt.length).toBeGreaterThan(result.prompt.length);
    });

    it("should maintain the core theme in enhancement", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A pirate searches for treasure",
      });

      const enhancedLower = result.enhancedPrompt.toLowerCase();
      expect(enhancedLower).toContain("pirate");
      expect(enhancedLower).toContain("treasure");
    });

    it("should add descriptive language", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A character in a place does something",
      });

      // Enhanced should have more descriptive words
      expect(result.enhancedPrompt.split(" ").length).toBeGreaterThan(
        result.prompt.split(" ").length
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle prompts with only numbers", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "1234567890 numbers test",
      });

      expect(result).toHaveProperty("creativityScore");
    });

    it("should handle prompts with special characters", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A wizard @#$% discovers a library!!! ???",
      });

      expect(result).toHaveProperty("creativityScore");
    });

    it("should handle prompts with multiple languages mixed", async () => {
      const result = await PromptAnalysisService.analyzePrompt({
        prompt: "A wizard (魔法使い) discovers a library (図書館)",
      });

      expect(result).toHaveProperty("creativityScore");
    });

    it("should handle very long but well-structured prompts", async () => {
      const longPrompt =
        "In the year 2150, on a space station orbiting Neptune, " +
        "Commander Sarah Chen discovers an ancient alien artifact. " +
        "She must choose between reporting it to Earth authorities or investigating it herself. " +
        "The fate of humanity hangs in the balance as she uncovers secrets that could rewrite history.";

      const result = await PromptAnalysisService.analyzePrompt({
        prompt: longPrompt,
      });

      expect(result.creativityScore).toBeGreaterThan(50);
    });
  });
});
