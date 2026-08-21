import config from "../config";
import logger from "./logger.util";

/**
 * Generate storyboard image using configured AI provider
 * Supports OpenAI DALL-E and other providers
 */
export async function generateStoryboardImage(
  prompt: string,
  signal?: AbortSignal
): Promise<string | null> {
  // Check if signal is already aborted
  if (signal?.aborted) {
    return null;
  }

  const provider = config.image_generation_provider || "openai";
  const apiKey = config.image_generation_api_key || config.openai_key;

  // Return null if no provider is configured
  if (!provider || !apiKey) {
    logger.warn(
      `[Image Generation] No provider or API key configured. Provider: ${provider}, Has API Key: ${!!apiKey}`
    );
    return null;
  }

  try {
    if (provider === "openai") {
      return await generateWithOpenAI(prompt, apiKey, signal);
    } else if (provider === "stability") {
      return await generateWithStability(prompt, apiKey, signal);
    } else {
      logger.warn(`[Image Generation] Unknown provider: ${provider}`);
      return null;
    }
  } catch (error) {
    logger.error(
      `[Image Generation] Error generating image: ${error instanceof Error ? error.message : String(error)}`
    );
    return null;
  }
}

/**
 * Generate image using OpenAI DALL-E API
 */
async function generateWithOpenAI(
  prompt: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt.slice(0, 4000), // DALL-E has a 4000 char limit
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural",
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error(
        `[OpenAI API Error] ${response.status}: ${errorData.error?.message || "Unknown error"}`
      );
      return null;
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      logger.warn("[OpenAI API] No image URL in response");
      return null;
    }

    return imageUrl;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      logger.info("[Image Generation] Request aborted");
      return null;
    }
    logger.error(`[OpenAI Generation] ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * Generate image using Stability AI API
 */
async function generateWithStability(
  prompt: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<string | null> {
  try {
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
          steps: 30,
        }),
        signal,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error(
        `[Stability AI API Error] ${response.status}: ${JSON.stringify(errorData)}`
      );
      return null;
    }

    const data = await response.json();
    const imageData = data.artifacts?.[0]?.base64;

    if (!imageData) {
      logger.warn("[Stability AI] No image data in response");
      return null;
    }

    return `data:image/png;base64,${imageData}`;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      logger.info("[Image Generation] Request aborted");
      return null;
    }
    logger.error(`[Stability Generation] ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
