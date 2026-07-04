import { Request, Response, NextFunction } from "express";
import compromise from "compromise";

const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Very fast, synchronous PII scrubber using compromise (NLP) and RegEx.
 * Replaces names, emails, and phone numbers with generic placeholders.
 *
 * Fail-open design: if NLP crashes, regex scrubbing still runs.
 * If everything crashes, original text is returned and error is logged.
 */
export const scrubPII = (text: string): string => {
  if (!text) return text;

  let scrubbed = text;

  const containsAnyRedactionToken =
      /\[REDACTED_(?:EMAIL|PHONE|NAME|SSN|CARD|ADDRESS)\]/i.test(scrubbed);
    if (containsAnyRedactionToken) return scrubbed;

    try {
      // 1. Emails
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      scrubbed = scrubbed.replace(emailRegex, "[REDACTED_EMAIL]");

      // 2. Phone numbers
      // UK/International Mobile formats
      const phoneIntRegex = /(?<![\w/])(?:\+44\s?|0)7\d{3}[-.\s]?\d{6}\b/g;
      scrubbed = scrubbed.replace(phoneIntRegex, "[REDACTED_PHONE]");

      const phoneRegex =
        /(?<![\w/])(?:\+\d{1,3}[-.\s]?|1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
      scrubbed = scrubbed.replace(phoneRegex, "[REDACTED_PHONE]");

      const phoneFallbackRegex = /(?<![\w/])\d{3}([-.\s])?\d{3}\1?\d{4}\b/g;
      scrubbed = scrubbed.replace(phoneFallbackRegex, "[REDACTED_PHONE]");

      // Local US 7-digit formats
      const phoneLocalRegex = /(?<![\w/])\d{3}[-.\s]\d{4}\b/g;
      scrubbed = scrubbed.replace(phoneLocalRegex, "[REDACTED_PHONE]");

      // 3. SSN
      const ssnRegex = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g;
      scrubbed = scrubbed.replace(ssnRegex, "[REDACTED_SSN]");

      // 4. Credit cards
      const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
      scrubbed = scrubbed.replace(cardRegex, "[REDACTED_CARD]");

      // 5a. Addresses with directional prefixes
      const addressAltRegex =
        /\b\d{1,5}\s+(?:N|S|E|W|NE|NW|SE|SW)\.?\s+[A-Za-z0-9][A-Za-z0-9\s.'-]{1,60}\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Parkway|Pkwy)(?:\s+(?:Apt|Apartment|Suite|Ste|Unit|Room)\s+[A-Za-z0-9#-]+)?(?:\s*,\s*[A-Za-z\s]+)?(?:\s*,\s*[A-Z]{2})?(?:\s+\d{5})?\b/gi;
      scrubbed = scrubbed.replace(addressAltRegex, "[REDACTED_ADDRESS]");

      // 5b. Standard addresses
      const addressRegex =
        /\b\d{1,5}\s+[A-Za-z0-9][A-Za-z0-9\s.'-]{1,60}\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Parkway|Pkwy)(?:\s+(?:Apt|Apartment|Suite|Ste|Unit|Room)\s+[A-Za-z0-9#-]+)?(?:\s*,\s*[A-Za-z\s]+)?(?:\s*,\s*[A-Z]{2})?(?:\s+\d{5})?\b/gi;
      scrubbed = scrubbed.replace(addressRegex, "[REDACTED_ADDRESS]");

      // 6. NLP person names — isolated try/catch so failures don't block regex scrubbing above
      try {
        const doc = compromise(scrubbed);
        const people = doc.people().out("array") as string[];
        people.sort((a, b) => b.length - a.length);
        for (const person of people) {
          if (person.length > 2) {
            const escaped = escapeRegex(person);
            const nameRegex = new RegExp(`(^|[^\\w])(${escaped})(?=$|[^\\w])`, "gi");
            scrubbed = scrubbed.replace(nameRegex, "$1[REDACTED_NAME]");
    }

  } catch (err) {
    // Outer safety net — log but don't surface to caller
    console.error("[PII Scrubber] Unexpected scrubber error:", err);
  }
    }

  return scrubbed;
  } catch (err) {
    // Regex itself failed — extremely unlikely, but fail open rather than crash
    console.error("[PII Scrubber] scrubPII failed entirely, returning original text:", err);
    return text;
  }
};

export const piiScrubberMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // No try/catch needed here — scrubPII handles all errors internally
  // and never throws. Middleware will always call next().
  if (req.body?.prompt && typeof req.body.prompt === "string") {
    req.body.prompt = scrubPII(req.body.prompt);
  }
  if (req.body?.content && typeof req.body.content === "string") {
    req.body.content = scrubPII(req.body.content);
  }
  if (req.body?.title && typeof req.body.title === "string") {
    req.body.title = scrubPII(req.body.title);
  }
  if (req.body?.message && typeof req.body.message === "string") {
    req.body.message = scrubPII(req.body.message);
  }

  next();
};

export default piiScrubberMiddleware;