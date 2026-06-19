/**
 * Security middleware to prevent prompt injection and jailbreaks.
 */

import { assertContentSafe } from "./contentModeration";

const FORBIDDEN_PATTERNS: RegExp[] = [
  /ignore previous instructions/i,
  /system prompt/i,
  /jailbreak/i,
  /bypass/i,
  /forget everything/i,
  /disregard/i
];

export const validateAndFormatPrompt = (userPrompt: string): string => {
  // 1. Semantic Filtering
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(userPrompt)) {
      throw new Error("Security Violation: Malicious prompt injection detected.");
    }
  }

  // 2. Content Moderation — block harmful/inappropriate input
  assertContentSafe(userPrompt);

  // 3. Strict Delimiters
  return `"""\n${userPrompt}\n"""`;
};

export const validateOutput = (aiResponse: string): string => {
  // 4. Post-generation validation — check for leaked system instructions
  const lowerResponse = aiResponse.toLowerCase();
  if (lowerResponse.includes("system prompt:") || lowerResponse.includes("instructions:")) {
     throw new Error("Security Violation: AI output leaked system instructions.");
  }

  // 5. Content Moderation — block harmful/inappropriate output
  assertContentSafe(aiResponse);

  return aiResponse;
};
