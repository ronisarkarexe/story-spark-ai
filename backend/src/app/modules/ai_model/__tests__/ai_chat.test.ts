import httpStatus from "http-status";
import { chatWithGemini } from "../ai_model.utils";
import { AiModelService } from "../ai_model.service";
import {
  GenerationTimeoutError,
  raceGenerationWithTimeout,
} from "../../../../utils/generation_timeout";
import { User } from "../../user/user.model";

jest.mock("../ai_model.utils", () => ({
  chatWithGemini: jest.fn(),
}));

jest.mock("../../../../utils/generation_timeout", () => ({
  ...jest.requireActual("../../../../utils/generation_timeout"),
  raceGenerationWithTimeout: jest.fn(),
}));

jest.mock("../../user/user.model", () => ({
  User: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
}));

const mockedChat = chatWithGemini as jest.MockedFunction<typeof chatWithGemini>;
const mockedRace = raceGenerationWithTimeout as jest.MockedFunction<typeof raceGenerationWithTimeout>;

describe("AiModelService - Chat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedRace.mockImplementation(async (operation) => operation({} as AbortSignal));
  });

  it("returns chat response on success for authenticated user", async () => {
    mockedChat.mockResolvedValue("Hello there!");

    const result = await AiModelService.aiModelChat(
      { message: "Hi", history: [] },
      "test-user-id"
    );

    expect(result).toBe("Hello there!");
    expect(mockedChat).toHaveBeenCalledWith("Hi", []);
  });

  it("returns chat response for guest user", async () => {
    mockedChat.mockResolvedValue("Hi guest!");

    const result = await AiModelService.aiModelChat({ message: "Hi", history: [] });

    expect(result).toBe("Hi guest!");
    expect(mockedChat).toHaveBeenCalledWith("Hi", []);
  });

  it("throws gateway timeout on timeout", async () => {
    mockedRace.mockRejectedValue(new GenerationTimeoutError());

    await expect(
      AiModelService.aiModelChat({ message: "Hi", history: [] })
    ).rejects.toMatchObject({ statusCode: httpStatus.GATEWAY_TIMEOUT });
  });
});
