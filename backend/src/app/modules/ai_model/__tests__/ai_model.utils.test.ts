import httpStatus from "http-status";
import {
  generateAlternateEndingsWithGemini,
  generateWithGeminiStories,
  resolveGenreInstruction, // ← ADDED
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

// ← NEW describe block below
describe("resolveGenreInstruction", () => {
  it("returns a Horror-specific instruction for an explicit genre", () => {
    const instruction = resolveGenreInstruction("Horror", "A creepy old house");

    expect(instruction).toContain("Horror");
    expect(instruction).toContain("dread");
  });

  it("detects genre from a '[Genre: X]' prefix when no explicit genre is given", () => {
    const instruction = resolveGenreInstruction(
      undefined,
      "[Genre: 🚀 Sci-Fi] A colony ship arrives at a new star system"
    );

    expect(instruction).toContain("Sci-Fi");
    expect(instruction).toContain("futuristic");
  });

  it("prefers an explicit genre over one embedded in the prompt", () => {
    const instruction = resolveGenreInstruction(
      "Romance",
      "[Genre: 😱 Horror] Two strangers meet on a train"
    );

    expect(instruction).toContain("Romance");
    expect(instruction).not.toContain("Horror");
  });

  it("returns undefined when no genre is provided or recognized", () => {
    expect(resolveGenreInstruction(undefined, "A walk in the park")).toBeUndefined();
    expect(resolveGenreInstruction("Western", "A walk in the park")).toBeUndefined();
  });
});