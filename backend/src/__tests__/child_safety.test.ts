import { describe, expect, it, jest, beforeEach } from "@jest/globals";

// Set env variable and mock config before importing the service
process.env.GEMINI_API_KEY = "dummy-key-for-test";
jest.mock("../config", () => ({
  __esModule: true,
  default: {
    gemini_api_key: "dummy-key-for-test"
  }
}));

import { ChildSafetyService } from "../app/modules/child_safety/child_safety.service";

// Mock the GoogleGenerativeAI library
const mockGenerateContent = jest.fn() as any;
jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockImplementation(() => {
          return {
            generateContent: mockGenerateContent,
          };
        }),
      };
    }),
    HarmCategory: {},
    HarmBlockThreshold: {},
  };
});

describe("ChildSafetyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("performSafetyAnalysis", () => {
    it("should return a clean safety report when AI returns safe evaluation", async () => {
      const mockResultText = JSON.stringify({
        isSafeForChildren: true,
        recommendedAgeGroup: "All Ages",
        reasoning: "The content is gentle and child-appropriate.",
        severity: "Safe",
        sentenceLevel: [],
        discourseLevel: [],
        contentWarnings: ["Friendship", "Nature"]
      });

      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => mockResultText
        }
      });

      const report = await ChildSafetyService.performSafetyAnalysis("Once upon a time, there was a kind rabbit.");
      
      expect(report.isSafeForChildren).toBe(true);
      expect(report.recommendedAgeGroup).toBe("All Ages");
      expect(report.severity).toBe("Safe");
      expect(report.contentWarnings).toContain("Friendship");
      expect(report.sentenceLevel).toHaveLength(0);
    });

    it("should detect safety violations when AI returns flagged content", async () => {
      const mockResultText = JSON.stringify({
        isSafeForChildren: false,
        recommendedAgeGroup: "Not suitable for children",
        reasoning: "The text contains a dangerous activity and rude language.",
        severity: "Unsafe",
        sentenceLevel: [
          {
            sentence: "He grabbed a box of matches and lit them.",
            category: "Violence & Scariness",
            detail: "Playing with matches is highly dangerous for children.",
            severity: "High"
          }
        ],
        discourseLevel: [
          {
            aspect: "Plot",
            category: "Violence & Scariness",
            detail: "The plot resolves conflict by starting a dangerous fire.",
            severity: "High"
          }
        ],
        contentWarnings: ["Fire Hazard", "Danger"]
      });

      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => mockResultText
        }
      });

      const report = await ChildSafetyService.performSafetyAnalysis("He grabbed a box of matches and lit them.");
      
      expect(report.isSafeForChildren).toBe(false);
      expect(report.severity).toBe("Unsafe");
      expect(report.sentenceLevel[0].category).toBe("Violence & Scariness");
      expect(report.discourseLevel[0].aspect).toBe("Plot");
    });
  });

  describe("runSelfDiagnosisAndCorrection", () => {
    it("should not call correction if the draft story is safe", async () => {
      const mockSafeAuditText = JSON.stringify({
        isSafeForChildren: true,
        recommendedAgeGroup: "All Ages",
        reasoning: "Clean and gentle story.",
        severity: "Safe",
        sentenceLevel: [],
        discourseLevel: [],
        contentWarnings: []
      });

      // Mock only 1 call to performSafetyAnalysis (via model.generateContent)
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => mockSafeAuditText
        }
      });

      const result = await ChildSafetyService.runSelfDiagnosisAndCorrection(
        "A kid walks home",
        "Happy Walk",
        "The boy walked home safely.",
        "General",
        "Children's",
        "childrens"
      );

      expect(result.content).toBe("The boy walked home safely.");
      expect(result.safetyReport.isSafeForChildren).toBe(true);
      expect(mockGenerateContent).toHaveBeenCalledTimes(1); // safety analysis run once, no correction
    });

    it("should run correction loop if content has high severity violations", async () => {
      const mockUnsafeAuditText = JSON.stringify({
        isSafeForChildren: false,
        recommendedAgeGroup: "11+ years",
        reasoning: "Contains high danger sentence.",
        severity: "Unsafe",
        sentenceLevel: [
          {
            sentence: "He threw matches into the woodpile.",
            category: "Violence & Scariness",
            detail: "Matches starting fires is unsafe.",
            severity: "High"
          }
        ],
        discourseLevel: [],
        contentWarnings: ["Fire"]
      });

      const mockCorrectionResponseText = JSON.stringify({
        title: "The Safe Camping Trip",
        content: "He built a safe campfire with his father.",
        tag: "Safety"
      });

      const mockSafeAuditAfterCorrectionText = JSON.stringify({
        isSafeForChildren: true,
        recommendedAgeGroup: "All Ages",
        reasoning: "Wholesome and safe story now.",
        severity: "Safe",
        sentenceLevel: [],
        discourseLevel: [],
        contentWarnings: []
      });

      // Call 1: performSafetyAnalysis (initial check) -> Unsafe
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => mockUnsafeAuditText
        }
      });

      // Call 2: rewrite story (self-correction)
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => mockCorrectionResponseText
        }
      });

      // Call 3: performSafetyAnalysis (recheck corrected story) -> Safe
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => mockSafeAuditAfterCorrectionText
        }
      });

      const result = await ChildSafetyService.runSelfDiagnosisAndCorrection(
        "A story about camping",
        "The Campfire",
        "He threw matches into the woodpile.",
        "General",
        "Children's",
        "childrens"
      );

      expect(result.content).toBe("He built a safe campfire with his father.");
      expect(result.title).toBe("The Safe Camping Trip");
      expect(result.safetyReport.isSafeForChildren).toBe(true);
      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
    });
  });
});
