import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config";

export interface IBranchingStoryRequest {
  storyContext: string;
  selectedChoice: string;
  genre?: string;
}

export interface IBranchingStoryResponse {
  storySegment: string;
  choices: string[];
  segmentIndex: number;
}

const FALLBACK_SEGMENT =
  "The path ahead remains uncertain, but the story presses forward through the mist.";
const FALLBACK_CHOICES = [
  "Move forward carefully",
  "Look for another path",
  "Pause and reconsider",
];

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);

const stripCodeFences = (text: string): string =>
  text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

const parsePayload = (text: string): { storySegment: string; choices: string[] } => {
  const cleaned = stripCodeFences(text);
  const parsed = JSON.parse(cleaned) as {
    storySegment?: unknown;
    choices?: unknown;
  };

  if (
    typeof parsed.storySegment !== "string" ||
    !Array.isArray(parsed.choices) ||
    parsed.choices.length !== 3 ||
    parsed.choices.some((choice) => typeof choice !== "string" || !choice.trim())
  ) {
    throw new Error("Invalid branching story payload");
  }

  return {
    storySegment: parsed.storySegment.trim(),
    choices: parsed.choices.map((choice) => choice.trim()),
  };
};

const buildPrompt = ({
  storyContext,
  selectedChoice,
  genre,
}: IBranchingStoryRequest): string => {
  const genreLine = genre?.trim() ? `Genre: ${genre.trim()}.` : "Genre: flexible.";
  const contextBlock = storyContext.trim()
    ? storyContext.trim()
    : "No prior story context. This is the opening turn.";
  const userAction = selectedChoice.trim()
    ? `Player action: ${selectedChoice.trim()}`
    : "Player action: start a new branching story.";

  return `You are continuing an interactive branching story.

Rules:
- Keep the existing character names, tone, pacing, and world rules consistent with the prior context.
- Write one new story segment under 200 words.
- End with exactly 3 short and distinct choices that naturally continue the story.
- Return only valid JSON with the fields storySegment and choices.
- choices must always contain exactly 3 strings.

${genreLine}

Previous story context:
${contextBlock}

${userAction}

Respond in this exact JSON shape:
{ "storySegment": "string", "choices": ["string", "string", "string"] }`;
};

const getSegmentIndex = (storyContext: string): number => {
  const completedChoices = storyContext.match(/\[Player chose:/g)?.length ?? 0;
  return completedChoices + 1;
};

const createFallbackResponse = (storyContext: string): IBranchingStoryResponse => ({
  storySegment: FALLBACK_SEGMENT,
  choices: [...FALLBACK_CHOICES],
  segmentIndex: getSegmentIndex(storyContext),
});

const createBranchingStory = async (
  payload: IBranchingStoryRequest
): Promise<IBranchingStoryResponse> => {
  const storyContext = typeof payload.storyContext === "string" ? payload.storyContext : "";
  const selectedChoice = typeof payload.selectedChoice === "string" ? payload.selectedChoice : "";
  const genre = typeof payload.genre === "string" ? payload.genre : undefined;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chatSession = model.startChat({ history: [] });

    const response = await chatSession.sendMessage(buildPrompt({ storyContext, selectedChoice, genre }));
    const text = response.response.text();
    const parsed = parsePayload(text);

    return {
      storySegment: parsed.storySegment,
      choices: parsed.choices,
      segmentIndex: getSegmentIndex(storyContext),
    };
  } catch (error) {
    console.error("Branching story generation failed:", error);
    return createFallbackResponse(storyContext);
  }
};

export const StoryBranchingService = {
  createBranchingStory,
};