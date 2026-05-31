// backend/src/services/ai.service.ts

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Types ───────────────────────────────────────────────────────────────────

interface AIResponse {
  story: string;
  provider: "openai" | "gemini";
  fallbackUsed: boolean;
}

// ─── OpenAI call ─────────────────────────────────────────────────────────────

async function generateWithOpenAI(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create(
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    },
    { timeout: 10000 }
  );

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned an empty response");
  return text;

}

// ─── Gemini call ─────────────────────────────────────────────────────────────

async function generateWithGemini(prompt: string): Promise<string> {
  const model  = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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

export async function generateStory(prompt: string): Promise<AIResponse> {
  // ── Try OpenAI first ──────────────────────────────────────────────────────
  try {
    const story = await generateWithOpenAI(prompt);
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

    console.log("[AI] Falling back to Gemini...");
  }

  // ── Try Gemini as fallback ────────────────────────────────────────────────
  try {
    const story = await generateWithGemini(prompt);
    console.log("[AI] Story generated successfully via Gemini (fallback)");

    return { story, provider: "gemini", fallbackUsed: true };

  } catch (geminiError) {
    console.error(
      "[AI] Gemini also failed:",
      geminiError instanceof Error ? geminiError.message : geminiError
    );

    // Both failed — throw a clean user-facing error
    throw new Error(
      "Story generation failed. Both AI providers are currently unavailable. Please try again later."
    );
  }
}
