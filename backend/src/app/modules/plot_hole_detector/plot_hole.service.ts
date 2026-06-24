import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";

const geminiApiKey = config.gemini_api_key?.trim() ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

interface PlotHole {
  type: "TIMELINE" | "CONTRADICTION" | "UNRESOLVED" | "INCONSISTENCY";
  severity: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  location: string;
  suggestion: string;
}

export interface PlotHoleResult {
  plotHoles: PlotHole[];
  summary: string;
  score: number;
}

const buildDetectionPrompt = (title: string, content: string): string => `You are a professional story editor. Analyze the following story for plot holes, timeline inconsistencies, contradictions, unresolved plot points, and narrative flaws.

Title: ${title}

Story Content:
${content}

Return a JSON object with this exact structure:
{
  "plotHoles": [
    {
      "type": "TIMELINE" | "CONTRADICTION" | "UNRESOLVED" | "INCONSISTENCY",
      "severity": "LOW" | "MEDIUM" | "HIGH",
      "description": "Clear description of the plot hole",
      "location": "Approximate location in the story where it occurs",
      "suggestion": "How to fix or resolve this issue"
    }
  ],
  "summary": "Overall assessment of story coherence",
  "score": 0-100 (100 = perfectly consistent)
}

If no plot holes are found, return an empty plotHoles array, a positive summary, and score of 100.`;

export const detectPlotHoles = async (
  title: string,
  content: string,
): Promise<PlotHoleResult> => {
  if (!geminiApiKey) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Gemini API key is not configured. Set GEMINI_API_KEY before using plot hole detection.",
    );
  }

  if (!content.trim()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Story content is required for plot hole detection.",
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(buildDetectionPrompt(title, content));
    const text = result.response.text();

    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed.plotHoles)) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "Invalid AI response: plotHoles must be an array.",
      );
    }

    return {
      plotHoles: parsed.plotHoles,
      summary: parsed.summary || "No analysis summary provided.",
      score: typeof parsed.score === "number" ? parsed.score : 100,
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `Plot hole detection failed: ${errorMsg}`,
    );
  }
};
