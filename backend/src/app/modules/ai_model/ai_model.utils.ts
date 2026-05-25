import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { fetchImageURL } from "../../../utils/image_generation";
import config from "../../../config";
import { v4 as uuidv4 } from "uuid";
import { IAlternateEnding } from "./ai_model.interface";

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

export async function generateWithGeminiStories(
  prompt: string,
  wordLength: number = 250,
  numStories: number = 2
): Promise<Story[]> {
  try {
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
    const text = response.response.text();
    const stories: Story[] = JSON.parse(text);
    const imagePromises = stories.map((story) => fetchImageURL(story.tag));
    const imageResults = await Promise.all(imagePromises);
    return stories.map((story, index) => ({
      ...story,
      imageURL: imageResults[index].imageUrl,
      uuid: uuidv4(),
    }));
  } catch (error) {
    return [];
  }
}

export async function generateAlternateEndingsWithGemini(
  title: string,
  content: string,
  tag: string
): Promise<IAlternateEnding[]> {
  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });
    const response = await chatSession.sendMessage(
      `You are a professional narrative editor. Analyze the following story (Title: "${title}", Genre/Tag: "${tag}"):
      
      Story Content:
      "${content}"
      
      Generate 5 alternate endings for this story corresponding to the following styles:
      1. "Happy Ending"
      2. "Dark Ending"
      3. "Plot Twist Ending"
      4. "Open Ending"
      5. "Cliffhanger Ending"
      
      For each alternate ending, provide:
      - "style": The style name exactly as listed above.
      - "ending": A short paragraph or two describing the alternate ending scene itself.
      - "fullStory": The complete rewritten story with this new ending seamlessly integrated. The new ending should replace the original ending of the story, preserving the original story's context, setup, character names, and writing tone.
      
      Return the output as a JSON array of objects with the fields: "style", "ending", and "fullStory".`
    );
    const text = response.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating alternate endings with Gemini:", error);
    return [];
  }
}

