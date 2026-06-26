/**
 * Normalize input to prevent Unicode substitution and obfuscation bypasses.
 */
const normalizeInput = (input: string): string => {
  return (input ?? "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF\u2060\u180E]/g, "")
    .replace(/[\s\u00A0]+/g, " ")
    .trim();
};

export const validateAndFormatPrompt = (userPrompt: string): string => {
  if (!userPrompt || typeof userPrompt !== "string") {
    throw new Error("Security Violation: Invalid prompt input.");
  }

  const normalizedPrompt = normalizeInput(userPrompt);

  assertContentSafe(normalizedPrompt);

  return `"""\n${normalizedPrompt}\n"""`;
};

export const validateOutput = (aiResponse: string): string => {
  if (!aiResponse || typeof aiResponse !== "string") {
    throw new Error("Security Violation: Invalid AI response.");
  }

  const lowerResponse = aiResponse.toLowerCase();

  const leakPatterns = [
    "system prompt:",
    "instructions:",
    "my instructions are",
    "i was told to",
    "my system message",
    "as instructed by",
    "my training says",
    "i am programmed to",
    "confidential instructions",
    "ignore the rules",
  ];

  for (const pattern of leakPatterns) {
    if (lowerResponse.includes(pattern)) {
      throw new Error("Security Violation: AI output leaked system instructions.");
    }
  }

  assertContentSafe(aiResponse);

  return aiResponse;
};