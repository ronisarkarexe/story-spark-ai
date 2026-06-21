import { DashboardAnalysis } from "../../models/analysis";
import baseApi from "../base_api/base.api";
import { ANALYSIS_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

export interface ISuggestion {
  id: string;
  category: "Style" | "Readability" | "Vocabulary" | "Dialogue" | "Pacing";
  title: string;
  description: string;
  originalText?: string;
  suggestedText?: string;
}

const analysisApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardAnalysis: build.query({
      query: () => ({
        url: `/${ANALYSIS_URL}/dashboard`,
        method: "GET",
      }),
      transformResponse: (response: {
        data: DashboardAnalysis;
        message: string;
      }) => response.data,
      providesTags: [tagTypes.post, tagTypes.user],
    }),
    analyzeStory: build.mutation<{ suggestions: ISuggestion[] }, { content: string }>({
      query: (data) => ({
        url: `/${ANALYSIS_URL}/analyze-story`,
        method: "POST",
        data,
      }),
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: { suggestions: ISuggestion[] };
      }) => response.data,
    }),
    biasDetection: build.mutation<IBiasDetectionResponse, { content: string }>({
      query: (data) => ({
        url: `/${ANALYSIS_URL}/bias-detection`,
        method: "POST",
        data,
      }),
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: IBiasDetectionResponse;
      }) => response.data,
    }),
  }),
});

export interface IGenderBias {
  characterName: string;
  gender: "Male" | "Female" | "Non-binary" | "Other" | "Unknown";
  stereotypicalRole: string;
  reasoning: string;
  suggestedAlternative: string;
}

export interface IBiasDetectionResponse {
  detectedBiases: IGenderBias[];
  overallAnalysis: string;
  biasSeverity: "Low" | "Medium" | "High";
}

export const { useGetDashboardAnalysisQuery, useAnalyzeStoryMutation, useBiasDetectionMutation } = analysisApi;

