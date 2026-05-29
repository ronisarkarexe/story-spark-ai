import httpStatus from "http-status";
import {
  generateAlternateEndingsWithGemini,
  generateWithGeminiStories,
} from "../ai_model.utils";

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      startChat: jest.fn(),
    }),
  })),
  HarmBlockThreshold: {
    BLOCK_LOW_AND_ABOVE: "BLOCK_LOW_AND_ABOVE",
  },
  HarmCategory: {
    HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
    HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
  },
}));

jest.mock("../../../../config", () => ({
  __esModule: true,
  default: {
    gemini_api_key: "",
  },
}));

describe("ai_model.utils Gemini configuration", () => {
  it("fails story generation when GEMINI_API_KEY is missing", async () => {
    await expect(generateWithGeminiStories("space")).rejects.toMatchObject({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: expect.stringContaining("Gemini API key is not configured"),
    });
  });

  it("fails alternate endings when GEMINI_API_KEY is missing", async () => {
    await expect(
      generateAlternateEndingsWithGemini("Title", "Story body", "Adventure")
    ).rejects.toMatchObject({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: expect.stringContaining("Gemini API key is not configured"),
    });
  });
});
