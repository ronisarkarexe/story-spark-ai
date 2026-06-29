/**
 * Security middleware to prevent prompt injection and jailbreaks.
 * Improvements:
 * - Input normalization before pattern matching
 * - Expanded forbidden patterns covering rephrased/obfuscated attacks
 * - Unicode normalization to prevent character substitution bypasses
 * - Content moderation on both input and output
 * - Improved output validation
 */
import { assertContentSafe } from "./contentModeration";

const FORBIDDEN_PATTERNS: RegExp[] = [
  // Direct instruction override attempts
  /ignore\s+(?:.*?\s+)?(?:instructions?|prompts?|context|rules?|constraints?)/i,
  /disregard\s+(?:.*?\s+)?(?:instructions?|prompts?|context|rules?|constraints?)/i,
  /forget\s+(everything|all|previous|prior|above|your\s+instructions?)/i,
  /override\s+(your\s+)?(instructions?|rules?|constraints?|programming|training)/i,
  /bypass\s+(your\s+)?(instructions?|rules?|constraints?|filter|safety|security)/i,

  // System prompt extraction attempts
  /system\s*prompt/i,
  /reveal\s+(your\s+)?(instructions?|prompt|system|context|training)/i,
  /show\s+(me\s+)?(your\s+)?(instructions?|prompt|system|context)/i,
  /what\s+(are\s+)?your\s+(instructions?|rules?|constraints?|system\s+prompt)/i,
  /repeat\s+(your\s+)?(instructions?|prompt|system\s+message)/i,

  // Jailbreak patterns
  /jailbreak/i,
  /do\s+anything\s+now/i,
  /dan\s+mode/i,
  /developer\s+mode/i,
  /pretend\s+(you\s+are|to\s+be)\s+(a\s+)?(?:different|unrestricted|unfiltered|evil|bad|another|developer|system)/i,
  /act\s+as\s+(if\s+you\s+are\s+)?(a\s+)?(?:different|unrestricted|unfiltered|evil|bad|another|developer|system)/i,
  /you\s+are\s+now\s+(a\s+)?(?:different|unrestricted|unfiltered|evil|bad|another|developer|system)/i,

  // Roleplay-style attacks
  /in\s+this\s+(scenario|story|roleplay|game|simulation)\s+.{0,50}(no\s+rules?|no\s+restrictions?|anything\s+goes)/i,
  /let'?s\s+play\s+a\s+(game|scenario|roleplay).{0,100}(no\s+rules?|no\s+restrictions?)/i,

  // Indirect injection
  /\[system\]/i,
  /\[instructions?\]/i,
  /<system>/i,
  /<instructions?>/i,
  /###\s*system/i,
  /###\s*instructions?/i,
];

/**
 * Normalize input to prevent Unicode substitution and obfuscation bypasses.
 */
const normalizeInput = (input: string): string => {
  return input
    .normalize("NFKC") // Unicode normalization
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width characters
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
};
/**
 * Strip markdown code fences (e.g. ```json ... ```) from raw AI text
 * before attempting JSON.parse.
 */
export const sanitizeJsonText = (rawText: string): string => {
  const trimmed = rawText.trim();
  return (input ?? "")
    .normalize("NFKC")
    .replace(/\u200B|\u200C|\u200D|\uFEFF|\u2060|\u180E/g, "")
    .replace(/[\s\u00A0]+/g, " ")
    .trim();
};

export const validateAndFormatPrompt = (userPrompt: string): string => {
  if (!userPrompt || typeof userPrompt !== "string") {
    throw new Error("Security Violation: Invalid prompt input.");
  }

  const normalizedPrompt = normalizeInput(userPrompt);

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(normalizedPrompt)) {
      throw new Error("Security Violation: Malicious prompt injection detected.");
    }
  }

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
    "comply with your instructions",
  ];

  for (const pattern of leakPatterns) {
    if (lowerResponse.includes(pattern)) {
      throw new Error("Security Violation: AI output leaked system instructions.");
    }
  }

  assertContentSafe(aiResponse);

  return aiResponse;
};