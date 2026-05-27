import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { fetchImageURL } from "../../../utils/image_generation";
import { GenerationAbortedError } from "../../../utils/generation_timeout";
import config from "../../../config";
import { v4 as uuidv4 } from "uuid";
import { IAlternateEnding } from "./ai_model.interface";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 1,
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

interface Story {
  title: string;
  content: string;
  tag: string;
  imageURL?: string;
  language?: string;
}

const throwIfAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) {
    throw new GenerationAbortedError();
  }
};

export async function generateWithGeminiStories(
  prompt: string,
  wordLength: number = 250,
  numStories: number = 2,
  language: string = "English",
  signal?: AbortSignal
): Promise<Story[]> {
  throwIfAborted(signal);

  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const response = await chatSession.sendMessage(
      `Generate ${numStories} different short stories based on the following prompt: "${prompt}".
        The stories MUST be written entirely in the ${language} language.
        Each story should be in JSON format with fields: "title", "content", and "tag".
        Ensure each story is approximately ${wordLength} words long.
        The "tag" field should contain a 1-2 word genre or theme in English (e.g., "drama", "comedy", "fantasy") so it can be used for image lookup, while the "title" and "content" MUST be written in the ${language} language.
        Return the output as a JSON array.`
    );

    throwIfAborted(signal);

    const text = response.response.text();
    let stories: Story[];

    try {
      stories = JSON.parse(text);
    } catch (parseError: unknown) {
      const parseErrorMsg = parseError instanceof Error ? parseError.message : String(parseError);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Gemini returned invalid JSON for story generation: ${parseErrorMsg}`
      );
    }

    if (!Array.isArray(stories) || stories.length === 0) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Gemini returned no stories or invalid story structure"
      );
    }

    const imageResults = await Promise.all(
      stories.map(async (story) => {
        throwIfAborted(signal);
        return fetchImageURL(story.tag);
      })
    );

    throwIfAborted(signal);

    return stories.map((story, index) => ({
      ...story,
      language,
      imageURL: imageResults[index].imageUrl,
      uuid: uuidv4(),
    }));
  } catch (error: unknown) {
    if (error instanceof ApiError || error instanceof GenerationAbortedError) {
      throw error;
    }
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI generation failed: ${errorMsg}`
    );
  }
}

export async function generateAlternateEndingsWithGemini(
  title: string,
  content: string,

  tag: string,
  language: string = "English"

 

): Promise<IAlternateEnding[]> {
  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });
    const response = await chatSession.sendMessage(

      `You are a professional narrative editor. Analyze the following story (Title: "${title}", Genre/Tag: "${tag}", Language: "${language}"):

      
      
      Story Content:
      "${content}"
      
      Generate 5 alternate endings for this story corresponding to the following styles:
      1. "Happy Ending"
      2. "Dark Ending"
      3. "Plot Twist Ending"
      4. "Open Ending"
      5. "Cliffhanger Ending"
      
      The generated alternate endings and the rewritten stories MUST be written entirely in the ${language} language.
      For each alternate ending, provide:
      - "style": The style name exactly as listed above.
      - "ending": A short paragraph or two describing the alternate ending scene itself.
      - "fullStory": The complete rewritten story with this new ending seamlessly integrated. The new ending should replace the original ending of the story, preserving the original story's context, setup, character names, and writing tone.
      
      Return the output as a JSON array of objects with the fields: "style", "ending", and "fullStory".`
    );
    const text = response.response.text();
    
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (parseError: unknown) {
      const parseErrorMsg = parseError instanceof Error ? parseError.message : String(parseError);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Gemini returned invalid JSON for alternate endings: ${parseErrorMsg}`
      );
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid AI response: Expected a non-empty JSON array."
      );
    }

    const isValid = parsed.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.style === "string" &&
        typeof item.ending === "string" &&
        typeof item.fullStory === "string"
    );

    if (!isValid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid AI response: Alternate endings are malformed."
      );
    }

    return parsed;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI generation of alternate endings failed: ${errorMsg}`
    );
  }
}
