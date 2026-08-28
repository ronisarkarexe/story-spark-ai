 test/content-moderation-3836
// backend/src/utils/contentModeration.ts

interface ModerationResult {
  
/**
 * Content moderation utility — Issue #3376
 * Detects and blocks inappropriate or harmful content in user-supplied text.
 * Designed to be called from promptSecurity.ts (prompt/output layer) and
 * from comment.service.ts (user-generated content layer).
 */

export interface ModerationResult {
 main
  blocked: boolean;
  reason?: string;
}

 test/content-moderation-3836
// Patterns for content moderation
const PATTERNS = {
  csam: [
    /child\s*(?:porn|abuse|exploit)/i,
    /underage\s*(?:sex|porn)/i,
    /minor\s*(?:sex|abuse)/i,
    /child\s*(?:sex|sexual)/i,
  ],
  hateSpeech: [
    /\b(?:racial|ethnic|religious)\s*(?:slur|hate)/i,
    /\b(?:black|white|asian|hispanic)\s*(?:hate|supremacy)/i,
    /\b(?:antisemitic|homophobic|transphobic)/i,
    /\b(?:nazi|white\s*supremacy)/i,
  ],
  violence: [
    /\b(?:kill|murder|slaughter|torture)\s*(?:people|person|child|kid)/i,
    /\b(?:shoot|stab|beat|attack)\s*(?:school|people|crowd)/i,
    /\b(?:bomb|terror|massacre|genocide)/i,
    /\b(?:execut|assassinate)/i,
  ],
  selfHarm: [
    /\b(?:suicide|kill\s*(?:myself|yourself|themself))/i,
    /\b(?:self\s*(?:harm|hurt|injury|mutilation))/i,
    /\b(?:cut\s*(?:myself|yourself|themself|wrist))/i,
    /\b(?:harm\s*(?:myself|yourself))/i,
  ],
};

/**
 * Check if content contains harmful patterns
 * @param text - The text to check
 * @returns { blocked: boolean, reason?: string }
 */
export function checkContent(text: string): ModerationResult {
  // Return safe for empty or whitespace-only text
  if (!text || text.trim().length === 0) {
    return { blocked: false };
  }

  const lowerText = text.toLowerCase().trim();

  // Check each category
  for (const [category, patterns] of Object.entries(PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerText)) {
        return {
          blocked: true,
          reason: category,
        };

// ── Pattern lists ──────────────────────────────────────────────────────────────

/** Patterns that signal explicit violence or gore */
const VIOLENCE_PATTERNS: RegExp[] = [
  /\b(how\s+to\s+(kill|murder|torture|harm)\s+(a\s+)?(person|people|human|child|kid))\b/i,
  /\b(step[- ]by[- ]step\s+(guide\s+)?(to\s+)?(kill|murder|attack))\b/i,
];

/** Patterns that signal hate speech targeting protected groups */
const HATE_SPEECH_PATTERNS: RegExp[] = [
  /\b(all\s+\w+\s+(should\s+)?(die|be\s+killed|be\s+exterminated))\b/i,
  /\b(genocide|ethnic\s+cleansing)\b/i,
];

/** Patterns that signal sexual content involving minors */
const CSAM_PATTERNS: RegExp[] = [
  /\b(child|minor|kid|underage)\s+(sexual|nude|naked|porn)\b/i,
  /\b(sexual|erotic)\s+(content|story|scene)\s+(with|about|involving)\s+(child|minor|kid)\b/i,
];

/** Patterns that signal self-harm instruction */
const SELF_HARM_PATTERNS: RegExp[] = [
  /\b(how\s+to\s+(commit\s+suicide|self[- ]harm|cut\s+yourself))\b/i,
  /\b(methods?\s+(for|of)\s+suicide)\b/i,
];

const ALL_CATEGORIES: Array<{ patterns: RegExp[]; label: string }> = [
  { patterns: CSAM_PATTERNS,       label: "content involving minors" },
  { patterns: HATE_SPEECH_PATTERNS, label: "hate speech" },
  { patterns: VIOLENCE_PATTERNS,   label: "violent instructions" },
  { patterns: SELF_HARM_PATTERNS,  label: "self-harm instructions" },
];

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Checks text against all moderation categories.
 * Returns `{ blocked: false }` when content is safe, or
 * `{ blocked: true, reason }` when a violation is detected.
 */
export function checkContent(text: string): ModerationResult {
  if (!text) return { blocked: false };

  for (const { patterns, label } of ALL_CATEGORIES) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return { blocked: true, reason: label };
 main
      }
    }
  }

  return { blocked: false };
}

/**
test/content-moderation-3836
 * Assert that content is safe (throws error if blocked)
 * @param text - The text to check
 * @throws {Error} - If content is blocked

 * Throws an Error when the text violates moderation rules.
 * Provides a clear, user-facing message suitable for API responses.
 main
 */
export function assertContentSafe(text: string): void {
  const result = checkContent(text);
  if (result.blocked) {
 test/content-moderation-3836
    throw new Error(`Content blocked: ${result.reason}`);
  }
}

    throw new Error(
      `Content moderation: your request was blocked because it contains ${result.reason}. Please revise your content.`
    );
  }
}
main
