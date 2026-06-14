// backend/src/services/ai.service.ts

import { validateAndFormatPrompt, validateOutput } from "../utils/promptSecurity";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

let openai: OpenAI | null = null;
let anthropic: Anthropic | null = null;
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export function getOpenAIClient(): OpenAI {
  if (!openai) {
    const key = process.env.OPEN_AI_KEY || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("OpenAI API key is required but was not provided. Please set OPEN_AI_KEY environment variable.");
    }
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

export function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error("Anthropic API key is required but was not provided. Please set ANTHROPIC_API_KEY environment variable.");
    }
    anthropic = new Anthropic({ apiKey: key });
  }
  return anthropic;
}

export const GEMINI_MODEL = "gemini-2.5-flash";
export const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";
export const OPENAI_MODEL = "gpt-4";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AIResponse {
  story: string;
  provider: "openai" | "gemini" | "anthropic";
  fallbackUsed: boolean;
}

// ─── OpenAI call ─────────────────────────────────────────────────────────────

async function generateWithOpenAI(prompt: string): Promise<string> {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create(
    {
      model: OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    },
    { timeout: 10000 }
  );

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned an empty response");
  return text;
}

// ─── Anthropic call ──────────────────────────────────────────────────────────

async function generateWithAnthropic(prompt: string): Promise<string> {
  const client = getAnthropicClient();
  const response = await client.messages.create(
    {
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    },
    { timeout: 10000 }
  );

  const textBlock = response.content.find((block) => block.type === "text");
  const text = textBlock && "text" in textBlock ? textBlock.text : "";
  if (!text) throw new Error("Anthropic returned an empty response");
  return text;
}

// ─── Gemini call ─────────────────────────────────────────────────────────────

async function generateWithGemini(prompt: string): Promise<string> {
  const model  = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  const text   = result.response.text();

  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

// ─── Helper: is this error worth falling back on? ────────────────────────────

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return true;

  const msg = error.message.toLowerCase();

  // Rate limits, timeouts, server errors → fallback
  if (msg.includes("rate limit"))      return true;
  if (msg.includes("timeout"))         return true;
  if (msg.includes("503") ||
      msg.includes("502") ||
      msg.includes("500"))             return true;
  if (msg.includes("empty response"))  return true;

  // Bad API key → don't bother falling back (won't help)
  if (msg.includes("401") ||
      msg.includes("invalid api key")) return false;

  return true; // fallback by default
}

// ─── Main exported function ───────────────────────────────────────────────────

export async function generateStory(prompt: string, provider?: string): Promise<AIResponse> {
  // ── SECURITY LAYER: Validate and wrap input ─────────────────────────
  const securePrompt = validateAndFormatPrompt(prompt);

  const chosenProvider = provider?.toLowerCase();
  let didFallbackToGemini = false;

  if (chosenProvider === "anthropic" || chosenProvider === "claude") {
    // ── Try Anthropic first ──────────────────────────────────────────────────
    try {
      let story = await generateWithAnthropic(securePrompt);
      story = validateOutput(story); // SECURITY LAYER: Validate output
      console.log("[AI] Story generated successfully via Anthropic");
      return { story, provider: "anthropic", fallbackUsed: false };
    } catch (anthropicError) {
      console.warn(
        "[AI] Anthropic failed:",
        anthropicError instanceof Error ? anthropicError.message : anthropicError
      );

      if (!isRetryableError(anthropicError)) {
        throw new Error(
          "Anthropic request failed with a non-retryable error. Please check your API key."
        );
      }
      didFallbackToGemini = true;
      console.log("[AI] Falling back to Gemini...");
    }
  } else if (chosenProvider === "openai" || !chosenProvider) {
    // ── Try OpenAI first ──────────────────────────────────────────────────────
    try {
      let story = await generateWithOpenAI(securePrompt);
      story = validateOutput(story); // SECURITY LAYER: Validate output
      console.log("[AI] Story generated successfully via OpenAI");

      return { story, provider: "openai", fallbackUsed: false };

    } catch (openAIError) {
      console.warn(
        "[AI] OpenAI failed:",
        openAIError instanceof Error ? openAIError.message : openAIError
      );

      // Only fall back if the error type warrants it
      if (!isRetryableError(openAIError)) {
        throw new Error(
          "OpenAI request failed with a non-retryable error. Please check your API key."
        );
      }

      didFallbackToGemini = true;
      console.log("[AI] Falling back to Gemini...");
    }
  } else if (chosenProvider === "gemini") {
    // Skip OpenAI/Anthropic blocks
  } else {
    // Unknown provider
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  // ── Try Gemini as fallback / direct ───────────────────────────────────────
  try {
    let story = await generateWithGemini(securePrompt);
    story = validateOutput(story); // SECURITY LAYER: Validate output
    console.log(`[AI] Story generated successfully via Gemini (${didFallbackToGemini ? "fallback" : "direct"})`);

    return { story, provider: "gemini", fallbackUsed: didFallbackToGemini };

  } catch (geminiError) {
    console.error(
      "[AI] Gemini also failed:",
      geminiError instanceof Error ? geminiError.message : geminiError
    );

    // All failed — throw a clean user-facing error
    throw new Error(
      "Story generation failed. All AI providers are currently unavailable. Please try again later."
    );
  }
}
