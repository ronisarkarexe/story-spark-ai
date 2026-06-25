import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import {
  parseAIResponseOrThrow,
  PlotHoleAnalysisResponseSchema,
  type PlotHoleAnalysisResponse,
} from "../ai";

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 0.2, // Low temperature for high consistency and logical precision
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export interface IPlotHole {
  inconsistency: string;
  context: string;
  suggested_fix: string;
}

export interface IAnalysisResponse {
  plot_holes: IPlotHole[];
}

const analyzeStoryText = async (storyText: string): Promise<IAnalysisResponse> => {
  if (!storyText || storyText.trim().length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Story text cannot be empty.");
  }

  try {
    const prompt = `You are a rigorous literary editor. Analyze the following story for plot holes and logical inconsistencies.

Story to analyze:
"${storyText}"

You MUST analyze the story meticulously and identify any contradictions, continuity errors, unexplained character shifts, or logical failures.
Return ONLY a valid JSON object matching this exact schema:
{
  "plot_holes": [
    {
      "inconsistency": "Detailed description of the logical error or plot hole found",
      "context": "The exact sentence, quote, or paragraph where this issue occurs or originates",
      "suggested_fix": "Clear, actionable recommendation on how to resolve the contradiction or error"
    }
  ]
}

If the story is perfectly logical and has zero plot holes or inconsistencies, return an empty array for the "plot_holes" key. Do not add any conversational text or explanation outside the JSON format.`;

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const response = await chatSession.sendMessage(prompt);
    const text = response.response.text();

    const result = parseAIResponseOrThrow<PlotHoleAnalysisResponse>(
      text,
      PlotHoleAnalysisResponseSchema,
      {
        label: "Gemini plot hole analysis",
        errorMessage: "AI returned invalid JSON for plot hole analysis",
      }
    );

    return result;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI analysis failed: ${errorMsg}`
    );
  }
};

export const AiEditorService = {
  analyzeStoryText,
};
