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

  const systemPrompt = `You are an expert creative storyteller and narrative designer.
Your task is to generate a high-quality, engaging story based on the user's prompt.

RULES AND CONSTRAINTS:
1. Tone: the story must maintain a ${tone} tone.
2. Genre: the narrative should fit within the ${genre} genre.
3. Audience: write for a ${targetAudience}.
4. Length: the story should be approximately ${length} in length.
5. Output Format: you MUST return the output strictly as a valid JSON object. Do not include markdown formatting blocks (e.g., \`\`\`json). Just return the raw JSON.

EXPECTED JSON SCHEMA:
{
  "title": "A captivating title for the story",
  "genre": "${genre}",
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