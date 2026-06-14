/**
 * Comprehensive XSS sanitization utilities for StorySpark AI.
 * Sanitizes all user-generated content before storage and rendering.
 */

// Characters and their HTML entity equivalents for escaping
const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "\\": "&#x5C;",
  "`": "&#96;",
};

const HTML_UNESCAPE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(HTML_ESCAPE_MAP).map(([k, v]) => [v, k])
);

// Dangerous HTML tags that must be completely stripped
const DANGEROUS_TAGS = [
  "script", "iframe", "object", "embed", "form", "input",
  "textarea", "button", "select", "option", "link", "style",
  "meta", "base", "head", "title", "body", "html", "svg",
  "math", "frame", "frameset", "applet", "param", "marquee",
  "blink", "xmp", "listing", "plaintext", "noscript",
];

// Dangerous attributes that can execute JavaScript
const DANGEROUS_ATTRIBUTES = [
  "onerror", "onload", "onclick", "onmouseover", "onmouseout",
  "onmousedown", "onmouseup", "onmousemove", "onkeydown",
  "onkeyup", "onkeypress", "onsubmit", "onchange", "onfocus",
  "onblur", "ondblclick", "oncontextmenu", "onwheel",
  "ontouchstart", "ontouchend", "ontouchmove", "ondrag",
  "ondrop", "onscroll", "onresize", "onpageshow", "onpagehide",
  "onhashchange", "onbeforeunload", "onpopstate",
  "onanimationstart", "onanimationend", "ontransitionend",
  "onreadystatechange", "onpointerenter", "onpointerleave",
  "onpointermove", "onpointerdown", "onpointerup", "onabort",
  "oncanplay", "oncanplaythrough", "ondurationchange",
  "onemptied", "onended", "onloadeddata", "onloadedmetadata",
  "onloadstart", "onpause", "onplay", "onplaying", "onprogress",
  "onratechange", "onseeked", "onseeking", "onstalled",
  "onsuspend", "ontimeupdate", "onvolumechange", "onwaiting",
];

// Dangerous URL protocols
const DANGEROUS_PROTOCOLS = [
  "javascript:", "data:", "vbscript:", "mocha:", "livescript:",
  "about:", "file:", "view-source:", "jar:", "apt:",
];

/**
 * Escape HTML special characters to prevent XSS.
 * This is the primary sanitization function.
 */
export const escapeHtml = (input: string | undefined | null): string => {
  if (!input || typeof input !== "string") return "";
  return input.replace(/[&<>"'`\\/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
};

/**
 * Unescape HTML entities back to their original characters.
 * Use only for display purposes where HTML is expected.
 */
export const unescapeHtml = (input: string | undefined | null): string => {
  if (!input || typeof input !== "string") return "";
  return input.replace(
    /&(?:amp|lt|gt|quot|#x27|#x2F|#x5C|#96|#x2d|#x20);/g,
    (entity) => HTML_UNESCAPE_MAP[entity] || entity
  );
};

/**
 * Strip all HTML tags from input, returning plain text only.
 * Use for fields that should never contain HTML.
 */
export const stripHtml = (input: string | undefined | null): string => {
  if (!input || typeof input !== "string") return "";
  let cleaned = input;
  // Remove script/style contents first
  cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  // Remove all HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, "");
  // Decode common HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, " ");
  cleaned = cleaned.replace(/&amp;/g, "&");
  cleaned = cleaned.replace(/&lt;/g, "<");
  cleaned = cleaned.replace(/&gt;/g, ">");
  cleaned = cleaned.replace(/&quot;/g, '"');
  return cleaned.trim();
};

/**
 * Advanced sanitization that allows safe HTML but strips dangerous content.
 * Use for rich text fields where some formatting is allowed.
 */
export const sanitizeRichText = (input: string | undefined | null): string => {
  if (!input || typeof input !== "string") return "";

  let sanitized = input;

  // Remove script and style tags with their contents
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove dangerous tags
  for (const tag of DANGEROUS_TAGS) {
    const regex = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>|<${tag}\\b[^>]*/?>`, "gi");
    sanitized = sanitized.replace(regex, "");
  }

  // Remove dangerous attributes from all tags
  for (const attr of DANGEROUS_ATTRIBUTES) {
    const regex = new RegExp(`\\s${attr}=["'][^"']*["']`, "gi");
    sanitized = sanitized.replace(regex, "");
  }

  // Remove javascript: and data: protocols from href/src attributes
  for (const protocol of DANGEROUS_PROTOCOLS) {
    const regex = new RegExp(`(href|src|action|background|dynsrc|lowsrc|formaction)=["']${protocol}[^"']*["']`, "gi");
    sanitized = sanitized.replace(regex, '$1="#blocked"');
  }

  // Remove event handlers as inline attributes (catch-all)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "");

  // Remove expression() and binding() for older IE
  sanitized = sanitized.replace(/expression\s*\(/gi, "( ");
  sanitized = sanitized.replace(/binding\s*\(/gi, "( ");

  return sanitized;
};

/**
 * Sanitize a plain text field — strips all HTML, returns safe text.
 * Use for: titles, prompts, tags, usernames, etc.
 */
export const sanitizeText = (input: string | undefined | null): string => {
  if (!input || typeof input !== "string") return "";
  // First strip all HTML
  const stripped = stripHtml(input);
  // Then escape any remaining special characters
  return escapeHtml(stripped);
};

/**
 * Sanitize URL input — only allow safe protocols.
 */
export const sanitizeUrl = (input: string | undefined | null): string => {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();

  // Allow relative URLs
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Allow known safe protocols
  const safeProtocols = ["http:", "https:", "mailto:", "tel:"];
  const lower = trimmed.toLowerCase();

  for (const protocol of safeProtocols) {
    if (lower.startsWith(protocol)) {
      return trimmed;
    }
  }

  // Block everything else
  return "";
};

/**
 * Recursively sanitize all string fields in an object.
 * Non-string fields are left untouched.
 */
export const sanitizeObjectStrings = <T extends Record<string, any>>(
  obj: T,
  sanitizer: (input: string) => string = sanitizeText
): T => {
  if (!obj || typeof obj !== "object") return obj;

  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === "string") {
      result[key] = sanitizer(result[key]);
    } else if (Array.isArray(result[key])) {
      result[key] = result[key].map((item: any) =>
        typeof item === "string" ? sanitizer(item) :
        typeof item === "object" ? sanitizeObjectStrings(item, sanitizer) : item
      );
    } else if (typeof result[key] === "object" && result[key] !== null) {
      result[key] = sanitizeObjectStrings(result[key], sanitizer);
    }
  }
  return result;
};

/**
 * Truncate text to a maximum length with ellipsis.
 */
export const truncateText = (
  input: string | undefined | null,
  maxLength: number = 200
): string => {
  if (!input || typeof input !== "string") return "";
  if (input.length <= maxLength) return input;
  return input.substring(0, maxLength).trim() + "...";
};

/**
 * Comprehensive sanitization for a complete story payload.
 * Used before saving any story to the database.
 */
export const sanitizeStoryPayload = <T extends { title?: string; content?: string; prompt?: string; tag?: string }>(
  payload: T
): T => {
  const sanitized = { ...payload };

  if (sanitized.title !== undefined) {
    sanitized.title = sanitizeText(sanitized.title);
  }
  if (sanitized.content !== undefined) {
    // Content can have safe HTML (formatting) but no scripts
    sanitized.content = sanitizeRichText(sanitized.content);
  }
  if ((sanitized as any).prompt !== undefined) {
    (sanitized as any).prompt = sanitizeText((sanitized as any).prompt);
  }
  if (sanitized.tag !== undefined) {
    sanitized.tag = sanitizeText(sanitized.tag);
  }

  return sanitized;
};