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
  /disregard/i,
];

const canonicalizeSecurityText = (input: string): string => {
  // Normalize & harden against common normalization-evasion techniques.
  // - NFKC collapses compatibility variants
  // - Remove common zero-width characters and BOM
  // - Normalize whitespace (including NBSP) to single spaces
  return (input ?? "")
    .normalize("NFKC")
    .replace(/\u200B|\u200C|\u200D|\uFEFF|\u2060|\u180E/g, "")
    .replace(/[\s\u00A0]+/g, " ");
};

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
  return trimmed
    .replace(/^```(?:json|javascript|ts|typescript)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
};

export const validateAndFormatPrompt = (userPrompt: string): string => {
  const canonical = canonicalizeSecurityText(userPrompt);

  // 1. Semantic Filtering (run against canonicalized input)
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(canonical)) {
=======
  if (!userPrompt || typeof userPrompt !== "string") {
    throw new Error("Security Violation: Invalid prompt input.");
  }

  // Normalize input before security analysis
  const normalizedPrompt = normalizeInput(userPrompt);
  const canonical = canonicalizeSecurityText(normalizedPrompt);

  // Semantic filtering against expanded pattern set
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(canonical)) {
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
  const canonical = canonicalizeSecurityText(aiResponse).toLowerCase();

  if (
    canonical.includes("system prompt:") ||
    canonical.includes("instructions:") ||
    canonical.includes("system prompt") ||
    canonical.includes("developer instructions")
  ) {
    throw new Error("Security Violation: AI output leaked system instructions.");
  }

  // 5. Content Moderation — block harmful/inappropriate output
  assertContentSafe(aiResponse);

  return aiResponse;
};

  assertContentSafe(normalizedPrompt);

  // Strict delimiters to isolate user input
  return `"""\n${normalizedPrompt}\n"""`;
};

export const validateOutput = (aiResponse: string): string => {
  if (!aiResponse || typeof aiResponse !== "string") {
    throw new Error("Security Violation: Invalid AI response.");
  }

  // Post-generation validation — check for leaked system instructions
  const canonical = canonicalizeSecurityText(aiResponse).toLowerCase();

  if (
    canonical.includes("system prompt:") ||
    canonical.includes("instructions:") ||
    canonical.includes("system prompt") ||
    canonical.includes("developer instructions")
  ) {
    throw new Error("Security Violation: AI output leaked system instructions.");
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
  }

  // Content moderation — block harmful/inappropriate output
  assertContentSafe(aiResponse);

  return aiResponse;
};
