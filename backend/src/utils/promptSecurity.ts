<<<<<<< HEAD
/**
 * Prompt security helpers.
 *
 * These utilities normalize user input, block common instruction-injection
 * phrases, and delegate harmful-content checks to the moderation layer.
=======
﻿/**
 * Security middleware to prevent prompt injection and jailbreaks.
 * Improvements:
 * - Input normalization before pattern matching
 * - Expanded forbidden patterns covering rephrased/obfuscated attacks
 * - Unicode normalization to prevent character substitution bypasses
 * - Content moderation on both input and output
 * - Improved output validation
>>>>>>> origin/main
 */
import { assertContentSafe } from "./contentModeration";

const FORBIDDEN_PATTERNS: RegExp[] = [
  /ignore\s+(?:.*?\s+)?(?:instructions?|prompts?|rules?|context|constraints?)/i,
  /disregard\s+(?:.*?\s+)?(?:instructions?|prompts?|rules?|context|constraints?)/i,
  /forget\s+(?:everything|all|previous|earlier|prior|above|your\s+instructions?)/i,
  /override\s+(?:your\s+)?(?:instructions?|rules?|constraints?|programming|training)/i,
  /bypass\s+(?:your\s+)?(?:instructions?|rules?|constraints?|filter|safety|security)/i,
  /system\s*prompt/i,
  /developer\s+mode/i,
  /jailbreak/i,
  /do\s+anything\s+now/i,
  /you\s+are\s+now\s+(?:the\s+)?(?:system|developer|assistant)/i,
  /act\s+as\s+(?:if\s+you\s+are\s+)?(?:a\s+)?(?:different|unrestricted|unfiltered|evil|bad|another|developer|system|assistant)/i,
  /pretend\s+(?:you\s+are|to\s+be)\s+(?:a\s+)?(?:different|unrestricted|unfiltered|evil|bad|another|developer|system|assistant)/i,
  /reveal\s+(?:your\s+)?(?:instructions?|prompt|system|context|training)/i,
  /show\s+(?:me\s+)?(?:your\s+)?(?:instructions?|prompt|system|context)/i,
  /what\s+(?:are\s+)?(?:your\s+)?(?:instructions?|rules?|constraints?|system\s+prompt)/i,
  /repeat\s+(?:your\s+)?(?:instructions?|prompt|system\s+message)/i,
  /\[system\]/i,
  /\[instructions?\]/i,
  /<system>/i,
  /<instructions?>/i,
  /###\s*system/i,
  /###\s*instructions?/i,
];

<<<<<<< HEAD
const normalizeInput = (input: string): string =>
  (input ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(/\s+/g, " ")
=======
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
>>>>>>> origin/main
    .trim();

<<<<<<< HEAD
const assertNoPromptInjection = (text: string): void => {
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
=======
export const validateAndFormatPrompt = (userPrompt: string): string => {
  if (!userPrompt || typeof userPrompt !== "string") {
    throw new Error("Security Violation: Invalid prompt input.");
  }

  const normalizedPrompt = normalizeInput(userPrompt);

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(normalizedPrompt)) {
>>>>>>> origin/main
      throw new Error("Security Violation: Malicious prompt injection detected.");
    }
  }
};

<<<<<<< HEAD
export const validateAndFormatPrompt = (userPrompt: string): string => {
  if (typeof userPrompt !== "string" || !userPrompt.trim()) {
    throw new Error("Security Violation: Invalid prompt input.");
  }

  const normalizedPrompt = normalizeInput(userPrompt);
  assertNoPromptInjection(normalizedPrompt);
=======
>>>>>>> origin/main
  assertContentSafe(normalizedPrompt);

  return `"""\n${normalizedPrompt}\n"""`;
};

export const validateOutput = (aiResponse: string): string => {
<<<<<<< HEAD
  if (typeof aiResponse !== "string" || !aiResponse.trim()) {
=======
  if (!aiResponse || typeof aiResponse !== "string") {
>>>>>>> origin/main
    throw new Error("Security Violation: Invalid AI response.");
  }

  const normalizedOutput = normalizeInput(aiResponse);
  const loweredOutput = normalizedOutput.toLowerCase();

<<<<<<< HEAD
  assertNoPromptInjection(normalizedOutput);

  const leakedInstructionPatterns = [
=======
  const leakPatterns = [
>>>>>>> origin/main
    "system prompt:",
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

  for (const pattern of leakedInstructionPatterns) {
    if (loweredOutput.includes(pattern)) {
      throw new Error("Security Violation: AI output leaked system instructions.");
    }
  }

<<<<<<< HEAD
  assertContentSafe(normalizedOutput);
  return aiResponse;
};
=======
  assertContentSafe(aiResponse);

  return aiResponse;
};
>>>>>>> origin/main
