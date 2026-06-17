import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface IConsistencyIssue {
  type:
    | "character_contradiction"
    | "timeline_inconsistency"
    | "world_building_conflict"
    | "relationship_mismatch"
    | "plot_hole"
    | "forgotten_arc"
    | "ability_inconsistency";
  severity: "low" | "medium" | "high";
  description: string;
  location: string;
  suggestion: string;
}

export interface IConsistencyResult {
  consistencyScore: number;
  issues: IConsistencyIssue[];
  summary: string;
  charactersFound: string[];
  timelineEvents: string[];
}

export const analyzeConsistency = async (
  storyText: string
): Promise<IConsistencyResult> => {
  const prompt = `You are an expert story editor. Analyze the following story for narrative consistency issues.

Detect these specific problems:
- Character personality contradictions (a character acts against their established traits)
- Timeline inconsistencies (events happen in impossible order)
- World-building conflicts (rules of the world are broken)
- Relationship mismatches (character relationships contradict earlier scenes)
- Plot holes (unresolved story threads or logical gaps)
- Forgotten story arcs (subplots that disappear without resolution)
- Inconsistent character abilities or skills

Return ONLY a valid JSON object with this exact structure:
{
  "consistencyScore": <number 0-100>,
  "issues": [
    {
      "type": "<one of: character_contradiction|timeline_inconsistency|world_building_conflict|relationship_mismatch|plot_hole|forgotten_arc|ability_inconsistency>",
      "severity": "<low|medium|high>",
      "description": "<what the inconsistency is>",
      "location": "<where in the story this occurs>",
      "suggestion": "<how to fix it>"
    }
  ],
  "summary": "<2-3 sentence overall assessment>",
  "charactersFound": ["<character name>"],
  "timelineEvents": ["<brief event description>"]
}

Story to analyze:
"""
${storyText}
"""`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as IConsistencyResult;
};
