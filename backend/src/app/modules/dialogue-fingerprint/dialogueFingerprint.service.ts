import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { Post } from "../post/post.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";
import {
  ICharacterDialogueAnalysis,
  IDialogueFingerprintResponse,
  IRecommendation,
  ISimilarityAnalysis,
} from "./dialogueFingerprint.types";

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

const estimateDialogueSegments = (content: string): number => {
  const quoteRegex = /"([^"]+)"|'([^']+)'|“([^”]+)”|‘([^’]+)’/g;
  const matches = content.match(quoteRegex);
  return matches ? matches.length : 0;
};

const STOP_WORDS = new Set([
  "the", "a", "and", "to", "of", "in", "is", "it", "that", "you",
  "he", "she", "was", "for", "on", "are", "as", "with", "his",
  "they", "i", "but", "at", "by", "an", "this", "my", "we",
  "have", "had", "has", "was", "were", "be", "been", "do", "did", "does"
]);

const getFrequentWords = (dialogues: string[]): string[] => {
  const counts: Record<string, number> = {};
  dialogues.forEach((d) => {
    const words = d
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'“”‘’]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 0);
    
    words.forEach((w) => {
      if (!STOP_WORDS.has(w)) {
        counts[w] = (counts[w] || 0) + 1;
      }
    });
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

const analyzeDialogueVoices = async (
  storyId: string,
  userId: string
): Promise<IDialogueFingerprintResponse> => {
  const story = await Post.findById(storyId);

  if (!story) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story not found.");
  }

  if (story.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have access to this story."
    );
  }

  if (!story.content || story.content.trim() === "") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Story content is empty.");
  }

  // Pre-validate dialog presence
  const rawQuoteCount = estimateDialogueSegments(story.content);
  if (rawQuoteCount === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No dialogue detected.");
  }
  if (rawQuoteCount < 2) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Insufficient dialogue for analysis."
    );
  }

  const model = getGeminiModel();

  const prompt = `
    You are an expert dialogue analysis tool for authors.
    Analyze the following story and extract dialogue for all characters.

    Story Content:
    "${story.content}"

    Instructions:
    1. Extract dialogue segments from the story. A segment is a quoted speech.
    2. Attribute dialogue to the speaker if attribution is present.
    3. If the speaker cannot be identified but dialogue is spoken by someone, group the dialogue under a fallback label such as "Unknown Speaker 1", "Unknown Speaker 2", etc.
    4. Ignore narration-only sections.
    5. For each character found:
       - "character": Name of the character (e.g. "Emma", "Unknown Speaker 1").
       - "dialogues": Array of all their dialogue lines (quoted text only, without quotes).
       - "tone": A 1-2 word description of their tone (e.g. "Encouraging", "Sarcastic", "Formal").
       - "catchphrases": Recurring expressions or signature wording they use in their speech.
    6. Generate actionable improvement suggestions for character dialogue under "recommendations".
       - "character": Character name.
       - "suggestion": How to differentiate or improve their dialogue without rewriting the story (e.g., "Give Liam more contractions to sound casual", "Reduce repeated phrases").
     
    Your output must be a valid JSON object matching this structure EXACTLY:
    {
      "extractedCharacters": [
        {
          "character": "Emma",
          "dialogues": ["I won't give up.", "We have to try again."],
          "tone": "Encouraging",
          "catchphrases": ["we have to"]
        }
      ],
      "recommendations": [
        {
          "character": "Emma",
          "suggestion": "Give Emma a unique catchphrase to emphasize her role."
        }
      ]
    }
  `;

  let parsedResponse;
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        responseMimeType: "application/json",
      },
    });

    const rawText = result.response.text();
    const cleanJson = sanitizeJsonText(rawText);
    parsedResponse = JSON.parse(cleanJson);
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `Failed to generate dialogue analysis from AI. (${error.message})`
    );
  }

  const extracted = parsedResponse.extractedCharacters || [];
  const recs: IRecommendation[] = parsedResponse.recommendations || [];

  // Filter out characters with no dialogue segments
  const charactersWithDialogue = extracted.filter(
    (c: any) => c.dialogues && c.dialogues.length > 0
  );

  // Validate we have dialogue segments overall
  const totalDialogues = charactersWithDialogue.reduce(
    (sum: number, c: any) => sum + c.dialogues.length,
    0
  );

  if (totalDialogues === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No dialogue detected.");
  }
  if (totalDialogues < 2) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Insufficient dialogue for analysis."
    );
  }

  // Programmatically calculate fingerprints
  const analyzedCharacters: ICharacterDialogueAnalysis[] = charactersWithDialogue.map(
    (c: any) => {
      const dialogues: string[] = c.dialogues;
      let totalWords = 0;
      let totalSentences = 0;
      let totalContractions = 0;
      let totalQuestions = 0;
      let totalExclamations = 0;

      dialogues.forEach((d) => {
        const sentenceSplit = d.split(/[.!?]+/).filter((s) => s.trim().length > 0);
        totalSentences += Math.max(1, sentenceSplit.length);

        const words = d.split(/\s+/).filter((w) => w.length > 0);
        totalWords += words.length;

        // Check for contractions: contains ' or ’
        words.forEach((w) => {
          if (w.includes("'") || w.includes("’")) {
            totalContractions++;
          }
        });

        // Question and Exclamation counts
        if (d.includes("?")) {
          totalQuestions++;
        }
        if (d.includes("!")) {
          totalExclamations++;
        }
      });

      const averageSentenceLength =
        totalSentences > 0 ? parseFloat((totalWords / totalSentences).toFixed(1)) : 0;
      
      const contractionRate =
        totalWords > 0 ? parseFloat((totalContractions / totalWords).toFixed(2)) : 0;

      return {
        character: c.character,
        dialogues,
        fingerprint: {
          tone: c.tone || "Neutral",
          averageSentenceLength,
          contractionRate,
          frequentWords: getFrequentWords(dialogues),
          catchphrases: c.catchphrases || [],
        },
        distinctivenessScore: 100, // Will be computed next
      };
    }
  );

  // Compute similarities and distinctiveness
  const similarities: ISimilarityAnalysis[] = [];
  const characterWords: Record<string, Set<string>> = {};

  analyzedCharacters.forEach((char) => {
    const wordsSet = new Set<string>();
    char.dialogues.forEach((d) => {
      d.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'“”‘’]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 0 && !STOP_WORDS.has(w))
        .forEach((w) => wordsSet.add(w));
    });
    characterWords[char.character] = wordsSet;
  });

  const getJaccardSimilarity = (setA: Set<string>, setB: Set<string>): number => {
    if (setA.size === 0 && setB.size === 0) return 1.0;
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  };

  const similarityMap: Record<string, number[]> = {};
  analyzedCharacters.forEach((c) => {
    similarityMap[c.character] = [];
  });

  for (let i = 0; i < analyzedCharacters.length; i++) {
    for (let j = i + 1; j < analyzedCharacters.length; j++) {
      const charA = analyzedCharacters[i];
      const charB = analyzedCharacters[j];

      // Vocab similarity (Jaccard)
      const vocabSim = getJaccardSimilarity(
        characterWords[charA.character],
        characterWords[charB.character]
      );

      // Structural similarity (average sentence length & contraction rate)
      const maxASL = Math.max(
        charA.fingerprint.averageSentenceLength,
        charB.fingerprint.averageSentenceLength,
        1
      );
      const aslSim =
        1 - Math.abs(charA.fingerprint.averageSentenceLength - charB.fingerprint.averageSentenceLength) / maxASL;

      const contractionSim = 1 - Math.abs(charA.fingerprint.contractionRate - charB.fingerprint.contractionRate);

      // Final similarity metric
      const structSim = aslSim * 0.5 + contractionSim * 0.5;
      const combinedSim = Math.min(
        100,
        Math.max(0, Math.round((vocabSim * 0.4 + structSim * 0.6) * 100))
      );

      similarities.push({
        characterA: charA.character,
        characterB: charB.character,
        similarity: combinedSim,
        flagged: combinedSim >= 70,
      });

      similarityMap[charA.character].push(combinedSim);
      similarityMap[charB.character].push(combinedSim);
    }
  }

  // Compute uniqueness score for each character
  analyzedCharacters.forEach((char) => {
    const sims = similarityMap[char.character];
    if (sims.length === 0) {
      char.distinctivenessScore = 100;
    } else {
      const avgSim = sims.reduce((sum, s) => sum + s, 0) / sims.length;
      char.distinctivenessScore = Math.max(0, Math.min(100, Math.round(100 - avgSim)));
    }
  });

  return {
    characters: analyzedCharacters,
    similarities,
    recommendations: recs,
  };
};

export const DialogueFingerprintService = {
  estimateDialogueSegments,
  analyzeDialogueVoices,
};
