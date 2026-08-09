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


export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecurityError";
  }
}

// Added strict character limit to prevent DoS/ReDoS
const MAX_PROMPT_LENGTH = 10000; 


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

const LEAK_PATTERNS: string[] = [
  "system prompt",
  "instructions:",
  "developer instructions",
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


/**
 * Normalizes & hardens text against Unicode substitution and obfuscation bypasses.
 */
export const sanitizePromptText = (rawText: string): string => {
  const trimmed = rawText.trim();
  return (trimmed ?? "")
    .normalize("NFKC")
    .replace(/\u200B|\u200C|\u200D|\uFEFF|\u2060|\u180E/g, "")
    .replace(/[\s\u00A0]+/g, " ")
    .trim();
};


const normalizeText = (input: string): string => {
  return (input ?? "")
    .normalize("NFKC") // Unicode normalization collapses compatibility variants
    .replace(/[\u200B-\u200D\uFEFF\u2060\u180E]/g, "") // Remove zero-width characters and BOM
    .replace(/[\s\u00A0]+/g, " ") // Collapse all whitespace to single spaces
    .trim();
};

export const validateAndFormatPrompt = (userPrompt: string): string => {
  if (!userPrompt || typeof userPrompt !== "string") {
    throw new SecurityError("Security Violation: Invalid prompt input.");
  }

  // Length check BEFORE expensive normalizations and regex matching
  if (userPrompt.length > MAX_PROMPT_LENGTH) {
    throw new Error(`Security Violation: Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters.`);
  }

  const canonicalPrompt = normalizeText(userPrompt);

  // Semantic filtering against expanded pattern set
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(canonicalPrompt)) {
      throw new SecurityError("Security Violation: Malicious prompt injection detected.");
    }
  }

  // Content moderation — block harmful/inappropriate input
  assertContentSafe(canonicalPrompt);

  // Strip triple quotes from the user input to prevent delimiter breakout
  const safePrompt = canonicalPrompt.replace(/"""/g, '\\"\\"\\"');

  // Strict delimiters to isolate user input
  return `"""\n${safePrompt}\n"""`;
};

export const validateOutput = (aiResponse: string): string => {
  if (!aiResponse || typeof aiResponse !== "string") {
    throw new SecurityError("Security Violation: Invalid AI response.");
  }

  const canonicalResponse = normalizeText(aiResponse).toLowerCase();

  // Unified post-generation validation — check for leaked system instructions
  for (const pattern of LEAK_PATTERNS) {
    if (canonicalResponse.includes(pattern)) {
      throw new SecurityError("Security Violation: AI output leaked system instructions.");
    }
  }

  // Content moderation — block harmful/inappropriate output
  assertContentSafe(aiResponse);

  return aiResponse;
};

/**
 * Extracts JSON from markdown code blocks, even if surrounded by conversational filler.
 */
export const sanitizeJsonText = (rawText: string): string => {
  const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  // Fallback in case the LLM didn't use backticks at all
  return rawText.trim();
};
