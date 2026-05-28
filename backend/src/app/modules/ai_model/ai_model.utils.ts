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
  uuid?: string;
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

export async function generateWithGeminiStories(
  prompt: string,
  wordLength: number = 250,
  numStories: number = 2,
  language: string = "English",
  signal?: AbortSignal
): Promise<Story[]> {
  throwIfAborted(signal);

  if (!config.gemini_api_key) {
    return [
      {
        uuid: uuidv4(),
        title: "The Silent Watcher of the Reef",
        content: "Deep below the surface of the cyan lagoon, a creature of ancient wisdom watched the shifts in the tides. It was a bioluminescent manta ray, carrying patterns on its back that mirrored the constellations above. For generations, the fishermen had told stories of the guide that saved lost ships, but none had seen it up close until today. A young diver, searching for lost artifacts, found herself caught in a strong undertow. As her air began to run low, a gentle warmth illuminated the dark water. The ray appeared, gliding effortlessly through the current, creating a path of calm water that allowed her to ascend safely back to the boat.",
        tag: "Adventure",
        imageURL: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
      },
      {
        uuid: uuidv4(),
        title: "Lost Echoes of the Iron Citadel",
        content: "The ruins of the Iron Citadel rose like rusted fingers from the salt flats of Arrakis-9. Major Vance adjusted his environmental suit as the twin suns began their descent. His sensors had picked up a rhythmic pulse originating from deep within the central chamber. It sounded like an old distress beacon, but this sector had been abandoned since the wars. Pushing past the heavy collapsed blast doors, Vance shone his light into the dark abyss. On the floor lay a deactivated service android, its power core long dead, yet its internal memory bank was warm to the touch. The story of what happened during the final siege was recorded here, waiting to be retrieved.",
        tag: "Sci-Fi",
        imageURL: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
      }
    ];
  }

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
        Return only valid JSON array output.`
    );

    throwIfAborted(signal);

    const text = response.response.text();
    const parsed = JSON.parse(sanitizeJsonText(text));
    const stories: Story[] = Array.isArray(parsed) ? parsed : parsed?.stories;

    if (!Array.isArray(stories) || stories.length === 0) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "Invalid AI response: Expected a non-empty story array."
      );
    }

    // Fetch images for stories concurrently
    const imagePromises = stories.map(async (story) => {
      try {
        const imageResponse = await fetchImageURL(String(story?.tag ?? story?.title ?? ""));
        return imageResponse?.imageUrl || "";
      } catch (e) {
        return "";
      }
    });
    
    const imageUrls = await Promise.all(imagePromises);

    return stories.map((story, index) => ({
      ...story,
      language,
      imageURL: imageUrls[index],
      uuid: uuidv4(),
    }));
  } catch (error: unknown) {
    if (error instanceof ApiError || error instanceof GenerationAbortedError) {
      throw error;
    }

    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `AI story generation failed: ${errorMsg}`
    );
  }
}

export async function generateAlternateEndingsWithGemini(
  title: string,
  content: string,
  tag: string,
  language: string = "English"
): Promise<IAlternateEnding[]> {
  if (!config.gemini_api_key) {
    return [
      {
        style: "Happy Ending",
        ending: "The diver reached the surface safely and the ray disappeared into the deep, leaving behind a glowing seashell that she kept as a token of the encounter.",
        fullStory: "Deep below the surface of the cyan lagoon, a creature of ancient wisdom watched the shifts in the tides. It was a bioluminescent manta ray, carrying patterns on its back that mirrored the constellations above. For generations, the fishermen had told stories of the guide that saved lost ships, but none had seen it up close until today. A young diver, searching for lost artifacts, found herself caught in a strong undertow. As her air began to run low, a gentle warmth illuminated the dark water. The ray appeared, gliding effortlessly through the current, creating a path of calm water that allowed her to ascend safely back to the boat. The diver reached the surface safely and the ray disappeared into the deep, leaving behind a glowing seashell that she kept as a token of the encounter.",
      },
      {
        style: "Dark Ending",
        ending: "But the warmth was an illusion; the ray was merely drawing her deeper into the abyssal trenches where the light of the sun could never reach.",
        fullStory: "Deep below the surface of the cyan lagoon, a creature of ancient wisdom watched the shifts in the tides. It was a bioluminescent manta ray, carrying patterns on its back that mirrored the constellations above. For generations, the fishermen had told stories of the guide that saved lost ships, but none had seen it up close until today. A young diver, searching for lost artifacts, found herself caught in a strong undertow. As her air began to run low, a gentle warmth illuminated the dark water. The ray appeared, gliding effortlessly through the current, creating a path of calm water. But the warmth was an illusion; the ray was merely drawing her deeper into the abyssal trenches where the light of the sun could never reach.",
      },
      {
        style: "Plot Twist Ending",
        ending: "When she looked at the ray's patterns, she realized they were not stars, but coordinate maps of the underwater ruins she was searching for.",
        fullStory: "Deep below the surface of the cyan lagoon, a creature of ancient wisdom watched the shifts in the tides. It was a bioluminescent manta ray, carrying patterns on its back that mirrored the constellations above. For generations, the fishermen had told stories of the guide that saved lost ships, but none had seen it up close until today. A young diver, searching for lost artifacts, found herself caught in a strong undertow. As her air began to run low, a gentle warmth illuminated the dark water. The ray appeared, gliding effortlessly through the current, creating a path of calm water that allowed her to ascend safely back to the boat. When she looked at the ray's patterns, she realized they were not stars, but coordinate maps of the underwater ruins she was searching for.",
      },
      {
        style: "Open Ending",
        ending: "She blinked, finding herself on the beach, the sun high in the sky. She wasn't sure if it was a dream or if she had actually met the guardian.",
        fullStory: "Deep below the surface of the cyan lagoon, a creature of ancient wisdom watched the shifts in the tides. It was a bioluminescent manta ray, carrying patterns on its back that mirrored the constellations above. For generations, the fishermen had told stories of the guide that saved lost ships, but none had seen it up close until today. A young diver, searching for lost artifacts, found herself caught in a strong undertow. As her air began to run low, a gentle warmth illuminated the dark water. The ray appeared, gliding effortlessly through the current. She blinked, finding herself on the beach, the sun high in the sky. She wasn't sure if it was a dream or if she had actually met the guardian.",
      },
      {
        style: "Cliffhanger Ending",
        ending: "As she climbed onto the boat, she heard a voice inside her mind whisper: 'We will meet again, Vance.'",
        fullStory: "Deep below the surface of the cyan lagoon, a creature of ancient wisdom watched the shifts in the tides. It was a bioluminescent manta ray, carrying patterns on its back that mirrored the constellations above. For generations, the fishermen had told stories of the guide that saved lost ships, but none had seen it up close until today. A young diver, searching for lost artifacts, found herself caught in a strong undertow. As her air began to run low, a gentle warmth illuminated the dark water. The ray appeared, gliding effortlessly through the current, creating a path of calm water that allowed her to ascend safely back to the boat. As she climbed onto the boat, she heard a voice inside her mind whisper: 'We will meet again, Vance.'"
      }
    ];
  }

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
      parsed = JSON.parse(sanitizeJsonText(text));
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

export async function generateRemixWithGemini(
  title: string,
  content: string,
  tag: string,
  remixType: string,
  remixOption: string,
  language: string = "English"
): Promise<{ title: string; content: string; tag: string }> {
  const remixPrompts: Record<string, string> = {
    setting: `Rewrite this story keeping the same plot and characters but change the setting to: ${remixOption}. Keep the same story structure.`,
    perspective: `Rewrite this story from the perspective of: ${remixOption}. Keep the same events but show them from this character's point of view.`,
    time_period: `Rewrite this story keeping the same plot but set it in: ${remixOption}. Adjust all details to fit the time period.`,
    tone: `Rewrite this story keeping the same plot but change the tone to: ${remixOption}. Adjust the writing style accordingly.`,
    gender_swap: `Rewrite this story with all characters gender-swapped. Keep the same plot and events.`,
  };

  const remixInstruction = remixPrompts[remixType] || remixPrompts.tone;

  const prompt = `You are a creative writing assistant. Here is a story:

Title: ${title}
Content: ${content}
Genre: ${tag}

Task: ${remixInstruction}

Write the remixed story in ${language}. Return a JSON object with this exact structure:
{
  "title": "remixed story title",
  "content": "full remixed story content",
  "tag": "${tag}"
}`;

  try {
    const chatSession = model.startChat({
      generationConfig: {
        ...generationConfig,
        maxOutputTokens: 4096,
      },
      safetySettings,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const rawText = result.response.text();
    const cleanText = sanitizeJsonText(rawText);
    const parsed = JSON.parse(cleanText);

    if (!parsed.title || !parsed.content) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid remix response from AI.");
    }

    return parsed;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI remix generation failed: ${errorMsg}`
    );
  }
}
