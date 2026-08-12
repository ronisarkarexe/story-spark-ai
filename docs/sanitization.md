# Sanitization Utilities

The `sanitization` module (`backend/src/app/utils/sanitization.ts`) provides a set of utilities for safely sanitizing user-supplied input, particularly to prevent XSS (Cross-Site Scripting) attacks.

## Functions

### `stripHtmlTags(input: string): string`

Removes all HTML tags from a string, handling both complete tags and incomplete tag openers.

**Parameters:**
- `input` (string): The string to strip HTML from.

**Returns:** `string` — The input string with HTML tags removed.

**Behavior:**
- First pass: removes all complete HTML tags (`<tag>`).
- Second pass: removes remaining tag-like openers (e.g. `<script` without `>`).
- Third pass: removes standalone `<` characters that are tag-like.
- Trims whitespace from the result.

**Examples:**

```typescript
stripHtmlTags("<p>Hello</p>");              // "Hello"
stripHtmlTags("<script>alert(1)</script>"); // ""
stripHtmlTags("<b>bold</b> and <i>italic</i>"); // "bold and italic"
stripHtmlTags("  <p>  text  </p>  ");     // "text"
```

### `truncate(input: string, maxLength: number, suffix?: string): string`

Truncates a string to a maximum length, appending a suffix if truncation occurred.

**Parameters:**
- `input` (string): The string to truncate.
- `maxLength` (number): Maximum desired length of the result.
- `suffix` (string, optional): Suffix to append when truncating. Defaults to `'...'`.

**Returns:** `string` — The truncated string, or the original if shorter than maxLength.

**Examples:**

```typescript
truncate("hello", 10);                      // "hello"
truncate("hello world this is long", 10);  // "hello..."
truncate("hello   ", 10);                  // "hello..."
truncate("hello", 5, " (more)");           // "hello"
truncate("hello world", 5, " (more)");     // "he (more)"
```

### `normalizeWhitespace(input: string): string`

Collapses multiple consecutive whitespace characters into a single space and trims leading/trailing whitespace.

**Parameters:**
- `input` (string): The string to normalize.

**Returns:** `string` — The normalized string.

**Examples:**

```typescript
normalizeWhitespace("hello    world");     // "hello world"
normalizeWhitespace("  hello  ");         // "hello"
normalizeWhitespace("a\n\tb  c");         // "a b c"
```

### `isAllowedUrlProtocol(url: string): boolean`

Checks whether a URL uses an allowed (safe) protocol. This is the primary defense against `javascript:` and `data:` URL-based XSS attacks.

**Allowed protocols:** `http:`, `https:`, `mailto:`, `tel:`

**Parameters:**
- `url` (string): The URL to check.

**Returns:** `boolean` — `true` if the URL uses an allowed protocol, `false` otherwise.

**Behavior:**
- Uses the `URL` constructor for thorough validation when the input looks like an absolute URL.
- Falls back to regex validation for edge cases the parser cannot handle.
- Returns `false` for `null`, `undefined`, or empty string.

**Examples:**

```typescript
isAllowedUrlProtocol("https://example.com");  // true
isAllowedUrlProtocol("http://localhost:3000"); // true
isAllowedUrlProtocol("mailto:user@ex.com");   // true
isAllowedUrlProtocol("tel:+1234567890");       // true
isAllowedUrlProtocol("javascript:alert(1)");   // false
isAllowedUrlProtocol("data:text/html,<script>x</script>"); // false
isAllowedUrlProtocol("vbscript:msgbox('x')"); // false
```

### `sanitizeUrl(url: string, fallback?: string): string`

Returns a sanitized URL if the protocol is allowed, or the provided fallback string if dangerous.

**Parameters:**
- `url` (string): The URL to sanitize.
- `fallback` (string, optional): Fallback value when URL is not safe. Defaults to empty string.

**Returns:** `string` — The sanitized URL, or the fallback value.

**Examples:**

```typescript
sanitizeUrl("https://example.com");               // "https://example.com"
sanitizeUrl("javascript:alert(1)");               // ""
sanitizeUrl("javascript:alert(1)", "/");          // "/"
sanitizeUrl("https://app.com/story/123");          // "https://app.com/story/123"
```

## Security Considerations

- Always use `isAllowedUrlProtocol` or `sanitizeUrl` before storing or using user-supplied URLs, especially in `href`, `src`, or `window.location` contexts.
- Never rely solely on the `URL` constructor to block `javascript:` URLs — always explicitly check the protocol.
- Use `stripHtmlTags` before rendering user-supplied content in HTML contexts.
- `sanitizeUrl` is appropriate for `<a href>` attributes; combine with output encoding for complete protection.
