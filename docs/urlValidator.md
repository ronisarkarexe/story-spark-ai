# URL Validator

The `urlValidator` module (`backend/src/app/utils/urlValidator.ts`) provides utilities for safely validating absolute HTTP and HTTPS URLs.

## Functions

### `isValidUrl(url: string): boolean`

Validates whether a given string is a well-formed absolute URL with an allowed protocol.

**Parameters:**
- `url` (string): The URL string to validate.

**Returns:** `boolean` — `true` if the URL is valid with an allowed protocol, `false` otherwise.

**Allowed protocols:** `http:`, `https:`

**Behavior:**
- Returns `false` for `null`, `undefined`, or non-string input.
- Returns `false` for relative paths (paths without a protocol).
- Returns `false` for URLs using disallowed protocols (`javascript:`, `data:`, `vbscript:`, etc.).
- Handles `localhost`, port numbers, query strings, and URL fragments correctly.

**Examples:**

```typescript
// Valid URLs
isValidUrl("https://example.com");            // true
isValidUrl("http://localhost:3000");         // true
isValidUrl("https://api.app.com/v1/users"); // true
isValidUrl("https://example.com/path?q=1"); // true

// Invalid URLs
isValidUrl("javascript:alert(1)");           // false — dangerous protocol
isValidUrl("data:text/html,<script>x</script>"); // false — dangerous protocol
isValidUrl("/stories/123");                  // false — relative path
isValidUrl("ftp://example.com");              // false — disallowed protocol
isValidUrl("example.com");                   // false — no protocol
isValidUrl("");                              // false — empty string
isValidUrl(null);                            // false — null
```

## Usage in Route Handlers

Use `isValidUrl` to validate URL fields in request bodies and query parameters:

```typescript
import { isValidUrl } from "../app/utils/urlValidator";

app.post("/api/share-link", async (req, res) => {
  const { shareUrl } = req.body;

  if (!isValidUrl(shareUrl)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  // proceed with the share URL...
});
```

## Security Considerations

- Always validate URLs before storing them in the database or using them in redirects.
- The validator rejects `javascript:` and `data:` URLs which can be used for XSS attacks.
- Prefer this validator over regex-only URL validation for robust protocol checking.
- For user-provided URLs that will be rendered in `<a href>` attributes, also sanitize the URL to remove potentially dangerous protocols.
