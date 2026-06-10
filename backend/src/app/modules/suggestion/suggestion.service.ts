import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import config from "../../../config";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { Suggestion } from "./suggestion.model";
import { ISuggestion, SuggestionType } from "./suggestion.interface";
import { Types } from "mongoose";

const geminiApiKey = config.gemini_api_key?.trim() ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const getSuggestionPrompt = (
  type: SuggestionType,
  storyContext: string,
  originalText?: string,
  instructions?: string
): string => {
  const baseContext = `Story Context so far:\n"${storyContext}"\n${
    originalText ? `Selected/Highlighted text to analyze:\n"${originalText}"\n` : ""
  }${instructions ? `User instructions/preferences:\n"${instructions}"\n` : ""}`;

  switch (type) {
    case "plot":
      return `${baseContext}
      Task: Continue the story naturally. Generate multiple continuation paths (exactly 2) and one unexpected plot twist.
      Respond ONLY with a JSON object conforming to this structure:
      {
        "suggestions": [
          { "title": "Path title", "description": "Details of path progression", "outcome": "Eventual result" }
        ],
        "unexpectedTwist": { "title": "Twist title", "description": "Unexpected plot twist description" }
      }`;
    case "character":
      return `${baseContext}
      Task: Generate character development suggestions based on the story context or selected text.
      Respond ONLY with a JSON object conforming to this structure:
      {
        "growthIdeas": ["idea 1", "idea 2"],
        "flaws": ["suggested flaw 1", "suggested flaw 2"],
        "motivations": ["underlying motivation 1"],
        "backstoryEnhancements": "enhancement suggestion details",
        "relationshipImprovements": "relationship dynamic enhancements"
      }`;
    case "dialogue":
      return `${baseContext}
      Task: Rewrite dialogue to improve emotional depth, realism, and pacing. Use the highlighted text if provided.
      Respond ONLY with a JSON object conforming to this structure:
      {
        "rewrites": [
          { "original": "original text or quote", "improved": "improved dialogue script", "explanation": "why this change benefits the scene" }
        ],
        "pacingTips": "action/dialogue balance advice"
      }`;
    case "scene":
      return `${baseContext}
      Task: Provide scene description suggestions containing sensory descriptions, environment details, mood and atmosphere.
      Respond ONLY with a JSON object conforming to this structure:
      {
        "environmentEnhancements": "tactile and visual enhancement suggestions",
        "sensoryDetails": {
          "sight": "visual imagery description",
          "sound": "auditory details",
          "smell": "olfactory details",
          "touch": "tactile textures",
          "taste": "taste details if applicable"
        },
        "moodAndAtmosphere": "atmosphere recommendations"
      }`;
    case "structure":
      return `${baseContext}
      Task: Provide story structure recommendations covering beginning, midpoint, climax, and ending improvements.
      Respond ONLY with a JSON object conforming to this structure:
      {
        "beginningImprovements": "hook adjustments",
        "midpointImprovements": "midpoint escalation advice",
        "climaxRecommendations": "climax payoff details",
        "endingRecommendations": "resolution ideas"
      }`;
    case "tone":
      return `${baseContext}
      Task: Enhance the tone & style of the selected text or story context. Generate stylistic variants.
      Respond ONLY with a JSON object conforming to this structure:
      {
        "suspenseful": "Rewritten text variant with suspenseful tone",
        "emotional": "Rewritten text variant with emotional depth",
        "humorous": "Rewritten text variant with humorous flavor",
        "dramatic": "Rewritten text variant with dramatic structure",
        "descriptive": "Rewritten text variant with descriptive details"
      }`;
    case "conflict":
      return `${baseContext}
      Task: Escalate the story dynamics by generating conflicts.
      Respond ONLY with a JSON object conforming to this structure:
      {
        "internalConflicts": "internal struggle suggestions",
        "externalConflicts": "external threats or hurdles",
        "relationshipConflicts": "relationship friction points",
        "mysteryCreation": "unsolved questions or hook details",
        "tensionEscalation": "escalating pressure details"
      }`;
  }
};

const generateSuggestion = async (
  userId: string,
  payload: {
    storyId?: string;
    suggestionType: SuggestionType;
    originalText?: string;
    storyContext: string;
    additionalInstructions?: string;
  }
) => {
  if (!geminiApiKey) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Gemini API key is not configured.");
  }

  const prompt = getSuggestionPrompt(
    payload.suggestionType,
    payload.storyContext,
    payload.originalText,
    payload.additionalInstructions
  );

  try {
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const rawText = response.response.text().trim();
    const parsedSuggestion = JSON.parse(rawText);

    // Persist history
    const record = await Suggestion.create({
      userId: new Types.ObjectId(userId),
      storyId: payload.storyId ? new Types.ObjectId(payload.storyId) : undefined,
      suggestionType: payload.suggestionType,
      originalText: payload.originalText || "",
      storyContext: payload.storyContext,
      generatedSuggestion: parsedSuggestion,
      accepted: false,
      rejected: false,
    });

    return record;
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `AI suggestion generation failed: ${errorMsg}`
    );
  }
};

const acceptSuggestion = async (userId: string, suggestionId: string) => {
  const result = await Suggestion.findOneAndUpdate(
    { _id: new Types.ObjectId(suggestionId), userId: new Types.ObjectId(userId) },
    { $set: { accepted: true, rejected: false } },
    { new: true }
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Suggestion record not found.");
  }
  return result;
};

const rejectSuggestion = async (userId: string, suggestionId: string) => {
  const result = await Suggestion.findOneAndUpdate(
    { _id: new Types.ObjectId(suggestionId), userId: new Types.ObjectId(userId) },
    { $set: { rejected: true, accepted: false } },
    { new: true }
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Suggestion record not found.");
  }
  return result;
};

const getSuggestionsHistory = async (userId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const data = await Suggestion.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Suggestion.countDocuments({ userId: new Types.ObjectId(userId) });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const deleteSuggestionFromHistory = async (userId: string, suggestionId: string) => {
  const result = await Suggestion.findOneAndDelete({
    _id: new Types.ObjectId(suggestionId),
    userId: new Types.ObjectId(userId),
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Suggestion record not found.");
  }
  return { message: "Suggestion history deleted successfully!" };
};

export const SuggestionService = {
  generateSuggestion,
  acceptSuggestion,
  rejectSuggestion,
  getSuggestionsHistory,
  deleteSuggestionFromHistory,
};
