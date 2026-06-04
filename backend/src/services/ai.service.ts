import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;

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