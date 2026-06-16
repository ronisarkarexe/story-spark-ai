import { generateStory } from "../../../services/ai.service";

export async function analyzeEngagement(
  chapterText: string,
  title?: string
): Promise<object> {
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
  const cleaned = result.story.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
