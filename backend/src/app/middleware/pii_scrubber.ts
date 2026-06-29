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

  // Idempotency guard — prevents double-scrubbing if middleware runs twice
  const containsAnyRedactionToken =
    /\[REDACTED_(?:EMAIL|PHONE|NAME|SSN|CARD|ADDRESS)\]/i.test(scrubbed);
  if (containsAnyRedactionToken) return scrubbed;

  try {
    // 1. Emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    scrubbed = scrubbed.replace(emailRegex, "[REDACTED_EMAIL]");

    // 2. Phone numbers
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    scrubbed = scrubbed.replace(phoneRegex, "[REDACTED_PHONE]");
    const phoneFallbackRegex = /\b\d{3}([-.\s])?\d{3}\1?\d{4}\b/g;
    scrubbed = scrubbed.replace(phoneFallbackRegex, "[REDACTED_PHONE]");

    // 3. SSN
    const ssnRegex = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g;
    scrubbed = scrubbed.replace(ssnRegex, "[REDACTED_SSN]");

    // 4. Credit cards
    const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
    scrubbed = scrubbed.replace(cardRegex, "[REDACTED_CARD]");

    // 5. Addresses
    const addressRegex =
      /\b\d{1,5}\s+[A-Za-z0-9][A-Za-z0-9\s.'-]{1,60}\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Parkway|Pkwy)\b/gi;
    scrubbed = scrubbed.replace(addressRegex, "[REDACTED_ADDRESS]");
    const addressAltRegex =
      /\b\d{1,5}\s+(?:N|S|E|W|NE|NW|SE|SW)\.?\s+[A-Za-z0-9][A-Za-z0-9\s.'-]{1,60}\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Parkway|Pkwy)\b/gi;
    scrubbed = scrubbed.replace(addressAltRegex, "[REDACTED_ADDRESS]");

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
      }
    } catch (nlpError) {
      // Fail-open: email/phone/SSN/card/address already scrubbed above
      console.error("[PII Scrubber] NLP name detection failed, skipping:", nlpError);
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