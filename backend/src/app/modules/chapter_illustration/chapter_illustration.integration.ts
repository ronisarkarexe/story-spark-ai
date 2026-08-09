import { ChapterIllustrationService } from "./chapter_illustration.service";
import { IChapterIllustrationPayload } from "./chapter_illustration.interface";

/**
 * Integration hooks for chapter illustration with story creation workflows
 * Provides optional automatic illustration generation when chapters are created
 */

/**
 * Generate illustration when a chapter is created (non-blocking)
 * Can be called asynchronously without waiting for completion
 */
export async function generateIllustrationForChapter(payload: {
  chapterId: string;
  chapterTitle: string;
  chapterContent: string;
  storyContext?: string;
  style?: "realistic" | "illustration" | "cartoon" | "watercolor" | "sketch";
  quality?: "standard" | "hd";
}): Promise<void> {
  try {
    const illustrationPayload: IChapterIllustrationPayload = {
      chapterId: payload.chapterId,
      chapterTitle: payload.chapterTitle,
      chapterContent: payload.chapterContent,
      storyContext: payload.storyContext,
      style: payload.style || "illustration",
      quality: payload.quality || "standard",
    };

    // Generate illustration in background without blocking chapter creation
    // In production, this should be handled by a task queue
    ChapterIllustrationService.generateChapterIllustration(illustrationPayload)
      .then((result) => {
        console.log(
          `[Chapter Illustration] Generated for chapter ${payload.chapterId}:`,
          result.imageStatus
        );
      })
      .catch((error) => {
        console.error(
          `[Chapter Illustration] Failed for chapter ${payload.chapterId}:`,
          error
        );
      });
  } catch (error) {
    console.error(
      "[Chapter Illustration Integration] Error in async generation:",
      error
    );
    // Don't throw - integration failures should not impact chapter creation
  }
}

/**
 * Generate illustrations for multiple chapters in sequence
 * Useful for batch chapter creation or importing stories
 */
export async function generateIllustrationsForChapters(
  chapters: Array<{
    chapterId: string;
    chapterTitle: string;
    chapterContent: string;
    storyContext?: string;
  }>,
  options?: {
    style?: "realistic" | "illustration" | "cartoon" | "watercolor" | "sketch";
    quality?: "standard" | "hd";
    signal?: AbortSignal;
  }
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  try {
    const payloads: IChapterIllustrationPayload[] = chapters.map((chapter) => ({
      ...chapter,
      style: options?.style || "illustration",
      quality: options?.quality || "standard",
    }));

    const generatedResults =
      await ChapterIllustrationService.generateBatchIllustrations(
        payloads,
        options?.signal
      );

    // Map results by chapter ID for easy access
    for (const result of generatedResults) {
      if (result.imageStatus !== "failed" && result.imageUrl) {
        results.set(result.chapterId, result.imageUrl);
      }
    }

    return results;
  } catch (error) {
    console.error(
      "[Chapter Illustration Integration] Batch generation error:",
      error
    );
    return results; // Return partial results if available
  }
}

/**
 * Check if an illustration exists in cache for a chapter
 * Useful for avoiding redundant generations
 */
export async function checkChapterIllustrationCache(
  chapterTitle: string,
  chapterContent: string,
  style: string = "illustration"
): Promise<string | null> {
  try {
    // Build the same prompt that would be used for generation
    const prompt = buildChapterPrompt(chapterTitle, chapterContent);
    const cacheKey = generateCacheKeyFromPrompt(prompt, style);

    return await ChapterIllustrationService.checkCache(cacheKey);
  } catch (error) {
    console.warn(
      "[Chapter Illustration Integration] Cache check error:",
      error
    );
    return null;
  }
}

/**
 * Build illustration prompt from chapter data
 */
function buildChapterPrompt(chapterTitle: string, chapterContent: string): string {
  return [
    `Create a beautiful book illustration for a story chapter.`,
    `Title: "${chapterTitle}"`,
    `Content summary: ${chapterContent.substring(0, 300)}...`,
    "Do not include text, watermarks, or logos.",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Generate cache key from prompt and style
 */
function generateCacheKeyFromPrompt(prompt: string, style: string): string {
  const crypto = require("crypto");
  const combined = `${prompt}-${style}`;
  return crypto.createHash("sha256").update(combined).digest("hex");
}

/**
 * Configuration helper for chapter illustration settings
 */
export const ChapterIllustrationConfig = {
  /**
   * Check if illustration generation is enabled
   */
  isEnabled(): boolean {
    try {
      const config = require("../../config").default;
      return !!(config.image_generation_provider && config.image_generation_api_key);
    } catch {
      return false;
    }
  },

  /**
   * Get current provider
   */
  getProvider(): string {
    try {
      const config = require("../../config").default;
      return config.image_generation_provider || "openai";
    } catch {
      return "openai";
    }
  },

  /**
   * Get cache TTL in days
   */
  getCacheTTLDays(): number {
    return 30; // Default 30 days
  },

  /**
   * Get rate limit per hour
   */
  getRateLimitPerHour(): number {
    return 50; // Default 50 requests per hour
  },
};
