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

  // 1. Regex for Emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  scrubbed = scrubbed.replace(emailRegex, "[REDACTED_EMAIL]");

  // 2. Regex for Phone Numbers (various formats)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  scrubbed = scrubbed.replace(phoneRegex, "[REDACTED_PHONE]");

  // 3. NLP for Person Names using compromise
  const doc = compromise(scrubbed);
  const people = doc.people().out("array");
  
  // Sort by length descending to replace longer names first (prevent partial replacement issues)
  people.sort((a: string, b: string) => b.length - a.length);

  for (const person of people) {
    if (person.length > 2) {
      // Create a global regex to replace the specific name exactly (case insensitive)
      const nameRegex = new RegExp(`\\b${escapeRegex(person)}\\b`, "gi");
      scrubbed = scrubbed.replace(nameRegex, "[REDACTED_NAME]");
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
