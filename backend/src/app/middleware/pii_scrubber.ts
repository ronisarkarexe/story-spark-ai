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




  // 1. Emails

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  scrubbed = scrubbed.replace(emailRegex, "[REDACTED_EMAIL]");

  // 2. Phone numbers
  // Cover formats like:
  //   555-867-5309 | 555 867 5309 | (555) 867-5309 | +1 555.867.5309
  // plus a fallback for 10-digit sequences with optional separators.
  // UK/International Mobile formats
  const phoneIntRegex = /(?<![\w/])(?:\+44\s?|0)7\d{3}[-.\s]?\d{6}\b/g;
  scrubbed = scrubbed.replace(phoneIntRegex, "[REDACTED_PHONE]");

  const phoneRegex =
    /(?<![\w/])(?:\+\d{1,3}[-.\s]?|1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  scrubbed = scrubbed.replace(phoneRegex, "[REDACTED_PHONE]");

  // Fallback: 10 digits possibly separated by spaces/dots/dashes, with word boundaries.
  // (Intentionally conservative; does not try to validate country codes.)
  const phoneFallbackRegex = /(?<![\w/])\d{3}([-.\s])?\d{3}\1?\d{4}\b/g;
  scrubbed = scrubbed.replace(phoneFallbackRegex, "[REDACTED_PHONE]");

  // Local US 7-digit formats
  const phoneLocalRegex = /(?<![\w/])\d{3}[-.\s]\d{4}\b/g;
  scrubbed = scrubbed.replace(phoneLocalRegex, "[REDACTED_PHONE]");

  // 3. Structured identifiers that are commonly labeled in request bodies
  const accountNumberRegex =
    /\b(?:bank\s+account(?:\s+number)?|account(?:\s+number)?|acct(?:\.?|\s+number)?|checking\s+account)\b[\s:#-]*[A-Za-z0-9-]{2,20}\b/gi;
  scrubbed = scrubbed.replace(accountNumberRegex, "[REDACTED_ACCOUNT_NUMBER]");

  const passportRegex =
    /\b(?:passport(?:\s*(?:no|number|nr|num))?)\b[\s:#-]*[A-Za-z0-9]{2,12}\b/gi;
  scrubbed = scrubbed.replace(passportRegex, "[REDACTED_PASSPORT]");

  const driverLicenseRegex =
    /\b(?:driver(?:'s|s)?\s+license|drivers?\s+license|license(?:\s*(?:no|number|nr|num))?|dl)\b[\s:#-]*[A-Za-z0-9]{2,12}\b/gi;
  scrubbed = scrubbed.replace(driverLicenseRegex, "[REDACTED_DRIVER_LICENSE]");

  const taxIdRegex =
    /\b(?:tax\s*(?:id|identifier|number)|tin)\b[\s:#-]*[A-Za-z0-9-]{2,12}\b/gi;
  scrubbed = scrubbed.replace(taxIdRegex, "[REDACTED_TAX_ID]");

  const governmentIdRegex =
    /\b(?:government\s+id|national\s+id|citizen\s+id|personal\s+id|id\s+number)\b[\s:#-]*[A-Za-z0-9-]{2,20}\b/gi;
  scrubbed = scrubbed.replace(governmentIdRegex, "[REDACTED_GOVERNMENT_ID]");

  // 4. SSN (US)
  // Matches 123-45-6789 or 123 45 6789
  const ssnRegex = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g;
  scrubbed = scrubbed.replace(ssnRegex, "[REDACTED_SSN]");

  // 5. Credit card-like sequences
  // Matches 13-19 digits with optional spaces/dashes.
  // This is heuristic (not Luhn-valid), but generally effective for scrubbing.
  const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  scrubbed = scrubbed.replace(cardRegex, "[REDACTED_CARD]");

  // 6a. US address variations with directional prefixes/suffixes (still conservative)
  // Examples: "123 N Main St", "456 S. 2nd Ave", "789 W Elm Road"
  const addressAltRegex =
    /\b\d{1,5}\s+(?:N|S|E|W|NE|NW|SE|SW)\.?\s+[A-Za-z0-9][A-Za-z0-9\s.'-]{1,60}\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Parkway|Pkwy)(?:\s+(?:Apt|Apartment|Suite|Ste|Unit|Room)\s+[A-Za-z0-9#-]+)?(?:\s*,\s*[A-Za-z\s]+)?(?:\s*,\s*[A-Z]{2})?(?:\s+\d{5})?\b/gi;
  scrubbed = scrubbed.replace(addressAltRegex, "[REDACTED_ADDRESS]");

  // 6b. Conservative address pattern
  // Matches: street number + street name + common suffix (St, Ave, Blvd, Rd, Dr, Ln, Ct, Pl, Pkwy)
  // Example: "123 Main St". Avoids over-broad matching.
  const addressRegex =
    /\b\d{1,5}\s+[A-Za-z0-9][A-Za-z0-9\s.'-]{1,60}\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Parkway|Pkwy)(?:\s+(?:Apt|Apartment|Suite|Ste|Unit|Room)\s+[A-Za-z0-9#-]+)?(?:\s*,\s*[A-Za-z\s]+)?(?:\s*,\s*[A-Z]{2})?(?:\s+\d{5})?\b/gi;
  scrubbed = scrubbed.replace(addressRegex, "[REDACTED_ADDRESS]");

  // 7. NLP for Person Names using compromise
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
