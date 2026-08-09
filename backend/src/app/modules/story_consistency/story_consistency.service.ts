import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";
import { aiLimit } from "../../../utils/aiLimiter";

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

  const result = await aiLimit(() => model.generateContent(prompt));
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as IConsistencyResult;
};

export interface IFactTimelineStep {
  stepNumber: number;
  eventSummary: string;
  factsEstablished: string[];
  factsSuperseded: string[];
}

export interface IFactContradiction {
  description: string;
  contradictedFact: string;
  severity: "low" | "medium" | "high";
  suggestion: string;
}

export interface IFactTrackingResult {
  timeline: IFactTimelineStep[];
  contradictions: IFactContradiction[];
}

export const trackStoryFacts = async (
  storyText: string
): Promise<IFactTrackingResult> => {
  const prompt = `You are a professional narrative continuity editor. Analyze the following story to build a chronological timeline of key facts and identify any time-based/logical contradictions.

First, logically segment the story into chronological events.
For each event segment:
1. State the brief event description.
2. Identify new facts established (e.g. "Jack is carrying a golden key", "Jack is in the castle hall").
3. Identify facts that were previously true but are now superseded/invalidated (e.g. "Jack drops the key" supersedes "Jack is carrying a golden key").

Second, check for any logical/temporal contradictions where the narrative violates active facts established in previous steps.

Return ONLY a valid JSON object matching this exact structure:
{
  "timeline": [
    {
      "stepNumber": 1,
      "eventSummary": "<Summary of what happens in this step>",
      "factsEstablished": ["<fact 1>", "<fact 2>"],
      "factsSuperseded": ["<previous fact that is no longer true>"]
    }
  ],
  "contradictions": [
    {
      "description": "<Description of the contradiction, e.g. Jack unlocks the gate but he previously dropped the key>",
      "contradictedFact": "<The specific fact that was violated>",
      "severity": "<low|medium|high>",
      "suggestion": "<Suggested fix for the writer>"
    }
  ]
}

Story to analyze:
"""
${storyText}
"""`;

  const result = await aiLimit(() => model.generateContent(prompt));
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as IFactTrackingResult;
};

