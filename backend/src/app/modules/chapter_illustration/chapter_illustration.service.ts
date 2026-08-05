import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import config from "../../config";
import { ImageCacheModel } from "./chapter_illustration.model";
import {
  IChapterIllustrationPayload,
  IChapterIllustrationResult,
} from "./chapter_illustration.interface";
import crypto from "crypto";

const CACHE_TTL_DAYS = 30; // Cache illustrations for 30 days

/**
 * Generate cache key from prompt and style
 */
const generateCacheKey = (prompt: string, style: string): string => {
  const combined = `${prompt}-${style}`;
  return crypto.createHash("sha256").update(combined).digest("hex");
};

/**
 * Build image generation prompt from chapter content
 */
const buildImagePrompt = (payload: IChapterIllustrationPayload): string => {
  if (payload.imagePrompt) {
    return payload.imagePrompt;
  }

  const styleMap: { [key: string]: string } = {
    realistic: "photorealistic, detailed, cinematic",
    illustration: "beautiful book illustration, storybook art style",
    cartoon: "animated cartoon style, colorful, expressive",
    watercolor: "watercolor painting, soft colors, artistic",
    sketch: "pencil sketch, detailed linework, artistic",
  };

  const styleDesc = styleMap[payload.style || "illustration"];

  return [
    `Create a ${styleDesc} for a story chapter.`,
    `Title: "${payload.chapterTitle}"`,
    `Content summary: ${payload.chapterContent.substring(0, 300)}...`,
    payload.storyContext ? `Story context: ${payload.storyContext}` : "",
    "Do not include text, watermarks, or logos.",
  ]
    .filter(Boolean)
    .join("\n");
};

/**
 * Generate image using OpenAI DALL-E API
 */
const generateWithOpenAI = async (
  prompt: string,
  quality: "standard" | "hd" = "standard",
  signal?: AbortSignal
): Promise<string> => {
  const apiKey = config.image_generation_api_key || config.openai_key;

  if (!apiKey) {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      "OpenAI API key not configured for image generation"
    );
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: quality === "hd" ? "hd" : "standard",
      style: "natural",
    }),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      `OpenAI API error: ${error.error?.message || "Unknown error"}`
    );
  }

  const data = await response.json();
  const imageUrl = data.data?.[0]?.url;

  if (!imageUrl) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      "No image URL returned from OpenAI"
    );
  }

  return imageUrl;
};

/**
 * Generate image using Stability AI API
 */
const generateWithStabilityAI = async (
  prompt: string,
  quality: "standard" | "hd" = "standard",
  signal?: AbortSignal
): Promise<string> => {
  const apiKey = process.env.STABILITY_AI_API_KEY;

  if (!apiKey) {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Stability AI API key not configured"
    );
  }

  const response = await fetch(
    "https://api.stability.ai/v1/generate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: quality === "hd" ? 50 : 30,
      }),
      signal,
    }
  );

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Stability AI API error: ${response.statusText}`
    );
  }

  const data = await response.json();
  const imageData = data.artifacts?.[0]?.base64;

  if (!imageData) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      "No image data returned from Stability AI"
    );
  }

  return `data:image/png;base64,${imageData}`;
};

/**
 * Check cache for existing illustration
 */
const checkCache = async (
  cacheKey: string
): Promise<string | null> => {
  try {
    const cached = await ImageCacheModel.findOne({
      cacheKey,
      expiresAt: { $gt: new Date() },
    });

    if (cached) {
      // Update usage count
      cached.usageCount += 1;
      await cached.save();
      return cached.imageUrl;
    }
  } catch (error) {
    // Cache lookup failure is non-critical
    console.warn("Cache lookup failed:", error);
  }

  return null;
};

/**
 * Store image in cache
 */
const cacheImage = async (
  cacheKey: string,
  imageUrl: string,
  prompt: string,
  provider: string
): Promise<void> => {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);

    await ImageCacheModel.create({
      cacheKey,
      imageUrl,
      prompt,
      provider,
      expiresAt,
    });
  } catch (error) {
    // Cache storage failure is non-critical
    console.warn("Cache storage failed:", error);
  }
};

/**
 * Generate illustration for a chapter
 */
const generateChapterIllustration = async (
  payload: IChapterIllustrationPayload,
  signal?: AbortSignal
): Promise<IChapterIllustrationResult> => {
  try {
    // Validate abort signal
    if (signal?.aborted) {
      throw new ApiError(
        httpStatus.REQUEST_TIMEOUT,
        "Request was cancelled"
      );
    }

    const prompt = buildImagePrompt(payload);
    const cacheKey = generateCacheKey(
      prompt,
      payload.style || "illustration"
    );

    // Check cache first
    const cachedUrl = await checkCache(cacheKey);
    if (cachedUrl) {
      return {
        chapterId: payload.chapterId,
        imageUrl: cachedUrl,
        imageStatus: "cached",
        generatedAt: new Date(),
        cacheKey,
      };
    }

    // Generate new image
    const provider = config.image_generation_provider || "openai";
    let imageUrl: string;

    if (provider === "stability") {
      imageUrl = await generateWithStabilityAI(
        prompt,
        payload.quality || "standard",
        signal
      );
    } else {
      // Default to OpenAI
      imageUrl = await generateWithOpenAI(
        prompt,
        payload.quality || "standard",
        signal
      );
    }

    // Cache the generated image
    await cacheImage(cacheKey, imageUrl, prompt, provider);

    return {
      chapterId: payload.chapterId,
      imageUrl,
      imageStatus: "generated",
      generatedAt: new Date(),
      cacheKey,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Image generation failed:", errorMsg);

    // Return failed result instead of throwing to enable fallback
    return {
      chapterId: payload.chapterId,
      imageUrl: "",
      imageStatus: "failed",
      generatedAt: new Date(),
    };
  }
};

/**
 * Generate illustrations for multiple chapters (batch)
 */
const generateBatchIllustrations = async (
  payloads: IChapterIllustrationPayload[],
  signal?: AbortSignal
): Promise<IChapterIllustrationResult[]> => {
  const results: IChapterIllustrationResult[] = [];

  for (const payload of payloads) {
    if (signal?.aborted) {
      break;
    }

    const result = await generateChapterIllustration(payload, signal);
    results.push(result);

    // Add small delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
};

/**
 * Clear expired cache entries
 */
const clearExpiredCache = async (): Promise<number> => {
  try {
    const result = await ImageCacheModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return result.deletedCount || 0;
  } catch (error) {
    console.error("Cache cleanup failed:", error);
    return 0;
  }
};

export const ChapterIllustrationService = {
  generateChapterIllustration,
  generateBatchIllustrations,
  checkCache,
  cacheImage,
  clearExpiredCache,
};
