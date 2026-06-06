import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

let openai: OpenAI | null = null;
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const key = process.env.OPEN_AI_KEY || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("OpenAI API key is required but was not provided. Please set OPEN_AI_KEY environment variable.");
    }
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

export const GEMINI_MODEL = "gemini-2.5-flash";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AIResponse {
  story: string;
  provider: "openai" | "gemini";
  fallbackUsed: boolean;
}

// ─── OpenAI call ─────────────────────────────────────────────────────────────

async function generateWithOpenAI(prompt: string): Promise<string> {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create(
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

  if (!key) {
    throw new Error("OPENAI_API_KEY is missing in environment variables");
  }

  return new OpenAI({ apiKey: key });
}

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

export const GEMINI_MODEL = "gemini-2.5-flash";

console.log("OPENAI KEY:", process.env.OPENAI_API_KEY ? "LOADED" : "MISSING");
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY ? "LOADED" : "MISSING");


// ✅ ADD THIS FUNCTION (THIS FIXES YOUR ERROR)
export async function generateStory(prompt: string) {
  try {
    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    return {
      story: response.choices[0]?.message?.content || "",
      provider: "openai",
      fallbackUsed: false,
    };

  } catch (err) {
    console.log("OpenAI failed, switching to Gemini...");

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      story: text,
      provider: "gemini",
      fallbackUsed: true,
    };
  }
}