/**
 * Prompt building utility
 * Transforms raw user input into a structured, high-quality AI prompt.
 * Ensures consistent output format, tone and structured JSON responses.
 */

export interface PromptOptions {
  tone?: string;
  genre?: string;
  targetAudience?: string;
  length?: 'short' | 'medium' | 'long';
}

export interface StructuredPrompt {
  systemPrompt: string;
  userPrompt: string;
}

const DEFAULT_GENRE = "general fiction";

const GENRE_PROMPT_INSTRUCTIONS: Record<string, string> = {
  drama:
    "Write a character-driven drama with emotional conflict, realistic stakes, and meaningful character development.",

  comedy:
    "Write a light, humorous story with funny situations, witty dialogue, and an entertaining resolution.",

  horror:
    "Write a suspenseful horror story with tension, fear, atmosphere, and a chilling but age-appropriate narrative.",

  romance:
    "Write an emotional romance story focused on relationships, feelings, trust, conflict, and heartfelt resolution.",

  "sci-fi":
    "Write a science-fiction story involving futuristic ideas, advanced technology, discovery, and imaginative world-building.",

  fantasy:
    "Write a fantasy story with magical elements, imaginative worlds, quests, wonder, and memorable characters.",

  mystery:
    "Write a mystery story with clues, suspense, investigation, secrets, and a satisfying reveal.",

  adventure:
    "Write an adventure story with exploration, risk, discovery, challenges, and a heroic journey.",

  adventurous:
    "Write an action-packed adventurous story with quests, danger, exploration, challenges, and a satisfying heroic journey.",

  "tech / sci-fi":
    "Write a technology-driven sci-fi story involving AI, hacking, futuristic systems, robotics, cyber worlds, space, or advanced inventions.",

  "romance / love":
    "Write an emotional romance/love story focused on relationships, feelings, trust, conflict, character growth, and a heartfelt resolution.",
};

const normalizeGenre = (genre?: string): string => {
  if (!genre || typeof genre !== "string") {
    return DEFAULT_GENRE;
  }

  return genre
    .replace(/^[^A-Za-z0-9]+/, "")
    .trim()
    .toLowerCase();
};

const getGenreInstruction = (
  genre?: string
): { genre: string; instruction: string } => {
  const normalizedGenre = normalizeGenre(genre);

  if (GENRE_PROMPT_INSTRUCTIONS[normalizedGenre]) {
    return {
      genre: normalizedGenre,
      instruction: GENRE_PROMPT_INSTRUCTIONS[normalizedGenre],
    };
  }

  return {
    genre: DEFAULT_GENRE,
    instruction:
      "Write a balanced general fiction story with a clear plot, engaging characters, and a satisfying ending.",
  };
};

export const buildStoryPrompt = (
  userInput: string,
  options: PromptOptions = {}
): StructuredPrompt => {
  const {
    tone = 'creative and engaging',
    genre = 'general fiction',
    targetAudience = 'general audience',
    length = 'medium'
  } = options;

  const resolvedGenre = getGenreInstruction(genre);

  const systemPrompt = `You are an expert creative storyteller and narrative designer.
Your task is to generate a high-quality, engaging story based on the user's prompt.

RULES AND CONSTRAINTS:
1. Tone: the story must maintain a ${tone} tone.
2. Genre: ${resolvedGenre.instruction}
3. Audience: write for a ${targetAudience}.
4. Length: the story should be approximately ${length} in length.
5. Output Format: you MUST return the output strictly as a valid JSON object. Do not include markdown formatting blocks (e.g., \`\`\`json). Just return the raw JSON.

EXPECTED JSON SCHEMA:
{
  "title": "A captivating title for the story",
  "genre": "${resolvedGenre.genre}",
  "tone": "${tone}",
  "summary": "A brief 2-3 sentence summary of the story.",
  "content": "The full story text formatted with appropriate paragraph breaks (\\n\\n).",
  "characters": ["Character Name 1", "Character Name 2"],
  "tags": ["tag1", "tag2", "tag3"]
}`;

  const userPrompt = `User Prompt: "${userInput}"\n\nPlease generate the story adhering strictly to the JSON structure and rules provided in the system instructions.`;

  return {
    systemPrompt,
    userPrompt
  };
};