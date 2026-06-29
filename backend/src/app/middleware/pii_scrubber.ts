import { Request, Response, NextFunction } from "express";
import compromise from "compromise";

const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Very fast, synchronous PII scrubber using compromise (NLP) and RegEx.
 * Replaces names, emails, and phone numbers with generic placeholders.
 */
export const scrubPII = (text: string): string => {
  if (!text) return text;

  let scrubbed = text;

  // If this already contains our redaction tokens, we should be idempotent.
  // (Prevents repeated middleware execution from further mutating placeholders.)
  const containsAnyRedactionToken =
    /\[REDACTED_(?:EMAIL|PHONE|NAME|SSN|CARD|ADDRESS)\]/i.test(scrubbed);

  if (containsAnyRedactionToken) return scrubbed;

  // 1. Emails

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  scrubbed = scrubbed.replace(emailRegex, "[REDACTED_EMAIL]");

  // 2. Phone numbers
  // Cover formats like:
  //   555-867-5309 | 555 867 5309 | (555) 867-5309 | +1 555.867.5309
  // plus a fallback for 10-digit sequences with optional separators.
  const phoneRegex =
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  scrubbed = scrubbed.replace(phoneRegex, "[REDACTED_PHONE]");

  // Fallback: 10 digits possibly separated by spaces/dots/dashes, with word boundaries.
  // (Intentionally conservative; does not try to validate country codes.)
  const phoneFallbackRegex = /\b\d{3}([-.\s])?\d{3}\1?\d{4}\b/g;
  scrubbed = scrubbed.replace(phoneFallbackRegex, "[REDACTED_PHONE]");

  // 3. SSN (US)
  // Matches 123-45-6789 or 123 45 6789
  const ssnRegex = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g;
  scrubbed = scrubbed.replace(ssnRegex, "[REDACTED_SSN]");

  // 4. Credit card-like sequences
  // Matches 13-19 digits with optional spaces/dashes.
  // This is heuristic (not Luhn-valid), but generally effective for scrubbing.
  const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  scrubbed = scrubbed.replace(cardRegex, "[REDACTED_CARD]");

  // 5. Conservative address pattern
  // Matches: street number + street name + common suffix (St, Ave, Blvd, Rd, Dr, Ln, Ct, Pl, Pkwy)
  // Example: "123 Main St". Avoids over-broad matching.
const addressRegex =
    /\b\d{1,5}\s+[A-Za-z0-9][A-Za-z0-9\s.'-]{1,60}\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Parkway|Pkwy)\b/gi;
  scrubbed = scrubbed.replace(addressRegex, "[REDACTED_ADDRESS]");

  // 5b. US address variations with directional prefixes/suffixes (still conservative)
  // Examples: "123 N Main St", "456 S. 2nd Ave", "789 W Elm Road"
  const addressAltRegex =
    /\b\d{1,5}\s+(?:N|S|E|W|NE|NW|SE|SW)\.?\s+[A-Za-z0-9][A-Za-z0-9\s.'-]{1,60}\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Parkway|Pkwy)\b/gi;
  scrubbed = scrubbed.replace(addressAltRegex, "[REDACTED_ADDRESS]");


  // 6. NLP for Person Names using compromise
  if (!containsAnyRedactionToken) {
    const doc = compromise(scrubbed);
    const people = doc.people().out("array");

    // Sort by length descending to replace longer names first (prevent partial replacement issues)
    people.sort((a: string, b: string) => b.length - a.length);

    for (const person of people) {
      if (person.length > 2) {
        // Replace name with punctuation-safe boundaries.
        // This handles cases like "John," "John." "(John)".
        const escaped = escapeRegex(person);
        const nameRegex = new RegExp(`(^|[^\\w])(${escaped})(?=$|[^\\w])`, "gi");
        scrubbed = scrubbed.replace(nameRegex, "$1[REDACTED_NAME]");
      }
    }
  }


  return scrubbed;
};

export const piiScrubberMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && req.body.prompt && typeof req.body.prompt === "string") {
      req.body.prompt = scrubPII(req.body.prompt);
    }
    
    // Also scrub 'content' and 'title' if present (for alternate endings/remix)
    if (req.body && req.body.content && typeof req.body.content === "string") {
      req.body.content = scrubPII(req.body.content);
    }
    if (req.body && req.body.title && typeof req.body.title === "string") {
      req.body.title = scrubPII(req.body.title);
    }

    // Also scrub chat 'message'
    if (req.body && req.body.message && typeof req.body.message === "string") {
      req.body.message = scrubPII(req.body.message);
    }

    next();
  } catch (error) {
    // Fail closed if PII scrubbing crashes? Or just continue unscrubbed?
    // It's safer to fail the request to ensure no PII leaks.
    next(error);
  }
};

export default piiScrubberMiddleware;
