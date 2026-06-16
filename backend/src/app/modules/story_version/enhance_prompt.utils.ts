import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL, CLAUDE_MODEL, OPENAI_MODEL, getOpenAIClient, getAnthropicClient } from "../../../services/ai.service";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const enhancePromptWithGemini = async (
  prompt: string,
  signal?: AbortSignal
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const metaPrompt = `You are a creative writing assistant. Rewrite the following story prompt to be more vivid, specific, and engaging. Add a character name, setting details, and a central conflict. Return ONLY the enhanced prompt, nothing else. Do not add any explanation or prefix.

Prompt: ${prompt}`;

  const resultPromise = model.generateContent(metaPrompt);

  // Respect abort signal if provided
  const result = signal
    ? await Promise.race([
        resultPromise,
        new Promise<never>((_, reject) =>
          signal.addEventListener("abort", () =>
            reject(new Error("Generation aborted"))
          )
        ),
      ])
    : await resultPromise;

  const text = (result as Awaited<typeof resultPromise>)
    .response.text()
    .trim();

  return text;
};

export const enhancePromptWithOpenAI = async (
  prompt: string,
  signal?: AbortSignal
): Promise<string> => {
  const client = getOpenAIClient();
  const metaPrompt = `You are a creative writing assistant. Rewrite the following story prompt to be more vivid, specific, and engaging. Add a character name, setting details, and a central conflict. Return ONLY the enhanced prompt, nothing else. Do not add any explanation or prefix.

Prompt: ${prompt}`;

  const response = await client.chat.completions.create(
    {
      model: OPENAI_MODEL,
      messages: [{ role: "user", content: metaPrompt }],
      max_tokens: 1000,
    },
    { signal }
  );

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenAI returned an empty response");
  return text;
};

export const enhancePromptWithAnthropic = async (
  prompt: string,
  signal?: AbortSignal
): Promise<string> => {
  const client = getAnthropicClient();
  const metaPrompt = `You are a creative writing assistant. Rewrite the following story prompt to be more vivid, specific, and engaging. Add a character name, setting details, and a central conflict. Return ONLY the enhanced prompt, nothing else. Do not add any explanation or prefix.

Prompt: ${prompt}`;

  const response = await client.messages.create(
    {
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content: metaPrompt }],
    },
    { signal }
  );

  const textBlock = response.content.find((block) => block.type === "text");
  const text = textBlock && "text" in textBlock ? textBlock.text.trim() : "";
  if (!text) throw new Error("Anthropic returned an empty response");
  return text;
};