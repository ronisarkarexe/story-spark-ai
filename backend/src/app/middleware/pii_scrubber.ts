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

  // 3. Regex for IP Addresses (IPv4 and IPv6)
  const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  const ipv6Regex = /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g;
  scrubbed = scrubbed.replace(ipv4Regex, "[REDACTED_IP]");
  scrubbed = scrubbed.replace(ipv6Regex, "[REDACTED_IP]");

  // 4. Regex for SSN / National IDs (e.g. US SSN)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  scrubbed = scrubbed.replace(ssnRegex, "[REDACTED_SSN]");

  // 5. Regex for Credit Card Numbers (13 to 16 digits, with optional spaces/dashes)
  const ccRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{13,16}\b/g;
  scrubbed = scrubbed.replace(ccRegex, "[REDACTED_CREDIT_CARD]");

  // 6. Regex for Secrets / Passwords / API Keys (case insensitive)
  const secretsRegex = /\b(?:password|passwd|pwd|passcode|api_key|apikey|api-key|secret|token|client_secret|client-secret|private_key|private-key|auth_token)\s*[:=]\s*[^\s"']{6,}\b/gi;
  scrubbed = scrubbed.replace(secretsRegex, "[REDACTED_SECRET]");

  // 7. Regex for Street Addresses (case-insensitive, ReDoS-safe)
  const addressRegex = /\b\d+\s+[A-Za-z0-9.,#-]+(?:\s+[A-Za-z0-9.,#-]+){0,4}\s+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Court|Ct|Circle|Cir|Trail|Trl|Highway|Hwy)\b/gi;
  scrubbed = scrubbed.replace(addressRegex, "[REDACTED_ADDRESS]");

  // 8. Name Extraction (Compromise NLP + Introductory/Honorific Patterns)
  const introRegex = /\b(?:my name is|i am|i'm|im|call me|this is|myself|meet|named|introduced as|referred to as|known as|alias|aka|sincerely|best regards|thanks|regards|from|mr|mrs|ms|dr|prof|professor|officer|president|king|queen|prince|princess)\b[,.]?\s+([a-zA-Z]{3,}(?:\s+[a-zA-Z]{3,}){0,2})\b/gi;
  
  const stopWords = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "in", "to", "by", "of", "up", "out",
    "about", "very", "too", "not", "no", "yes", "here", "there", "when", "how", "why", "who", "what",
    "where", "which", "developer", "student", "teacher", "writer", "doctor", "nurse", "engineer",
    "designer", "manager", "artist", "actor", "hero", "villain", "friend", "parent", "mother", "father",
    "sister", "brother", "son", "daughter", "child", "kids", "cousin", "uncle", "aunt", "boss", "client",
    "customer", "story", "book", "page", "write", "read", "some", "many", "few", "more"
  ]);

  let match;
  const extractedNames: string[] = [];
  while ((match = introRegex.exec(scrubbed)) !== null) {
    const candidate = match[1];
    const words = candidate.toLowerCase().split(/\s+/);
    const hasStopWord = words.some(word => stopWords.has(word));
    if (!hasStopWord) {
      extractedNames.push(candidate);
    }
  }

  const doc = compromise(scrubbed);
  const compromisePeople = doc.people().out("array");

  const allPeople = Array.from(new Set([...compromisePeople, ...extractedNames]));
  allPeople.sort((a, b) => b.length - a.length);

  for (const person of allPeople) {
    if (person.length > 2) {
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
