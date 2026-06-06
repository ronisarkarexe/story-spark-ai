import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import config from "../../../config";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { IChatMessage } from "./chat.interface";

const geminiApiKey = config.gemini_api_key?.trim() ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

const SYSTEM_INSTRUCTION = 
  "You are Sparky, an expert creative writing coach, story editor, and brainstorming assistant on the StorySpark AI platform. " +
  "Your goal is to help users brainstorm plots, develop compelling characters, refine prose styles, and beat writer's block. " +
  "Keep your responses encouraging, insightful, relatively concise, and focused on storytelling craft. " +
  "Format your responses in clean Markdown.";

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

    return {
      role: "model" as const,
      content: replyText,
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
