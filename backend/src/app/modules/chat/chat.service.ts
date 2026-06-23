import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import config from "../../../config";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { IChatMessage } from "./chat.interface";

const geminiApiKey = config.gemini_api_key?.trim() ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

const SYSTEM_INSTRUCTION = `
You are Sparky, the embedded AI assistant for StorySparkAI.

StorySparkAI is an AI-powered storytelling platform where users can:
- generate stories
- edit stories
- explore story variations
- brainstorm ideas
- collaborate on storytelling

Your primary role:
- Help users with storytelling, creative writing, and brainstorming
- Explain StorySparkAI features when asked
- Help users understand how to use the platform

Behavior rules:
- Always recognize that you are inside the StorySparkAI platform.
- Never claim the user is "not on a website".
- Never falsely claim to be trained by Google, OpenAI, Anthropic, or another company.
- If asked who you are, identify yourself as "Sparky, StorySparkAI's AI assistant."
- When asked about the platform or website, explain StorySparkAI and its capabilities.
- Stay aligned with StorySparkAI branding and purpose.
- Keep responses helpful, encouraging, insightful, concise, and formatted in Markdown.
`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_INSTRUCTION,
});

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const chatWithAi = async (messages: IChatMessage[]) => {
  if (!geminiApiKey) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Gemini API key is not configured."
    );
  }

  if (!messages || messages.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Messages history is required.");
  }

  try {
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Google Gemini startChat expects the first message in the history to be from the 'user'.
    // If the welcome message (role: 'model') is at the index 0, we shift it out.
    while (history.length > 0 && history[0].role === "model") {
      history.shift();
    }

    const lastMessage = messages[messages.length - 1].content;

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 2048,
      },
      safetySettings,
      history,
    });

    const result = await chatSession.sendMessage(lastMessage);
    const replyText = result.response.text();
    const safeReply =
  replyText?.trim() ||
  "Hi! I'm Sparky, StorySparkAI's assistant. How can I help with storytelling today?";

    return {
      role: "model" as const,
      content: safeReply,
    };
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `AI chat interaction failed: ${errorMsg}`
    );
  }
};

export const ChatService = {
  chatWithAi,
};
