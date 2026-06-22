import type { ZodSchema } from "zod";
import logger from "../../../utils/logger.util";

export interface SafeParseOptions {
  /** Label used in log messages so failures can be traced back to the caller. */
  label?: string;
  /** When false, markdown stripping and JSON extraction are skipped. */
  allowCleanup?: boolean;
}

/**
 * Remove common markdown code-block wrappers from an LLM response.
 * Handles ```json and ``` fences.
 */
export const stripMarkdownCodeBlocks = (rawText: string): string => {
  const trimmed = rawText.trim();
  if (!trimmed.startsWith("`") && !trimmed.includes("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .replace(/```/g, "")
    .trim();
};

/**
 * Try to recover a JSON object/array from a partially-valid or truncated
 * response by matching the first balanced `{...}` or `[...]` block.
 */
const extractJsonLikeBlock = (text: string): string | null => {
  const trimmed = text.trim();

  // Fast path: response already starts with a JSON delimiter.
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return trimmed;
  }

  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return objectMatch[0];
  }

  const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return arrayMatch[0];
  }

  return null;
};

/**
 * Safely parse and validate an LLM JSON response against a Zod schema.
 *
 * Strategy:
 * 1. Strip markdown code fences.
 * 2. Try to parse the full cleaned text as JSON and validate.
 * 3. If that fails, try regex-based extraction of the first `{...}` / `[...]`
 *    block and validate it.
 * 4. If everything fails, log the issue and return the provided fallback.
 *
 * The caller is responsible for supplying a fallback object that matches the
 * schema shape so downstream code always has a predictable structure.
 */
export function safeParseAIResponse<T>(
  rawText: string,
  schema: ZodSchema<T>,
  fallback: T,
  options: SafeParseOptions = {}
): T {
  const { label = "AI response", allowCleanup = true } = options;

  const tryParse = (candidate: string): T | null => {
    try {
      const parsed = JSON.parse(candidate);
      const validated = schema.parse(parsed);
      return validated;
    } catch (error) {
      return null;
    }
  };

  if (allowCleanup) {
    const cleaned = stripMarkdownCodeBlocks(rawText);

    const fullParseResult = tryParse(cleaned);
    if (fullParseResult !== null) {
      return fullParseResult;
    }

    const extracted = extractJsonLikeBlock(cleaned);
    if (extracted && extracted !== cleaned) {
      const extractedResult = tryParse(stripMarkdownCodeBlocks(extracted));
      if (extractedResult !== null) {
        logger.warn(`[${label}] Full response invalid, recovered from embedded JSON block.`);
        return extractedResult;
      }
    }
  } else {
    const directResult = tryParse(rawText.trim());
    if (directResult !== null) {
      return directResult;
    }
  }

  // Collect diagnostics without leaking sensitive prompt content.
  logger.error(`[${label}] JSON parsing/validation failed; using fallback.`, {
    rawPreview: rawText.slice(0, 500),
    fallbackUsed: true,
  });

  return fallback;
}

/**
 * Convenience helper for services that MUST throw when the AI response is
 * invalid (e.g. generation tasks where no sensible fallback exists).  It still
 * strips markdown and attempts JSON recovery before failing.
 */
export function parseAIResponseOrThrow<T>(
  rawText: string,
  schema: ZodSchema<T>,
  options: SafeParseOptions & { errorMessage?: string } = {}
): T {
  const { label = "AI response", errorMessage = "AI returned invalid JSON" } = options;

  const result = safeParseAIResponse<T>(rawText, schema, null as unknown as T, options);

  if (result === null) {
    logger.error(`[${label}] ${errorMessage}`);
    throw new Error(`${errorMessage} for ${label}`);
  }

  return result;
}
