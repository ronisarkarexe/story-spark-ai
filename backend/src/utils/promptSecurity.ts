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


const canonicalizeSecurityText = (input: string): string => {
  // Normalize & harden against common normalization-evasion techniques.
  // - NFKC collapses compatibility variants
  // - Remove common zero-width characters and BOM
  // - Normalize whitespace (including NBSP) to single spaces
  return (input ?? "")
    .normalize("NFKC")
    .replace(/\u200B|\u200C|\u200D|\uFEFF|\u2060|\u180E/g, "")
    .replace(/[\s\u00A0]+/g, " ")

/**
 * Normalize input to prevent Unicode substitution and obfuscation bypasses.
 */
const normalizeInput = (input: string): string => {
  return input
    .normalize("NFKC") // Unicode normalization
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width characters
    .replace(/\s+/g, " ") // Collapse whitespace
 main
    .trim();
};

export const validateAndFormatPrompt = (userPrompt: string): string => {

  const canonical = canonicalizeSecurityText(userPrompt);

  // 1. Semantic Filtering (run against canonicalized input)
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(canonical)) {

  if (!userPrompt || typeof userPrompt !== "string") {
    throw new Error("Security Violation: Invalid prompt input.");
  }

  // Normalize input before security analysis
  const normalizedPrompt = normalizeInput(userPrompt);

  // Semantic filtering against expanded pattern set
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(normalizedPrompt)) {
 main
      throw new Error("Security Violation: Malicious prompt injection detected.");
    }
  }

  // Content moderation — block harmful/inappropriate input
  assertContentSafe(normalizedPrompt);

  // Strict delimiters to isolate user input
  return `"""\n${normalizedPrompt}\n"""`;
};

export const validateOutput = (aiResponse: string): string => {

  // 4. Post-generation validation — check for leaked system instructions
  const canonical = canonicalizeSecurityText(aiResponse).toLowerCase();

  if (
    canonical.includes("system prompt:") ||
    canonical.includes("instructions:") ||
    canonical.includes("system prompt") ||
    canonical.includes("developer instructions")
  ) {
    throw new Error("Security Violation: AI output leaked system instructions.");

  if (!aiResponse || typeof aiResponse !== "string") {
    throw new Error("Security Violation: Invalid AI response.");
  }

  const lowerResponse = aiResponse.toLowerCase();

  // Expanded output validation — check for leaked system instructions
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
main
  }

  // Content moderation — block harmful/inappropriate output
  assertContentSafe(aiResponse);

  return aiResponse;

};


};
 main
