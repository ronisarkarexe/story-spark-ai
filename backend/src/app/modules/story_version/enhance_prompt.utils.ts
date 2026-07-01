 fix/story-parser-locations-1035
// backend/src/app/modules/story_version/enhance_prompt.utils.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  GEMINI_MODEL,
  CLAUDE_MODEL,
  OPENAI_MODEL,
  getOpenAIClient,
  getAnthropicClient,
} from "../../../services/ai.service";
 main

export const enhancePrompt = (prompt: string, context?: string): string => {
  // Use the following story context if available
  const compressedContext = context ? context : "No previous context";

 fix/story-parser-locations-1035
  const metaPrompt = `You are a creative writing assistant. Rewrite the following story prompt to be more vivid, specific, and engaging. Add a character name, setting details, and a central conflict. Return ONLY the enhanced prompt, nothing else. Do not add any explanation or prefix.

Context: ${compressedContext}

Prompt: ${prompt}`;

  return metaPrompt;
};

const SYSTEM_INSTRUCTION = `You are a creative writing assistant.
Rewrite the user's story prompt to be more vivid, specific, and engaging.
Add a character name, setting details, and a central conflict.
Return ONLY the enhanced prompt — no explanation, no prefix, nothing else.`;

export const enhancePromptWithGemini = async (
  prompt: string,
  signal?: AbortSignal,
  compressedContext?: string
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  // User prompt is clearly delimited — never bleeds into system instructions
  const metaPrompt = `${SYSTEM_INSTRUCTION}

Story context (if available):
${compressedContext ?? "No previous context"}

User prompt:
"""
${prompt}
"""`;

  const resultPromise = model.generateContent(metaPrompt);

  const result = signal
    ? await Promise.race([
        resultPromise,
        new Promise<never>((_, reject) =>
          signal.addEventListener(
            "abort",
            () => reject(new Error("Generation aborted")),
            { once: true }
          )
        ),
      ])
    : await resultPromise;

  const text = (result as Awaited<typeof resultPromise>).response.text().trim();

  return text;
};

export const enhancePromptWithOpenAI = async (
  prompt: string,
  signal?: AbortSignal
): Promise<string> => {
  const client = getOpenAIClient();

  // System instruction and user prompt are structurally separated via roles
  const response = await client.chat.completions.create(
    {
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
    },
    { signal }
  );

  const text = response.choices[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("OpenAI returned an empty response");
  }

  return text;
};

export const enhancePromptWithAnthropic = async (
  prompt: string,
  signal?: AbortSignal
): Promise<string> => {
  const client = getAnthropicClient();

  // System instruction and user prompt are structurally separated via roles
  const response = await client.messages.create(
    {
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      system: SYSTEM_INSTRUCTION,
      messages: [{ role: "user", content: prompt }],
    },
    { signal }
  );

  const textBlock = response.content.find((block) => block.type === "text");
  const text = textBlock && "text" in textBlock ? textBlock.text.trim() : "";

  if (!text) {
    throw new Error("Anthropic returned an empty response");
  }

  return text;
};

