import { detectGenderBiasWithGemini } from "../../ai_model/ai_model.utils";
import { AnalysisService } from "../analysis.service";

jest.mock("../../ai_model/ai_model.utils", () => ({
  detectGenderBiasWithGemini: jest.fn(),
}));

jest.mock("../../user/user.model", () => ({
  User: {
    findById: jest.fn(),
  },
}));

jest.mock("../../post/post.model", () => ({
  Post: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  },
}));

jest.mock("../../writer_application/writer_application.model", () => ({
  WriterApplication: {
    findOne: jest.fn(),
  },
}));

const mockedDetectGenderBiasWithGemini = detectGenderBiasWithGemini as jest.MockedFunction<
  typeof detectGenderBiasWithGemini
>;

describe("AnalysisService — detectGenderBias", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls detectGenderBiasWithGemini with the story content", async () => {
    const mockResponse = {
      detectedBiases: [
        {
          characterName: "Ana",
          gender: "Female" as const,
          stereotypicalRole: "passive assistant",
          reasoning: "She is not active",
          suggestedAlternative: "make her active",
        },
      ],
      overallAnalysis: "Analysis text",
      biasSeverity: "Medium" as const,
    };
    mockedDetectGenderBiasWithGemini.mockResolvedValue(mockResponse);

    const content = "Once upon a time Ana sat and Max discovered.";
    const result = await AnalysisService.detectGenderBias(content);

    expect(mockedDetectGenderBiasWithGemini).toHaveBeenCalledWith(content);
    expect(result).toEqual(mockResponse);
  });
});
