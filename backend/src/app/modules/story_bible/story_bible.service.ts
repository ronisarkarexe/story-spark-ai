import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";
import { StoryBible } from "./story_bible.model";
import { IStoryBible } from "./story_bible.interface";
import { Post } from "../post/post.model";

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const getStoryBible = async (storyId: string) => {
  return await StoryBible.findOne({ storyId });
};

export const updateStoryBible = async (storyId: string, payload: Partial<IStoryBible>) => {
  return await StoryBible.findOneAndUpdate(
    { storyId },
    { $set: payload },
    { new: true, upsert: true }
  );
};

export const extractStoryBible = async (storyId: string) => {
  // 1. Fetch the story
  const story = await Post.findById(storyId);
  if (!story) {
    throw new Error("Story not found");
  }

  // 2. Prepare the prompt for Gemini
  const prompt = `You are an expert narrative analyst and "Story Bible" creator.
Analyze the following story text and extract all key narrative entities to build a comprehensive Story Bible.

Entities to extract:
1. Characters: Identify all characters, their roles, physical traits, personality, and background.
2. Locations: Identify all distinct locations, their descriptions, and history.
3. Objects: Identify key objects or artifacts, their descriptions, and significance.
4. Relationships: Identify the dynamics between key characters (e.g., friends, enemies, siblings).
5. Timeline Events: Identify chronological key events described in the text.

Return ONLY a valid JSON object matching this exact structure:
{
  "characters": [
    { "name": "", "role": "", "physicalTraits": "", "personality": "", "background": "", "notes": "" }
  ],
  "locations": [
    { "name": "", "description": "", "history": "", "notes": "" }
  ],
  "objects": [
    { "name": "", "description": "", "significance": "", "notes": "" }
  ],
  "relationships": [
    { "character1": "", "character2": "", "relationshipType": "", "dynamics": "" }
  ],
  "timelineEvents": [
    { "dateOrTime": "", "description": "", "charactersInvolved": [""] }
  ]
}

Story Text:
"""
${story.content}
"""`;

  // 3. Call Gemini API
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleanJsonText = text.replace(/```json|```/g, "").trim();
  
  let extractedData;
  try {
    extractedData = JSON.parse(cleanJsonText);
  } catch (err) {
    console.error("Failed to parse Gemini response", cleanJsonText);
    throw new Error("Failed to parse extracted story bible data.");
  }

  // 4. Upsert the Story Bible in the DB
  const existingBible = await StoryBible.findOne({ storyId });
  
  if (!existingBible) {
    // Create new
    return await StoryBible.create({
      storyId,
      ...extractedData
    });
  } else {
    // Basic merge: for this MVP, we will overwrite the auto-extracted fields
    // A more complex implementation could try to merge, but we'll overwrite to keep the extracted source of truth fresh.
    existingBible.characters = extractedData.characters || [];
    existingBible.locations = extractedData.locations || [];
    existingBible.objects = extractedData.objects || [];
    existingBible.relationships = extractedData.relationships || [];
    existingBible.timelineEvents = extractedData.timelineEvents || [];
    
    await existingBible.save();
    return existingBible;
  }
};
