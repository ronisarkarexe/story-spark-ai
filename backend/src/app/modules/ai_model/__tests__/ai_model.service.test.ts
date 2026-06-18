import httpStatus from "http-status";
import { generateWithGeminiStories } from "../ai_model.utils";
import { AiModelService } from "../ai_model.service";
import {
  GenerationTimeoutError,
  raceGenerationWithTimeout,
} from "../../../../utils/generation_timeout";

jest.mock("../ai_model.utils", () => ({
  generateWithGeminiStories: jest.fn(),
}));

jest.mock("../../../../utils/generation_timeout", () => ({
  ...jest.requireActual("../../../../utils/generation_timeout"),
  raceGenerationWithTimeout: jest.fn(),
}));

// Mock User to avoid DATABASE_URL check in config
jest.mock("../../user/user.model", () => ({
  User: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
}));

const mockedGenerate = generateWithGeminiStories as jest.MockedFunction<
  typeof generateWithGeminiStories
>;
const mockedRace = raceGenerationWithTimeout as jest.MockedFunction<
  typeof raceGenerationWithTimeout
>;

const story = {
  title: "x",
  content: "body",
  tag: "adventure",
};

describe("AiModelService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedRace.mockImplementation(async (operation) =>
      operation({} as AbortSignal)
    );
  });

  it("returns stories on success without empty-array masking", async () => {
    mockedGenerate.mockResolvedValue([story]);

    const result = await AiModelService.aiModelGenerate(
      { prompt: "test", wordLength: 100, numStories: 1 }
    );

    expect(result).toHaveLength(1);
  });

  it("passes the selected language through to story generation", async () => {
    mockedGenerate.mockResolvedValue([story]);

    await AiModelService.aiModelGenerate(
      { prompt: "test", wordLength: 100, numStories: 1, language: "Spanish" }
    );

    expect(mockedGenerate).toHaveBeenCalledWith(
      "test",
      100,
      1,
      "Spanish",
      expect.anything(),
      undefined,
      undefined,
      undefined
    );
  });

  it("throws BAD_GATEWAY when generation returns empty stories", async () => {
    mockedGenerate.mockResolvedValue([]);

    await expect(
      AiModelService.aiModelGenerate(
        { prompt: "test", wordLength: 100, numStories: 1 }
      )
    ).rejects.toMatchObject({ statusCode: httpStatus.BAD_GATEWAY });
  });

  it("throws BAD_GATEWAY when Gemini utility throws", async () => {
    mockedGenerate.mockRejectedValue(new Error("Gemini API error"));

    await expect(
      AiModelService.aiModelGenerate(
        { prompt: "test", wordLength: 100, numStories: 1 }
      )
    ).rejects.toMatchObject({ statusCode: httpStatus.BAD_GATEWAY });
  });

  it("throws GATEWAY_TIMEOUT on timeout", async () => {
    mockedRace.mockRejectedValue(new GenerationTimeoutError());

    await expect(
      AiModelService.aiModelGenerate(
        { prompt: "test", wordLength: 100, numStories: 1 }
      )
    ).rejects.toMatchObject({ statusCode: httpStatus.GATEWAY_TIMEOUT });
  });

  it("guest path throws BAD_GATEWAY on empty stories", async () => {
    mockedGenerate.mockResolvedValue([]);

    await expect(
      AiModelService.aiModelGenerate({
        prompt: "test",
        wordLength: 150,
        numStories: 1,
      })
    ).rejects.toMatchObject({ statusCode: httpStatus.BAD_GATEWAY });
  });

  it("guest path throws GATEWAY_TIMEOUT on timeout", async () => {
    mockedRace.mockRejectedValue(new GenerationTimeoutError());

    await expect(
      AiModelService.aiModelGenerate({
        prompt: "test",
        wordLength: 150,
        numStories: 1,
      })
    ).rejects.toMatchObject({ statusCode: httpStatus.GATEWAY_TIMEOUT });
  });

  // ── Tone selector tests ────────────────────────────────────────────────────

  it("passes tone to generateWithGeminiStories when provided (authenticated)", async () => {
    mockedGenerate.mockResolvedValue([story]);

    await AiModelService.aiModelGenerate(
      { prompt: "test", wordLength: 100, numStories: 1, tone: "Dark" },
      { _id: "test-user-id" } as any
    );

    expect(mockedGenerate).toHaveBeenCalledWith(
      "test",   // prompt
      100,      // wordLength
      1,        // numStories
      "English", // language default
      expect.any(Object), // AbortSignal
      "Dark",   // tone
      undefined,
      undefined
    );
  });

  it("passes tone to generateWithGeminiStories when provided (free/guest)", async () => {
    mockedGenerate.mockResolvedValue([story]);

    await AiModelService.aiModelGenerate({
      prompt: "test",
      wordLength: 150,
      numStories: 1,
      tone: "Humorous",
    });

    expect(mockedGenerate).toHaveBeenCalledWith(
      "test",
      150,
      1,
      "English",
      expect.any(Object),
      "Humorous",
      undefined,
      undefined
    );
  });

  it("passes undefined tone when tone is omitted (authenticated)", async () => {
    mockedGenerate.mockResolvedValue([story]);

    await AiModelService.aiModelGenerate(
      { prompt: "test", wordLength: 100, numStories: 1 },
      { _id: "test-user-id" } as any
    );

    expect(mockedGenerate).toHaveBeenCalledWith(
      "test",
      100,
      1,
      "English",
      expect.any(Object),
      undefined, // no tone → undefined, so the util skips the directive
      undefined,
      undefined
    );
  });

  it("passes undefined tone when tone is omitted (free/guest)", async () => {
    mockedGenerate.mockResolvedValue([story]);

    await AiModelService.aiModelGenerate({
      prompt: "test",
      wordLength: 150,
      numStories: 1,
    });

    expect(mockedGenerate).toHaveBeenCalledWith(
      "test",
      150,
      1,
      "English",
      expect.any(Object),
      undefined,
      undefined,
      undefined
    );
  });
});
