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
export interface IBatchIllustrationResult {
  illustrations: Map<string, string>;
  failedChapterIds: string[];
  failedCount: number;
  successCount: number;
}

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
): Promise<IBatchIllustrationResult> {
  const illustrations = new Map<string, string>();
  const failedChapterIds: string[] = [];

  const payloads: IChapterIllustrationPayload[] = chapters.map((chapter) => ({
    ...chapter,
    style: options?.style || "illustration",
    quality: options?.quality || "standard",
  }));

  // Use Promise.allSettled so one chapter failure doesn't cancel all others
  const settledResults = await Promise.allSettled(
    payloads.map((payload) =>
      ChapterIllustrationService.generateChapterIllustration(payload)
    )
  );

  for (let i = 0; i < settledResults.length; i++) {
    const settled = settledResults[i];
    const chapterId = chapters[i].chapterId;

    if (settled.status === "fulfilled") {
      const result = settled.value;
      if (result.imageStatus !== "failed" && result.imageUrl) {
        illustrations.set(chapterId, result.imageUrl);
      } else {
        console.warn(
          `[Chapter Illustration Integration] Chapter ${chapterId} returned failed status`
        );
        failedChapterIds.push(chapterId);
      }
    } else {
      console.error(
        `[Chapter Illustration Integration] Chapter ${chapterId} failed:`,
        settled.reason
      );
      failedChapterIds.push(chapterId);
    }
  }

  const successCount = illustrations.size;
  const failedCount = failedChapterIds.length;

  if (failedCount > 0) {
    console.warn(
      `[Chapter Illustration Integration] Partial failure: ${successCount} succeeded, ${failedCount} failed`,
      { failedChapterIds }
    );
  }

  return {
    illustrations,
    failedChapterIds,
    failedCount,
    successCount,
  };
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
