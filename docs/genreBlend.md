# Genre Blend Utilities

Location: `frontend/src/utils/genreBlend.ts`

Provides utilities for blending multiple genres into a single story generation prompt.

## Interfaces

### `GenreBlendRequest`

```typescript
interface GenreBlendRequest {
  genres: string[];   // Array of genre names to blend
  prompt: string;     // Base story prompt text
}
```

### `GenreBlendResult`

```typescript
interface GenreBlendResult {
  selectedGenres: string[];  // The genres used in the blend
  blendedPrompt: string;    // The prompt incorporating the genre blend
}
```

## Functions

### `blendGenres`

Blends a list of genres into a story generation prompt.

```typescript
const blendGenres = (request: GenreBlendRequest): GenreBlendResult
```

**Parameters:**
- `request` (`GenreBlendRequest`) - The genres and base prompt to blend

**Returns:** `GenreBlendResult` - The selected genres and blended prompt

**Example:**
```typescript
const result = blendGenres({
  genres: ["Fantasy", "Mystery"],
  prompt: "Write a story about a detective"
});
// result.selectedGenres => ["Fantasy", "Mystery"]
// result.blendedPrompt  => "Write a story about a detective"
```

### `validateGenres`

Validates that a genre array contains at least two entries.

```typescript
const validateGenres = (genres: string[]): boolean
```

**Parameters:**
- `genres` (`string[]`) - Array of genre names to validate

**Returns:** `boolean` - `true` if the array has at least 2 genres, `false` otherwise

**Example:**
```typescript
validateGenres(["Fantasy", "Romance"])  // true
validateGenres(["Horror"])              // false
validateGenres([])                       // false
```

### `validatePromptLength`

Validates that a prompt string does not exceed the maximum allowed length.

```typescript
const validatePromptLength = (
  prompt: string,
  maxLength?: number
): boolean
```

**Parameters:**
- `prompt` (`string`) - The prompt string to validate
- `maxLength` (`number`, optional) - Maximum allowed character count (default: 2000)

**Returns:** `boolean` - `true` if the prompt is within the length limit, `false` otherwise

**Example:**
```typescript
validatePromptLength("Short prompt", 2000)  // true
validatePromptLength("x".repeat(3000), 2000) // false
validatePromptLength("")                     // false (empty string)
```

**Default:** `DEFAULT_MAX_PROMPT_LENGTH = 2000`

### `regenerateBlend`

Regenerates a genre blend from an existing request. Internally calls `blendGenres`.

```typescript
const regenerateBlend = (request: GenreBlendRequest): GenreBlendResult
```

**Parameters:**
- `request` (`GenreBlendRequest`) - The genres and base prompt

**Returns:** `GenreBlendResult` - A freshly blended result

**Example:**
```typescript
const fresh = regenerateBlend({ genres: ["Sci-Fi"], prompt: "Explore space" });
```

## Usage Guide

```typescript
import {
  blendGenres,
  validateGenres,
  validatePromptLength,
  regenerateBlend,
  type GenreBlendRequest,
} from "../utils/genreBlend";

// Step 1: Validate genres (at least 2 required)
const genres = ["Fantasy", "Mystery"];
if (!validateGenres(genres)) {
  throw new Error("Please select at least two genres.");
}

// Step 2: Validate prompt length
const prompt = "Write a story about a hidden treasure.";
if (!validatePromptLength(prompt)) {
  throw new Error("Prompt exceeds maximum length.");
}

// Step 3: Blend the genres into the prompt
const result = blendGenres({ genres, prompt });

// Step 4: Use the result for story generation
console.log(result.selectedGenres); // ["Fantasy", "Mystery"]
console.log(result.blendedPrompt);  // "Write a story about a hidden treasure."

// Step 5: Regenerate if user wants a new blend
const refreshed = regenerateBlend({ genres, prompt });
```

## Notes

- `blendGenres` currently returns the input prompt unchanged. Future implementations may inject genre-specific keywords into the prompt.
- `validateGenres` does not validate individual genre names against a known list; callers should perform their own genre name validation if needed.
- All utilities are pure functions with no side effects, making them easy to unit test.
