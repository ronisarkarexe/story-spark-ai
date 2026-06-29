import { assertContentSafe } from "./contentModeration";

const FORBIDDEN_PATTERNS: RegExp[] = [
  /ignore\s+(?:.*?\s+)?(?:instructions?|prompts?|context|rules?|constraints?)/i,
  /disregard\s+(?:.*?\s+)?(?:instructions?|prompts?|context|rules?|constraints?)/i,
  /forget\s+(everything|all|previous|prior|above|your\s+instructions?)/i,
  /override\s+(your\s+)?(instructions?|rules?|constraints?|programming|training)/i,
  /bypass\s+(your\s+)?(instructions?|rules?|constraints?|filter|safety|security)/i,
  /system\s*prompt/i,
  /reveal\s+(your\s+)?(instructions?|prompt|system|context|training)/i,
  /show\s+(me\s+)?(your\s+)?(instructions?|prompt|system|context)/i,
  /what\s+(are\s+)?your\s+(instructions?|rules?|constraints?|system\s+prompt)/i,
  /repeat\s+(your\s+)?(instructions?|prompt|system\s+message)/i,
  /jailbreak/i,
  /do\s+anything\s+now/i,
  /dan\s+mode/i,
  /developer\s+mode/i,
  /pretend\s+(you\s+are|to\s+be)\s+(a\s+)?(?:different|unrestricted|unfiltered|evil|bad|another|developer|system)/i,
  /act\s+as\s+(if\s+you\s+are\s+)?(a\s+)?(?:different|unrestricted|unfiltered|evil|bad|another|developer|system)/i,
  /you\s+are\s+now\s+(a\s+)?(?:different|unrestricted|unfiltered|evil|bad|another|developer|system)/i,
  /in\s+this\s+(scenario|story|roleplay|game|simulation)\s+.{0,50}(no\s+rules?|no\s+restrictions?|anything\s+goes)/i,
  /let'?s\s+play\s+a\s+(game|scenario|roleplay).{0,100}(no\s+rules?|no\s+restrictions?)/i,
  /\[system\]/i,
  /\[instructions?\]/i,
  /<system>/i,
  /<instructions?>/i,
  /###\s*system/i,
  /###\s*instructions?/i,
];

const canonicalizeSecurityText = (input: string): string => {
  return (input ?? "")
    .normalize("NFKC")
    .replace(/\u200B|\u200C|\u200D|\uFEFF|\u2060|\u180E/g, "")
    .replace(/[\s\u00A0]+/g, " ")
    .trim();
};

export const sanitizeJsonText = (rawText: string): string => {
  const trimmed = rawText.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed.replace(/^```(json)?/, "").replace(/```$/, "").trim();
};

export const validateAndFormatPrompt = (userPrompt: string): string => {
  if (!userPrompt || typeof userPrompt !== "string") {
    throw new Error("Security Violation: Invalid prompt input.");
  }

  const canonical = canonicalizeSecurityText(userPrompt);

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(canonical)) {
      throw new Error("Security Violation: Malicious prompt injection detected.");
    }
  }

  assertContentSafe(canonical);

  return `"""\n${canonical}\n"""`;
};

export const validateOutput = (aiResponse: string): string => {
  if (!aiResponse || typeof aiResponse !== "string") {
    throw new Error("Security Violation: Invalid AI response.");
  }

  const canonical = canonicalizeSecurityText(aiResponse).toLowerCase();

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
    "system prompt",
    "developer instructions"
  ];

  for (const pattern of leakPatterns) {
    if (canonical.includes(pattern)) {
      throw new Error("Security Violation: AI output leaked system instructions.");
    }
  }

  assertContentSafe(aiResponse);

  return aiResponse;
};
