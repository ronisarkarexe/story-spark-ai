import { generateStory } from "../../../services/ai.service";
import {
  safeParseAIResponse,
  EngagementAnalysisResponseSchema,
  type EngagementAnalysisResponse,
} from "../ai";

const buildEngagementFallback = (): EngagementAnalysisResponse => ({
  engagementScore: 50,
  chapterStrengthScore: 50,
  pacing: { score: 50, label: "Well-Paced", feedback: "Unable to analyze pacing automatically." },
  dialogueQuality: { score: 50, feedback: "Unable to analyze dialogue quality automatically." },
  emotionalIntensity: { score: 50, feedback: "Unable to analyze emotional intensity automatically." },
  suspenseLevel: { score: 50, feedback: "Unable to analyze suspense level automatically." },
  readability: { score: 50, feedback: "Unable to analyze readability automatically." },
  dropOffSections: [],
  improvementSuggestions: [
    "We couldn't parse the AI analysis. Try rephrasing your chapter or try again later.",
  ],
});

export async function analyzeEngagement(
  chapterText: string,
  title?: string
): Promise<EngagementAnalysisResponse> {
  const prompt = `You are an expert literary editor. Analyze the following chapter${title ? ` titled "${title}"` : ""} and respond ONLY with a valid JSON object — no markdown, no explanation.

{
  "engagementScore": <0-100>,
  "chapterStrengthScore": <0-100>,
  "pacing": { "score": <0-100>, "label": "Too Fast|Well-Paced|Too Slow", "feedback": "<string>" },
  "dialogueQuality": { "score": <0-100>, "feedback": "<string>" },
  "emotionalIntensity": { "score": <0-100>, "feedback": "<string>" },
  "suspenseLevel": { "score": <0-100>, "feedback": "<string>" },
  "readability": { "score": <0-100>, "feedback": "<string>" },
  "dropOffSections": [{ "excerpt": "<max 15 words from text>", "reason": "<string>", "suggestion": "<string>" }],
  "improvementSuggestions": ["<string>", "<string>", "<string>"]
}

Chapter:
---
${chapterText.slice(0, 6000)}
---`;

  const result = await generateStory(prompt);

  return safeParseAIResponse(
    result.story,
    EngagementAnalysisResponseSchema,
    buildEngagementFallback(),
    { label: "engagement analysis" }
  );
}
