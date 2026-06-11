import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { Post } from "../post/post.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";
import { IEducationalInsights } from "./educational-insights.types";

const geminiApiKey = config.gemini_api_key?.trim() ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

const getGeminiModel = () => {
  if (!geminiApiKey) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Gemini API key is not configured."
    );
  }
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
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

const countSyllables = (word: string): number => {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  const vowels = "aeiouy";
  let count = 0;
  let prevVowel = false;
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevVowel) {
      count++;
    }
    prevVowel = isVowel;
  }
  if (word.endsWith("e")) {
    count--;
  }
  return Math.max(1, count);
};

export const estimateReadingLevel = (content: string) => {
  const cleanText = content.replace(/[\r\n]+/g, " ").trim();
  const sentences = content
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const words = cleanText
    .split(/\s+/)
    .map((w) => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").toLowerCase())
    .filter(Boolean);
  const paragraphs = content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const paragraphCount = Math.max(1, paragraphs.length);

  const asl = wordCount / sentenceCount;
  const apl = wordCount / paragraphCount;

  const complexWordsCount = words.filter((w) => countSyllables(w) >= 3).length;
  const pcw = wordCount > 0 ? (complexWordsCount / wordCount) * 100 : 0;

  // Fog Index: 0.4 * (ASL + percentage of complex words)
  const gradeVal = 0.4 * (asl + pcw);
  const gradeLevelNum = Math.max(1, Math.round(gradeVal));

  let gradeLevel = "";
  let ageRange = "";

  if (gradeLevelNum <= 2) {
    gradeLevel = "Grade 1 - 2";
    ageRange = "6 - 8 years";
  } else if (gradeLevelNum <= 4) {
    gradeLevel = "Grade 3 - 4";
    ageRange = "8 - 10 years";
  } else if (gradeLevelNum <= 6) {
    gradeLevel = "Grade 5 - 6";
    ageRange = "10 - 12 years";
  } else if (gradeLevelNum <= 8) {
    gradeLevel = "Grade 7 - 8";
    ageRange = "12 - 14 years";
  } else if (gradeLevelNum <= 12) {
    gradeLevel = "Grade 9 - 12";
    ageRange = "14 - 18 years";
  } else {
    gradeLevel = "College / Professional";
    ageRange = "18+ years";
  }

  const explanation = `Calculated grade estimate (${gradeLevel}) based on a sentence complexity of ${asl.toFixed(
    1
  )} words per sentence, ${pcw.toFixed(
    1
  )}% multi-syllable vocabulary words, and an average paragraph length of ${apl.toFixed(
    1
  )} words.`;

  return {
    gradeLevel,
    ageRange,
    explanation,
  };
};

const generateEducationalInsights = async (
  storyId: string,
  userId: string
): Promise<IEducationalInsights> => {
  const story = await Post.findById(storyId);

  if (!story) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story not found!");
  }

  if (story.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have access to this story!"
    );
  }

  if (!story.content || story.content.trim() === "") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Story content is empty!");
  }

  const readingLevel = estimateReadingLevel(story.content);

  const model = getGeminiModel();

  const prompt = `
    You are an educational insights generator. Analyze the following story and generate learning resources for teachers, parents, and students.
    
    Story Title: "${story.title}"
    Story Content:
    "${story.content}"

    Generate the following resource elements in JSON format:
    1. "vocabulary": An array of 5 to 10 context-aware vocabulary words. For each word, find:
       - "word": The word from the story.
       - "definition": A concise definition.
       - "example": The sentence from the story containing the word.
       (Avoid common stop words).
    2. "comprehensionQuestions": 3 to 5 open-ended comprehension questions checking plot, motivations, cause and effect, or events.
    3. "discussionQuestions": 3 to 5 reflective questions encouraging critical thinking.
    4. "themes": Major themes (friendship, courage, perseverance, identity, etc.). Each theme must have:
       - "theme": The name of the theme.
       - "explanation": Brief details on how the story represents this theme.
    5. "moralLessons": 1 to 3 moral lessons/takeaways.
    6. "writingPrompts": 3 creative writing prompts inspired by the story.

    Ensure that all arrays are populated and NEVER null.
    Your output must be a valid JSON object matching this structure EXACTLY:
    {
      "vocabulary": [{"word": "...", "definition": "...", "example": "..."}],
      "comprehensionQuestions": ["...", "..."],
      "discussionQuestions": ["...", "..."],
      "themes": [{"theme": "...", "explanation": "..."}],
      "moralLessons": ["...", "..."],
      "writingPrompts": ["...", "..."]
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        responseMimeType: "application/json",
      },
    });

    const rawText = result.response.text();
    const cleanJson = sanitizeJsonText(rawText);
    const parsed = JSON.parse(cleanJson);

    return {
      vocabulary: parsed.vocabulary || [],
      comprehensionQuestions: parsed.comprehensionQuestions || [],
      discussionQuestions: parsed.discussionQuestions || [],
      themes: parsed.themes || [],
      moralLessons: parsed.moralLessons || [],
      writingPrompts: parsed.writingPrompts || [],
      readingLevel,
    };
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `Failed to generate educational insights from AI. (${error.message})`
    );
  }
};

export const EducationalInsightsService = {
  estimateReadingLevel,
  generateEducationalInsights,
};
