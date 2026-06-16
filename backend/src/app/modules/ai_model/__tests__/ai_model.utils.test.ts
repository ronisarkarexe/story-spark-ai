import httpStatus from "http-status";

// Setup global mock functions first
(global as any).mockStartChat = jest.fn();
(global as any).mockGenerateContent = jest.fn();

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      startChat: (...args: any[]) => (global as any).mockStartChat(...args),
      generateContent: (...args: any[]) => (global as any).mockGenerateContent(...args),
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
    gemini_api_key: "default_mocked_key",
  },
}));

describe("ai_model.utils Gemini configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fails story generation when GEMINI_API_KEY is missing", async () => {
    let generateWithGeminiStoriesFn: any;
    jest.isolateModules(() => {
      const configModule = require("../../../../config").default;
      configModule.gemini_api_key = "";
      const utils = require("../ai_model.utils");
      generateWithGeminiStoriesFn = utils.generateWithGeminiStories;
    });

    await expect(generateWithGeminiStoriesFn("space")).rejects.toMatchObject({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: expect.stringContaining("Gemini API key is not configured"),
    });
  });

  it("fails alternate endings when GEMINI_API_KEY is missing", async () => {
    let generateAlternateEndingsWithGeminiFn: any;
    jest.isolateModules(() => {
      const configModule = require("../../../../config").default;
      configModule.gemini_api_key = "";
      const utils = require("../ai_model.utils");
      generateAlternateEndingsWithGeminiFn = utils.generateAlternateEndingsWithGemini;
    });

    await expect(
      generateAlternateEndingsWithGeminiFn("Title", "Story body", "Adventure")
    ).rejects.toMatchObject({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: expect.stringContaining("Gemini API key is not configured"),
    });
  });

  it("fails continuation when GEMINI_API_KEY is missing", async () => {
    let generateStoryContinuationWithGeminiFn: any;
    jest.isolateModules(() => {
      const configModule = require("../../../../config").default;
      configModule.gemini_api_key = "";
      const utils = require("../ai_model.utils");
      generateStoryContinuationWithGeminiFn = utils.generateStoryContinuationWithGemini;
    });

    await expect(
      generateStoryContinuationWithGeminiFn("Short story context...")
    ).rejects.toMatchObject({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: expect.stringContaining("Gemini API key is not configured"),
    });
  });

  it("extractCharacterMemory returns empty when API key is missing", async () => {
    let extractCharacterMemoryFn: any;
    jest.isolateModules(() => {
      const configModule = require("../../../../config").default;
      configModule.gemini_api_key = "";
      const utils = require("../ai_model.utils");
      extractCharacterMemoryFn = utils.extractCharacterMemory;
    });

    const memory = await extractCharacterMemoryFn("Some story context...");
    expect(memory).toEqual([]);
  });

  it("extractCharacterMemory returns empty when story context is too short", async () => {
    let extractCharacterMemoryFn: any;
    jest.isolateModules(() => {
      const configModule = require("../../../../config").default;
      configModule.gemini_api_key = "fake_key";
      const utils = require("../ai_model.utils");
      extractCharacterMemoryFn = utils.extractCharacterMemory;
    });

    const memory = await extractCharacterMemoryFn("Too short");
    expect(memory).toEqual([]);
  });

  it("extractCharacterMemory extracts character details successfully", async () => {
    let extractCharacterMemoryFn: any;
    jest.isolateModules(() => {
      const configModule = require("../../../../config").default;
      configModule.gemini_api_key = "fake_key";
      const utils = require("../ai_model.utils");
      extractCharacterMemoryFn = utils.extractCharacterMemory;
    });

    const fakeMemoryJson = JSON.stringify([
      {
        name: "Merlin",
        appearance: "Elderly wizard",
        personality: "Wise",
        keyActions: "Helped the prince",
        goals: "Protect the kingdom",
        relationships: "Prince (ally)",
      },
    ]);

    (global as any).mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => fakeMemoryJson,
      },
    });

    const memory = await extractCharacterMemoryFn(
      "Merlin the wizard walked through the valley, wondering how he could protect the kingdom. Elena followed him."
    );

    expect(memory).toHaveLength(1);
    expect(memory[0].name).toBe("Merlin");
    expect((global as any).mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it("generateStoryContinuationWithGemini extracts memory and continues story", async () => {
    let generateStoryContinuationWithGeminiFn: any;
    jest.isolateModules(() => {
      const configModule = require("../../../../config").default;
      configModule.gemini_api_key = "fake_key";
      const utils = require("../ai_model.utils");
      generateStoryContinuationWithGeminiFn = utils.generateStoryContinuationWithGemini;
    });

    // 1. Mock memory extraction
    const fakeMemoryJson = JSON.stringify([
      {
        name: "Merlin",
        appearance: "Elderly wizard",
        personality: "Wise",
        keyActions: "Walked",
        goals: "Protect",
        relationships: "Elena",
      },
    ]);
    (global as any).mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => fakeMemoryJson,
      },
    });

    // 2. Mock continuation generation
    const mockSendMessage = jest.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({ continuation: "And so Merlin continued his journey." }),
      },
    });

    (global as any).mockStartChat.mockReturnValueOnce({
      sendMessage: mockSendMessage,
    });

    const result = await generateStoryContinuationWithGeminiFn(
      "Merlin the wizard walked through the valley, wondering how he could protect the kingdom. Elena followed him."
    );

    expect(result.continuation).toBe("And so Merlin continued his journey.");
    // Check that character memory details were injected into the prompt
    expect(mockSendMessage).toHaveBeenCalledWith(
      expect.stringContaining("[CHARACTER MEMORY SYSTEM]"),
      expect.any(Object)
    );
    expect(mockSendMessage).toHaveBeenCalledWith(
      expect.stringContaining("Merlin"),
      expect.any(Object)
    );
  });
});
