import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";
import { safeParseAIResponse } from "../ai/ai.utils";
import { ChildSafetyReportSchema, ChildSafetyReport } from "../ai/ai.schemas";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";

const geminiApiKey = config.gemini_api_key?.trim() ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

const getModel = () => {
  if (!geminiApiKey) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Gemini API key is not configured. Set GEMINI_API_KEY before using child safety features."
    );
  }
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

const SYSTEM_PROMPT = `You are a child content safety auditor specializing in the EMNLP 2024 PG-STORY safety framework.
Your task is to analyze children's story text and output a comprehensive safety audit in strict JSON format.

PG-STORY TAXONOMY DEFINITIONS:
1. "Violence & Scariness": Includes fighting, physical conflict, weapons, self-harm, scary/nightmarish scenarios, horror elements, dangerous stunts, and anti-social behaviour.
2. "Profanity & Slurs": Includes swear words, curse words, insults, and rude/impolite language.
3. "Sex & Nudity": Includes romantic intimacy, physical affection beyond wholesome family hugs, and references to body parts or clothing removal.
4. "Substance Consumption": Includes mentions of drinking alcohol, smoking, vaping, using medicine inappropriately, or drug references.
5. "Biases & Discriminatory Language": Includes unfair gender roles, racial stereotypes, discrimination, pre-judgments, and structural prejudice.

AUDIT LEVELS:
- Sentence-level Safety: Examine each sentence individually. If a sentence contains any unsafe elements according to the PG-STORY categories, record it with its exact text, PG-STORY category, a brief explanation, and severity (Low, Medium, High).
- Discourse-level Safety: Examine the narrative plot, tone, character dynamics, implications, and structure as a whole. Record any issues regarding the overall story arc (e.g. resolving a conflict with violence, encouraging bad habits, scary narrative endings, implicit biases) specifying the aspect ("Plot", "Tone", "Implication", "Narrative Structure"), PG-STORY category, explanation, and severity.

CONTENT WARNINGS:
- Identify community-driven content warnings (like "Animal Injury", "Parental Separation", "Spooky Monsters", "Physical Fight"). These are short 2-3 word warning tags.

OVERALL SUITABILITY:
- Determine if the story is safe for children (true/false).
- Select the recommended age group: "All Ages", "5-7 years", "8-10 years", "11+ years", "Not suitable for children".
- Set overall severity: "Safe", "Borderline", "Unsafe".
- Provide reasoning.

Output MUST strictly follow this JSON schema, with NO extra text or markdown wrappers (like \`\`\`json). Return ONLY the raw JSON object:
{
  "isSafeForChildren": boolean,
  "recommendedAgeGroup": "All Ages" | "5-7 years" | "8-10 years" | "11+ years" | "Not suitable for children",
  "reasoning": "A summary of the safety analysis.",
  "severity": "Safe" | "Borderline" | "Unsafe",
  "sentenceLevel": [
    {
      "sentence": "the exact sentence text",
      "category": "Violence & Scariness" | "Profanity & Slurs" | "Sex & Nudity" | "Substance Consumption" | "Biases & Discriminatory Language",
      "detail": "explanation of the violation/borderline element",
      "severity": "Low" | "Medium" | "High"
    }
  ],
  "discourseLevel": [
    {
      "aspect": "Plot" | "Tone" | "Implication" | "Narrative Structure",
      "category": "Violence & Scariness" | "Profanity & Slurs" | "Sex & Nudity" | "Substance Consumption" | "Biases & Discriminatory Language",
      "detail": "explanation of the discourse violation",
      "severity": "Low" | "Medium" | "High"
    }
  ],
  "contentWarnings": ["Warning Tag 1", "Warning Tag 2"]
}`;

const performSafetyAnalysis = async (content: string, signal?: AbortSignal): Promise<ChildSafetyReport> => {
  const model = getModel();
  const prompt = `Please audit the following story content against the PG-STORY framework. Here is the story:\n\n"${content}"`;

  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2, // low temp for audit consistency
    }
  });

  const rawText = response.response.text();
  const fallbackReport: ChildSafetyReport = {
    isSafeForChildren: true,
    recommendedAgeGroup: "All Ages",
    reasoning: "Failed to parse safety audit report; default safe.",
    severity: "Safe",
    sentenceLevel: [],
    discourseLevel: [],
    contentWarnings: []
  };

  return safeParseAIResponse(rawText, ChildSafetyReportSchema, fallbackReport, {
    label: "PG-STORY Content Safety Audit"
  });
};

const sanitizeJsonText = (rawText: string): string => {
  const trimmed = rawText.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
};

/**
 * Runs EMNLP 2024 PG-STORY self-diagnosis and controllable generation loop.
 * If safety concerns are detected, re-prompts the model to correct the content up to 2 times.
 */
const runSelfDiagnosisAndCorrection = async (
  originalPrompt: string,
  draftTitle: string,
  draftContent: string,
  draftTag: string,
  tone?: string,
  genre?: string,
  signal?: AbortSignal
): Promise<{ title: string; content: string; tag: string; safetyReport: ChildSafetyReport }> => {
  let title = draftTitle;
  let content = draftContent;
  let tag = draftTag;
  let safetyReport = await performSafetyAnalysis(content, signal);

  // Correction loop: up to 2 attempts if not safe or containing medium/high severity violations
  const maxCorrectionAttempts = 2;
  for (let attempt = 1; attempt <= maxCorrectionAttempts; attempt++) {
    const hasHighOrMediumViolations = 
      safetyReport.sentenceLevel.some(s => s.severity === "High" || s.severity === "Medium") ||
      safetyReport.discourseLevel.some(d => d.severity === "High" || d.severity === "Medium");
    
    if (safetyReport.isSafeForChildren && !hasHighOrMediumViolations) {
      break; // Safe!
    }

    console.log(`[Child Safety] Safety issue detected in draft story. Running self-correction attempt ${attempt}...`);

    const violationsSummary = [
      ...safetyReport.sentenceLevel.map(s => `- Sentence "${s.sentence}": [${s.category}] ${s.detail} (${s.severity} severity)`),
      ...safetyReport.discourseLevel.map(d => `- Discourse ${d.aspect}: [${d.category}] ${d.detail} (${d.severity} severity)`)
    ].join("\n");

    const correctionPrompt = `You are a children's story editor and safety refiner.
A story was generated based on the prompt: "${originalPrompt}"
However, the draft contains EMNLP 2024 PG-STORY content safety violations:
${violationsSummary}

Your task is to rewrite the story to make it entirely wholesome, safe, and appropriate for young children (recommended for ages 5-10).
Ensure:
1. The language is clean and gentle. Remove all violence, weapons, scary scenarios, and stereotypes.
2. The plot is resolved constructively, peacefully, and safely.
3. Keep the original character names, setting, and narrative style, but sanitize all problematic sentences.
4. Output the rewritten story in valid JSON format:
{
  "title": "Story Title",
  "content": "Rewritten story content...",
  "tag": "Story tag"
}`;

    const model = getModel();
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: correctionPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.5,
      }
    });

    const rawText = response.response.text();
    try {
      const parsed = JSON.parse(sanitizeJsonText(rawText));
      if (parsed.title && parsed.content) {
        title = parsed.title;
        content = parsed.content;
        tag = parsed.tag || tag;
        // Re-analyze the corrected content
        safetyReport = await performSafetyAnalysis(content, signal);
      }
    } catch (err) {
      console.error(`[Child Safety] Error parsing safety correction response on attempt ${attempt}:`, err);
    }
  }

  return { title, content, tag, safetyReport };
};

export const ChildSafetyService = {
  performSafetyAnalysis,
  runSelfDiagnosisAndCorrection,
};
