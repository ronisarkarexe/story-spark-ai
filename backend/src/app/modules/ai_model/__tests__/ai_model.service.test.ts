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
    mockedRace.mockImplementation(async (operation) => operation({} as AbortSignal));
  });

  it("returns stories on success without empty-array masking", async () => {
    mockedGenerate.mockResolvedValue([story]);

    const result = await AiModelService.aiModelGenerate(
      { prompt: "test", wordLength: 100, numStories: 1 },
      { email: "user@example.com" } as never
    );

    expect(result).toHaveLength(1);
  });

  it("throws BAD_GATEWAY when generation returns empty stories", async () => {
    mockedGenerate.mockResolvedValue([]);

    await expect(
      AiModelService.aiModelGenerate(
        { prompt: "test", wordLength: 100, numStories: 1 },
        { email: "user@example.com" } as never
      )
    ).rejects.toMatchObject({ statusCode: httpStatus.BAD_GATEWAY });
  });

  it("throws BAD_GATEWAY when Gemini utility throws", async () => {
    mockedGenerate.mockRejectedValue(new Error("Gemini API error"));

    await expect(
      AiModelService.aiModelGenerate(
        { prompt: "test", wordLength: 100, numStories: 1 },
        { email: "user@example.com" } as never
      )
    ).rejects.toMatchObject({ statusCode: httpStatus.BAD_GATEWAY });
  });

  it("throws GATEWAY_TIMEOUT on timeout", async () => {
    mockedRace.mockRejectedValue(new GenerationTimeoutError());

    await expect(
      AiModelService.aiModelGenerate(
        { prompt: "test", wordLength: 100, numStories: 1 },
        { email: "user@example.com" } as never
      )
    ).rejects.toMatchObject({ statusCode: httpStatus.GATEWAY_TIMEOUT });
  });

  it("guest path throws BAD_GATEWAY on empty stories", async () => {
    mockedGenerate.mockResolvedValue([]);

    await expect(
      AiModelService.aiFreeModelGenerate({
        prompt: "test",
        wordLength: 150,
        numStories: 1,
      })
    ).rejects.toMatchObject({ statusCode: httpStatus.BAD_GATEWAY });
  });

  it("guest path throws GATEWAY_TIMEOUT on timeout", async () => {
    mockedRace.mockRejectedValue(new GenerationTimeoutError());

    await expect(
      AiModelService.aiFreeModelGenerate({
        prompt: "test",
        wordLength: 150,
        numStories: 1,
      })
    ).rejects.toMatchObject({ statusCode: httpStatus.GATEWAY_TIMEOUT });
  });
});
