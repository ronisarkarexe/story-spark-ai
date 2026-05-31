import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import config from "../../../config";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { IConsistencyReport } from "./consistency.interface";

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 0.2, // Lower temperature for more factual analysis
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const sanitizeJsonText = (rawText: string): string => {
  const trimmed = rawText.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }
  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
};

export async function analyzeConsistencyWithGemini(
  storyTitle: string,
  storyContent: string
): Promise<Partial<IConsistencyReport>> {
  if (!config.gemini_api_key) {
    // Return dummy data if no key is provided
    return {
      score: 85,
      characters: [
        {
          name: "Vance",
          traits: ["Brave", "Curious"],
          abilities: ["Diving", "Investigation"],
          relationships: [],
        },
      ],
      timeline: [
        {
          chapter: 1,
          description: "Vance arrives at the ruins.",
          entitiesInvolved: ["Vance", "Iron Citadel"],
        },
      ],
      contradictions: [
        {
          type: "Timeline",
          description: "The sun was setting, but in the previous paragraph it was high noon.",
          suggestedFix: "Change 'sun was setting' to 'sun beat down'.",
        },
      ],
    };
  }

  const prompt = `You are an expert narrative consistency editor. Analyze the following story for contradictions, timeline consistency, and character continuity.
  
Story Title: ${storyTitle}
Story Content:
${storyContent}

Your output MUST be a JSON object conforming to this structure exactly:
{
  "score": <number between 0 and 100 representing overall consistency>,
  "characters": [
    {
      "name": "<Character Name>",
      "traits": ["<trait1>", "<trait2>"],
      "abilities": ["<ability1>"],
      "relationships": [
        { "target": "<other character>", "relationshipType": "<friend/foe/etc>" }
      ]
    }
  ],
  "timeline": [
    {
      "chapter": <chapter number (default 1)>,
      "description": "<what happened>",
      "entitiesInvolved": ["<entity names>"]
    }
  ],
  "contradictions": [
    {
      "type": "<Timeline|Character|Worldbuilding|Plot>",
      "description": "<Description of the contradiction>",
      "suggestedFix": "<How to fix it>"
    }
  ]
}

Return ONLY the raw JSON object.`;

  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const response = await chatSession.sendMessage(prompt);
    const text = response.response.text();
    const parsed = JSON.parse(sanitizeJsonText(text));

    return parsed as Partial<IConsistencyReport>;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI consistency analysis failed: ${errorMsg}`
    );
  }
}
