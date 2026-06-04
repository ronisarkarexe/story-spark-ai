export function buildStoryPrompt(userInput: string) {
  return `
You are an expert AI storytelling system.

Generate 3 unique story variations.

USER INPUT:
"${userInput}"

RULES:
- Generate exactly 3 stories
- Each must have a different tone:
  - Psychological
  - Supernatural
  - Survival
- Make stories creative, immersive, and structured
- Avoid repetition

STRICT OUTPUT:
Return ONLY valid JSON. No explanation.

FORMAT:
{
  "stories": [
    {
      "title": "",
      "tone": "psychological | supernatural | survival",
      "content": ""
    }
  ]
}
`;
}