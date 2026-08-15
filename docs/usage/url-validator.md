# 🔗 URL Validator Utility (isValidUrl)

This document explains the usage and behavior of the `isValidUrl` utility function located in `backend/src/app/utils/urlValidator.ts`.

---

## 1. Purpose and Use Case

The `isValidUrl` function is designed to validate URL string values. It is commonly used in route handlers and validation schemas to ensure that user-provided URLs (like external links or profile websites) are well-formed and safe before the application processes or stores them.

---

## 2. Function Signature

The function is defined as follows:

```typescript
export const isValidUrl = (url: string): boolean => { /* implementation */ }
```

- **Parameter**: `url` (`string`) – The URL string that needs to be validated.

---

## 3. Return Value

- `true` → The URL is valid and uses an allowed protocol.
- `false` → The URL is invalid, malformed, or uses a disallowed protocol.

---

## 4. Allowed Protocols

For security reasons, `isValidUrl` strictly limits the allowed protocols. 

**Allowed:**
- `http:`
- `https:`

**Rejected:**
- `javascript:` (preventing XSS attacks)
- `data:`
- Any other protocol not explicitly allowed.

---

## 5. Examples

The following table demonstrates the expected validation behavior for various types of inputs:

| Input URL | Expected Result (`isValidUrl`) | Description |
| :--- | :--- | :--- |
| `http://localhost` | `true` | Valid localhost URL |
| `http://localhost:3000/api` | `true` | Valid localhost URL containing a port number |
| `https://example.com:8080/path` | `true` | Valid URL containing a port number |
| `https://example.com?search=test&page=1` | `true` | Valid URL containing query strings |
| `/api/users/123` | `false` | Relative paths are invalid (an absolute URL is required) |
| `javascript:alert('XSS')` | `false` | `javascript:` URLs are explicitly rejected |
| `invalid-url-string` | `false` | Malformed string without a valid protocol |

---

## 6. Sanitization Comparison

It is important to understand the difference between URL **validation** (`isValidUrl`) and URL **sanitization** (`sanitizeUrl`).

- **URL Validation (`isValidUrl`)**: 
  - **Purpose**: Checks whether the URL is allowed and acceptable.
  - **Action**: Returns a boolean (`true`/`false`). It does not modify the input.
  - **Usage**: Used in validation schemas or route guards where you must accept or reject a request outright. For instance, if a user submits an invalid URL, validation allows the API to return a `400 Bad Request`.

- **URL Sanitization (`sanitizeUrl` in `backend/src/utils/sanitize.util.ts`)**:
  - **Purpose**: Cleans or transforms potentially unsafe input into a safe format.
  - **Action**: Returns a sanitized string, or an empty string `""` if the input is completely unsafe. 
  - **Actual Behavior**: The repository's existing `sanitizeUrl` utility accepts broader inputs than `isValidUrl`. For example, it allows **relative URLs** (starting with `/`) and protocols like `mailto:` and `tel:`. 
  - **Usage**: Used before rendering user-provided URLs in the frontend or before storing them to ensure no dangerous scripts can be executed.

---

Made with ❤️ for contributors learning the StorySpark AI utilities.
