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

  try {
    // 1. Regex for Emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    scrubbed = scrubbed.replace(emailRegex, "[REDACTED_EMAIL]");

    // 2. Regex for Phone Numbers (various formats)
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    scrubbed = scrubbed.replace(phoneRegex, "[REDACTED_PHONE]");

    // 3. NLP for Person Names — wrapped separately so regex scrubbing above
    //    always runs even if compromise throws
    try {
      const doc = compromise(scrubbed);
      const people = doc.people().out("array") as string[];

      // Sort by length descending to replace longer names first (prevent partial replacement issues)
      people.sort((a, b) => b.length - a.length);

      for (const person of people) {
        if (person.length > 2) {
          const nameRegex = new RegExp(`\\b${escapeRegex(person)}\\b`, "gi");
          scrubbed = scrubbed.replace(nameRegex, "[REDACTED_NAME]");
        }
      }
    } catch (nlpError) {
      // NLP failed — email/phone already scrubbed above, name detection skipped
      // Log for monitoring but do NOT block the request
      console.error("[PII Scrubber] NLP name detection failed, skipping:", nlpError);
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