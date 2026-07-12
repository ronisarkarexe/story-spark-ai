import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";

export interface ScientificWarning {
  detectedIssue: string;
  explanation: string;
  suggestedCorrection: string;
}

export interface ScientificRule {
  id: string;
  name: string;
  validate(text: string): ScientificWarning[];
}

const spiderRule: ScientificRule = {
  id: "spider-not-insect",
  name: "Spiders are not insects",
  validate(text: string): ScientificWarning[] {
    const warnings: ScientificWarning[] = [];
    
    // Split into sentences using a regex lookbehind to keep sentence punctuation
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const SPIDER_INSECT_PATTERNS = [
      /\bspiders?\s+(?:is|are|was|were|classified\s+as|categorized\s+as|defined\s+as)\s+(?:(?:a|an|the|some|many|several|various|small|tiny|creepy|crawly|common|venomous|scary)\s+)*insects?\b/i,
      /\binsects?\s+(?:like|such\s+as|including|namely)\s+(?:(?:a|an|the|some|many|several|various|small|tiny|creepy|crawly|common|venomous|scary)\s+)*spiders?\b/i,
      /\bspiders?\s+(?:and|or)\s+(?:other\s+)?insects?\b/i,
      /\bother\s+insects?,?\s+like\s+spiders?\b/i,
      /\bother\s+insects?\s+(?:such\s+as|including|namely)\s+spiders?\b/i
    ];

    const NEGATION_PATTERN = /\b(?:not|never|aren't|isn't|unlike|except|instead\s+of|rather\s+than)\b/i;

    for (const sentence of sentences) {
      let matched = false;
      for (const pattern of SPIDER_INSECT_PATTERNS) {
        if (pattern.test(sentence)) {
          matched = true;
          break;
        }
      }

      if (matched) {
        // If the sentence contains a negation pattern, we skip highlighting this warning
        if (!NEGATION_PATTERN.test(sentence)) {
          warnings.push({
            detectedIssue: "Spiders classified as insects",
            explanation: "Spiders are arachnids, not insects. Arachnids have eight legs and two body segments (cephalothorax and abdomen), whereas insects have six legs and three body segments (head, thorax, and abdomen).",
            suggestedCorrection: "Refer to spiders as 'arachnids' or change phrases like 'other insects' to 'bugs', 'creatures', or 'arachnids'."
          });
          // Do not add multiple warnings for the same rule in a single text/story
          break;
        }
      }
    }

    return warnings;
  }
};

const insectLargestRule: ScientificRule = {
  id: "insect-largest-class",
  name: "Insects are the largest animal class",
  validate(text: string): ScientificWarning[] {
    const warnings: ScientificWarning[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/);

    const INSECT_LARGEST_PATTERNS = [
      /\binsects?\b.*?\b(?:one\s+of\s+the|among\s+the)\s+largest\s+(?:animal\s+)?(?:classes|groups|phyla|divisions|categories|species|orders)\b/i,
      /\b(?:one\s+of\s+the|among\s+the)\s+largest\s+(?:animal\s+)?(?:classes|groups|phyla|divisions|categories|species|orders)\b.*?\binsects?\b/i
    ];

    for (const sentence of sentences) {
      let matched = false;
      for (const pattern of INSECT_LARGEST_PATTERNS) {
        if (pattern.test(sentence)) {
          matched = true;
          break;
        }
      }

      if (matched) {
        warnings.push({
          detectedIssue: "Insects described as 'one of the largest' classes",
          explanation: "Insects are the absolute largest animal class by number of species, accounting for more than half of all living organisms. They are not merely one of the largest.",
          suggestedCorrection: "Describe insects as 'the largest animal class' or 'the largest group of animals'."
        });
        break;
      }
    }

    return warnings;
  }
};

const RULES: ScientificRule[] = [spiderRule, insectLargestRule];

// Lazy-loaded model to prevent crashes if GEMINI_API_KEY is not defined initially
let geminiModel: any = null;

function getGeminiModel() {
  if (!geminiModel) {
    const apiKey = config.gemini_api_key?.trim() ?? "";
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
  }
  return geminiModel;
}

async function validateScientificContentWithAI(text: string): Promise<ScientificWarning[]> {
  const model = getGeminiModel();
  if (!model) return [];

  const systemPrompt = `You are a rigorous scientific fact-checking system. Analyze the following story/text for scientific inaccuracies, taxonomic errors, or conceptual misconceptions (such as misclassifying spiders/arachnids as insects, or incorrectly describing insects as merely 'one of the largest' classes instead of the absolute largest animal class by species count).

Return ONLY a valid JSON array of issues found, matching this exact schema:
[
  {
    "detectedIssue": "Brief summary of the issue (e.g., 'Spiders classified as insects')",
    "explanation": "Detailed explanation of the error and the scientific consensus/facts",
    "suggestedCorrection": "Actionable suggestion or educational disclaimer to correct it"
  }
]

If there are no scientific errors or inaccuracies in the text, return an empty JSON array: [].
Do not include any markdown block formatting (like \`\`\`json) or any conversational text. Return only the raw JSON string.`;

  try {
    const result = await model.generateContent(
      `${systemPrompt}\n\nText to analyze:\n"${text}"`
    );
    const responseText = result.response.text().trim();
    
    // Clean potential markdown blocks
    const cleanText = responseText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
      
    if (!cleanText || cleanText === "[]") return [];
    
    const parsed = JSON.parse(cleanText);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item: any) => ({
          detectedIssue: String(item.detectedIssue || "").trim(),
          explanation: String(item.explanation || "").trim(),
          suggestedCorrection: String(item.suggestedCorrection || "").trim(),
        }))
        .filter(
          (item) =>
            item.detectedIssue && item.explanation && item.suggestedCorrection
        );
    }
  } catch (error) {
    console.error("[Scientific Validator] Gemini verification failed:", error);
  }
  return [];
}

export async function validateScientificContent(text: string): Promise<ScientificWarning[]> {
  const warnings: ScientificWarning[] = [];
  
  // 1. Run local rules first
  for (const rule of RULES) {
    const ruleWarnings = rule.validate(text);
    warnings.push(...ruleWarnings);
  }

  // 2. Run Gemini AI checks if API key is present and we are not in a test environment
  const apiKey = config.gemini_api_key?.trim() ?? "";
  const isTestEnv = process.env.NODE_ENV === "test";

  if (apiKey && !isTestEnv) {
    const aiWarnings = await validateScientificContentWithAI(text);
    for (const aiWarning of aiWarnings) {
      // Avoid duplicate issues from local rules if any overlapping issues exist
      const isDuplicate = warnings.some(
        (w) =>
          w.detectedIssue.toLowerCase().includes(aiWarning.detectedIssue.toLowerCase()) ||
          aiWarning.detectedIssue.toLowerCase().includes(w.detectedIssue.toLowerCase())
      );
      if (!isDuplicate) {
        warnings.push(aiWarning);
      }
    }
  }

  return warnings;
}
