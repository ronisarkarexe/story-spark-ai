import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { fetchImageURL } from "../../../utils/image_generation";
import config from "../../../config";
import { v4 as uuidv4 } from "uuid";
import { GenerationAbortedError } from "../../../utils/generation_timeout";

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
  signal?: AbortSignal
): Promise<Story[]> {
  throwIfAborted(signal);

  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const response = await chatSession.sendMessage(
    `Generate ${numStories} different short stories based on the following prompt: "${prompt}".
        Each story should be in JSON format with fields: "title", "content", and "tag".
        Ensure each story is approximately ${wordLength} words long.
        Return the output as a JSON array.`
  );

  throwIfAborted(signal);

  const text = response.response.text();
  let stories: Story[];

  try {
    stories = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid JSON for story generation");
  }

  if (!Array.isArray(stories) || stories.length === 0) {
    throw new Error("Gemini returned no stories");
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
    imageURL: imageResults[index].imageUrl,
    uuid: uuidv4(),
  }));
}
