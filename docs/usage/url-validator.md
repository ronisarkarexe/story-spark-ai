# URL Validator Utility

## Overview

The `urlValidator` utility in `backend/src/app/utils/urlValidator.ts` provides a single exported function `isValidUrl` for validating that a given string is a well-formed absolute HTTP or HTTPS URL. It is used in route handlers and validation schemas to ensure URL fields contain safe, well-formed URLs and to prevent XSS via dangerous URL protocols.

## Function

### `isValidUrl(url: string): boolean`

Returns `true` if the input string is a valid absolute URL using the `http:` or `https:` protocol. Returns `false` for all other cases including relative paths, malformed URLs, and dangerous protocols.

## Parameters

| Parameter | Type   | Description                    |
|-----------|--------|--------------------------------|
| `url`     | string | The URL string to validate      |

## Return Value

- `true`: The URL is well-formed and uses a safe protocol (`http:` or `https:`)
- `false`: The URL is malformed, uses an unsafe protocol, or is empty/invalid

## Allowed Protocols

| Protocol | Allowed |
|----------|---------|
| `http:`  | Yes     |
| `https:` | Yes     |
| `javascript:` | No (blocked) |
| `data:`  | No (blocked) |
| `vbscript:` | No (blocked) |
| `file:`  | No (blocked) |
| `about:` | No (blocked) |

## Examples

```typescript
import { isValidUrl } from "../utils/urlValidator";

// Valid URLs
isValidUrl("https://example.com")              // true
isValidUrl("http://localhost:3000")             // true
isValidUrl("https://example.com/path?query=1") // true
isValidUrl("https://example.com#section")       // true

// Invalid URLs
isValidUrl("javascript:alert(1)")              // false — dangerous protocol
isValidUrl("/relative/path")                   // false — relative path
isValidUrl("not-a-url")                        // false — no protocol
isValidUrl("")                                 // false — empty string
isValidUrl(null as any)                        // false — null input
isValidUrl(undefined as any)                   // false — undefined input
```

## Usage in Route Handlers

Use `isValidUrl` in Zod or Joi validation schemas when a field must contain a safe URL:

```typescript
import { isValidUrl } from "../utils/urlValidator";
import { z } from "zod";

const storySchema = z.object({
  coverImageUrl: z.string().refine((val) => isValidUrl(val), {
    message: "coverImageUrl must be a valid HTTP or HTTPS URL",
  }),
});
```

## Related Utilities

- `sanitizeUrl` in `sanitization.ts` — strips dangerous URL protocols from user-supplied URLs
- `isAllowedUrlProtocol` in `sanitization.ts` — checks whether a URL protocol is in the allowlist
