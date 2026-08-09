// backend/src/services/ai.service.ts

import { validateAndFormatPrompt, validateOutput } from "../utils/promptSecurity";
import { buildStoryPrompt, PromptOptions } from "../utils/promptBuilder";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { aiLimit } from "../utils/aiLimiter";
import { StoryCache } from "../models/storyCache.model";
import { assertAIProviderConfigured } from "../config";
import { getNextApiKey } from "./apiKeyRotationService";


let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;
let anthropic: Anthropic | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY || getNextApiKey();
    if (!key) {
      throw new Error("Gemini API key is required. Set GEMINI_API_KEY or AI_API_KEYS.");
    }
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

export function getOpenAIClient(): OpenAI {
  if (!openai) {
    const key = process.env.OPEN_AI_KEY || process.env.OPENAI_API_KEY || getNextApiKey();
    if (!key) {
      throw new Error("OpenAI API key is required. Set OPEN_AI_KEY or AI_API_KEYS.");
    }
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

export function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    const key = process.env.ANTHROPIC_API_KEY || getNextApiKey();
    if (!key) {
      throw new Error("Anthropic API key is required. Set ANTHROPIC_API_KEY or AI_API_KEYS.");
    }
    anthropic = new Anthropic({ apiKey: key });
  }
  return anthropic;
}

export const GEMINI_MODEL = "gemini-2.5-flash";
export const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";
export const OPENAI_MODEL = "gpt-4o-mini"; 

// ─── Types ───────────────────────────────────────────────────────────────────

interface AIResponse {
  story: string; // This will now contain the stringified JSON payload
  provider: "openai" | "gemini" | "anthropic";
  fallbackUsed: boolean;
}

// ─── OpenAI call ─────────────────────────────────────────────────────────────

async function generateWithOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const client = getOpenAIClient();
  const response = await aiLimit(() => client.chat.completions.create(
    {
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    },
    { timeout: 60000 }
  ));

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned an empty response");
  return text;
}

// ─── Anthropic call ──────────────────────────────────────────────────────────

async function generateWithAnthropic(systemPrompt: string, userPrompt: string): Promise<string> {
  const client = getAnthropicClient();
  const response = await aiLimit(() => client.messages.create(
    {
      model: CLAUDE_MODEL,
      system: systemPrompt,
      max_tokens: 1500,
      messages: [{ role: "user", content: userPrompt }],
    },
    { timeout: 60000 }
  ));

  const textBlock = response.content.find((block: any) => block.type === "text");
  const text = textBlock && "text" in textBlock ? textBlock.text : "";
  if (!text) throw new Error("Anthropic returned an empty response");
  return text;
}

// ─── Gemini call ─────────────────────────────────────────────────────────────

async function generateWithGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const client = getGeminiClient();
  
  // Use systemInstruction for gemini-2.5 models
  const model = client.getGenerativeModel({ 
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt 
  });
  
  const result = await aiLimit(() => model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    }
  }));
  
  const text = result.response.text();
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

// ─── Helper ────────────────────────────

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

  // Bad API key -> don't bother with fallback since it won't help
  if (msg.includes("401") ||
      msg.includes("invalid api key")) return false;

  return true; // fallback by default
}

// ─── Main exported function ───────────────────────────────────────────────────

export async function generateStory(
  prompt: string, 
  provider?: string, 
  options?: PromptOptions
): Promise<AIResponse> {

  assertAIProviderConfigured(); 

  // ── Security layer: validate and wrap input ─────────────────────────
  const securePrompt = validateAndFormatPrompt(prompt);

  // ── Prompt builder: morph into structured AI instructions ───────
  const { systemPrompt, userPrompt } = buildStoryPrompt(securePrompt, options);

  // ── Cache Lookup Step ───────────────────────────────────────────────
  // Combine prompt and key options to build a unique cache signature
  const cacheKey = `${securePrompt.trim()}_${options?.genre || "default"}_${options?.length || "medium"}`;
  
  try {
    const existingCache = await StoryCache.findOne({ promptKey: cacheKey });
    if (existingCache) {
      console.log("[CACHE HIT] Serving story instantly from MongoDB cache");
      return {
        story: existingCache.storyData,
        provider: existingCache.provider as "openai" | "gemini" | "anthropic",
        fallbackUsed: false
      };
    }
  } catch (cacheError) {
    // If the database cache check fails for any strange reason, log it but don't crash the generation flow
    console.warn("[CACHE ERROR] Failed to query cache:", cacheError);
  }

  const chosenProvider = provider?.toLowerCase();
  let didFallbackToGemini = false;
  let finalResult: AIResponse | null = null;

  if (chosenProvider === "anthropic" || chosenProvider === "claude") {
    // ── Try Anthropic first ──────────────────────────────────────────────────
    try {
      let story = await generateWithAnthropic(systemPrompt, userPrompt);
      story = validateOutput(story); // Security layer: validate output
      console.log("[AI] Story generated successfully via Anthropic");
      finalResult = { story, provider: "anthropic", fallbackUsed: false };
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
      let story = await generateWithOpenAI(systemPrompt, userPrompt);
      story = validateOutput(story); // Security layer: validate output
      console.log("[AI] Story generated successfully via OpenAI");
      finalResult = { story, provider: "openai", fallbackUsed: false };

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
      console.log("[AI] Falling back to Gemini.");
    }
  } else if (chosenProvider === "gemini") {
    // Skip OpenAI/Anthropic blocks
  } else {
    // Unknown provider
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  // ── Try Gemini as fallback / direct ───────────────────────────────────────
  if (!finalResult) {
    try {
      let story = await generateWithGemini(systemPrompt, userPrompt);
      story = validateOutput(story); // Security layer: validate output
      console.log(`[AI] Story generated successfully via Gemini (${didFallbackToGemini ? "fallback" : "direct"})`);
      finalResult = { story, provider: "gemini", fallbackUsed: didFallbackToGemini };

    } catch (geminiError) {
      console.error(
        "[AI] Gemini also failed.",
        geminiError instanceof Error ? geminiError.message : geminiError
      );

      // All failed — throw a clean user-facing error
      throw new Error(
        "Story generation failed. All AI providers are currently unavailable. Please try again later."
      );
    }
  }

  // ── Populate Cache Before Returning ────────────────────────────
  try {
    await StoryCache.create({
      promptKey: cacheKey,
      provider: finalResult.provider,
      storyData: finalResult.story
    });
    console.log("[CACHE STORED] New AI story cached to MongoDB successfully");
  } catch (saveCacheError) {
    console.warn("[CACHE ERROR] Failed to save story generation to cache:", saveCacheError);
  }

  return finalResult;
}

// ─── Reader Room: multi-persona feedback ──────────────────────────────────

export interface ReaderPersona {
  name: string;
  audienceType: string;
  description: string;
}

export interface WeakSection {
  chapterIndex: number;
  chapterTitle: string;
  issue: string;
  rewriteSuggestion: string;
}

export interface ReaderRoomFeedback {
  persona: ReaderPersona;
  engagement: {
    summary: string;
    dropOffChapters: number[];
    mostInvestedChapters: number[];
  };
  clarity: {
    summary: string;
    confusingMoments: string[];
  };
  emotionalImpact: {
    summary: string;
    highs: string[];
    lows: string[];
  };
  pacing: {
    summary: string;
    tooSlowChapters: number[];
    tooFastChapters: number[];
  };
  ending: {
    satisfying: boolean;
    summary: string;
    unresolvedThreads: string[];
  };
  genreExpectations: {
    metExpectations: string[];
    missedOpportunities: string[];
  };
  overallScore: number; // 1-10
}

export interface EngagementTimelinePoint {
  chapterIndex: number;
  chapterTitle: string;
  averageEngagementScore: number; // 1-10, averaged across personas
  isPeak: boolean;
  isLowPoint: boolean;
}

export interface ReaderRoomResult {
  targetAudience: string;
  personas: ReaderPersona[];
  feedback: ReaderRoomFeedback[];
  engagementTimeline: EngagementTimelinePoint[];
  weakSections: WeakSection[];
  overallSummary: string;
  provider: "openai" | "gemini" | "anthropic";
}

const READER_ROOM_SYSTEM_PROMPT = `You are simulating a panel of distinct reader personas reviewing a story manuscript. You must respond with ONLY valid JSON matching the exact schema described in the user prompt — no prose, no markdown fences, no commentary outside the JSON object.`;

function buildReaderRoomPrompt(
  chapters: { title: string; content: string }[],
  targetAudience: string
): string {
  const chapterList = chapters
    .map((ch, i) => `--- Chapter ${i + 1}: ${ch.title} ---\n${ch.content}`)
    .join("\n\n");

  return `Target audience: ${targetAudience}

Generate 3 to 5 distinct reader personas appropriate for this audience (e.g. for "YA Fantasy Readers": a worldbuilding purist, a romance-forward reader, a plot-twist hunter). Each persona reads the full story below and gives feedback.

Respond with ONLY a JSON object matching this exact shape:
{
  "personas": [{ "name": string, "audienceType": string, "description": string }],
  "feedback": [{
    "persona": { "name": string, "audienceType": string, "description": string },
    "engagement": { "summary": string, "dropOffChapters": number[], "mostInvestedChapters": number[] },
    "clarity": { "summary": string, "confusingMoments": string[] },
    "emotionalImpact": { "summary": string, "highs": string[], "lows": string[] },
    "pacing": { "summary": string, "tooSlowChapters": number[], "tooFastChapters": number[] },
    "ending": { "satisfying": boolean, "summary": string, "unresolvedThreads": string[] },
    "genreExpectations": { "metExpectations": string[], "missedOpportunities": string[] },
    "overallScore": number
  }],
  "weakSections": [{ "chapterIndex": number, "chapterTitle": string, "issue": string, "rewriteSuggestion": string }],
  "overallSummary": string
}

Chapter indices are 0-based, matching the order below. "weakSections" should list every chapter that at least 2 personas flagged as a drop-off point, slow, or confusing, with one concrete rewrite suggestion each (a short paragraph the writer could use as a starting point, not a full rewrite of the chapter).

STORY:
${chapterList}`;
}

function buildEngagementTimeline(
  chapters: { title: string }[],
  feedback: ReaderRoomFeedback[]
): EngagementTimelinePoint[] {
  return chapters.map((chapter, index) => {
    const scoresForChapter = feedback.map((f) => {
      let score = 5;
      if (f.engagement.mostInvestedChapters.includes(index)) score += 3;
      if (f.engagement.dropOffChapters.includes(index)) score -= 3;
      if (f.pacing.tooSlowChapters.includes(index)) score -= 1;
      if (f.pacing.tooFastChapters.includes(index)) score -= 1;
      return Math.max(1, Math.min(10, score));
    });
    const average =
      scoresForChapter.reduce((sum, s) => sum + s, 0) / (scoresForChapter.length || 1);

    return {
      chapterIndex: index,
      chapterTitle: chapter.title,
      averageEngagementScore: Math.round(average * 10) / 10,
      isPeak: average >= 7,
      isLowPoint: average <= 4,
    };
  });
}

/**
 * Generates multi-persona reader feedback for a story. Reuses the same
 * provider clients and fallback pattern as generateStory() — tries the
 * requested provider, falls back to Gemini on retryable failures.
 */
export async function generateReaderRoomFeedback(
  chapters: { title: string; content: string }[],
  targetAudience: string,
  provider?: string
): Promise<ReaderRoomResult> {
  assertAIProviderConfigured();

  if (!chapters.length) {
    throw new Error("Story has no chapters to review.");
  }

  const userPrompt = buildReaderRoomPrompt(chapters, targetAudience);
  const chosenProvider = provider?.toLowerCase();

  let rawJson: string;
  let usedProvider: "openai" | "gemini" | "anthropic";

  try {
    if (chosenProvider === "anthropic" || chosenProvider === "claude") {
      rawJson = await generateWithAnthropic(READER_ROOM_SYSTEM_PROMPT, userPrompt);
      usedProvider = "anthropic";
    } else if (chosenProvider === "gemini") {
      rawJson = await generateWithGemini(READER_ROOM_SYSTEM_PROMPT, userPrompt);
      usedProvider = "gemini";
    } else {
      rawJson = await generateWithOpenAI(READER_ROOM_SYSTEM_PROMPT, userPrompt);
      usedProvider = "openai";
    }
  } catch (primaryError) {
    console.warn(
      "[Reader Room] Primary provider failed, falling back to Gemini:",
      primaryError instanceof Error ? primaryError.message : primaryError
    );
    rawJson = await generateWithGemini(READER_ROOM_SYSTEM_PROMPT, userPrompt);
    usedProvider = "gemini";
  }

  let parsed: {
    personas: ReaderPersona[];
    feedback: ReaderRoomFeedback[];
    weakSections: WeakSection[];
    overallSummary: string;
  };

  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error("Reader Room AI response was not valid JSON. Please try again.");
  }

  return {
    targetAudience,
    personas: parsed.personas,
    feedback: parsed.feedback,
    weakSections: parsed.weakSections,
    engagementTimeline: buildEngagementTimeline(chapters, parsed.feedback),
    overallSummary: parsed.overallSummary,
    provider: usedProvider,
  };
}