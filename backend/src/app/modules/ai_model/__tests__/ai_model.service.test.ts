import httpStatus from "http-status";
import { generateWithGeminiStories } from "../ai_model.utils";
import { AiModelService } from "../ai_model.service";
import {
  GenerationTimeoutError,
  raceGenerationWithTimeout,
} from "../../../../utils/generation_timeout";

jest.mock("../../user/user.model", () => ({
  User: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
}));

jest.mock("../ai_model.utils", () => ({
  generateWithGeminiStories: jest.fn(),
}));

jest.mock("../../../../utils/generation_timeout", () => ({
  ...jest.requireActual("../../../../utils/generation_timeout"),
  raceGenerationWithTimeout: jest.fn(),
}));

jest.mock("../quota.lifecycle", () => ({
  ...jest.requireActual("../quota.lifecycle"),
  assertSuccessfulGeneration: jest.fn((result: unknown, message: string) => {
    if (!Array.isArray(result) || result.length === 0) {
      const ApiError = jest.requireActual("../../../../errors/api_error").default;
      throw new ApiError(httpStatus.BAD_GATEWAY, message);
    }
  }),
}));

// ↓ both kept on one line to avoid TS multi-line generic parsing bug
const mockedGenerate = generateWithGeminiStories as jest.MockedFunction<typeof generateWithGeminiStories>;
const mockedRace = raceGenerationWithTimeout as jest.MockedFunction<typeof raceGenerationWithTimeout>;

// Use requireMock to access the User model mock
const MockedUser = jest.requireMock("../../user/user.model").User as {
  findOne: jest.Mock;
  findOneAndUpdate: jest.Mock;
  updateOne: jest.Mock;
};

const story = {
  title: "x",
  content: "body",
  tag: "adventure",
};

const mockUser = {
  email: "user@example.com",
  subscriptionType: "free",
  requestsThisMonth: 0,
  lastRequestDate: null,
};

describe("AiModelService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedRace.mockImplementation(async (operation) => operation({} as AbortSignal));

    // Simulate a user that exists and has quota remaining
    MockedUser.findOne.mockResolvedValue(mockUser);
    MockedUser.findOneAndUpdate.mockResolvedValue({ ...mockUser, requestsThisMonth: 1 });
    MockedUser.updateOne.mockResolvedValue({});
  });

  it("returns stories on success without empty-array masking", async () => {
    mockedGenerate.mockResolvedValue([story]);

    const result = await AiModelService.aiModelGenerate(
      { prompt: "test", wordLength: 100, numStories: 1 },
      { email: "user@example.com" } as never
    );

    expect(result).toHaveLength(1);
  });

  it("passes the selected language through to story generation", async () => {
    mockedGenerate.mockResolvedValue([story]);

    await AiModelService.aiModelGenerate(
      { prompt: "test", wordLength: 100, numStories: 1, language: "Spanish" },
      { email: "user@example.com" } as never
    );

    expect(mockedGenerate).toHaveBeenCalledWith(
      "test",
      100,
      1,
      "Spanish",
      undefined,
      expect.anything()
    );
  });

  it("passes the selected genre through to story generation", async () => {
    mockedGenerate.mockResolvedValue([story]);

    await AiModelService.aiModelGenerate(
      { prompt: "test", wordLength: 100, numStories: 1, genre: "Horror" },
      { email: "user@example.com" } as never
    );

    expect(mockedGenerate).toHaveBeenCalledWith(
      "test",
      100,
      1,
      "English",
      "Horror",
      expect.anything()
    );
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