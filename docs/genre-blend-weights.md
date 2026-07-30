# Genre Blend and Genre Weights Utilities

This document describes the API surface of the genre blending and genre weighting utilities in `frontend/src/utils/`.

## genreBlend.ts

Provides functions for validating and blending story genres in a genre-mixing workflow.

### validateGenres

Validates that a genre selection has enough variety.

```typescript
import { validateGenres } from "../utils/genreBlend";

const isValid = validateGenres(["fantasy", "sci-fi", "horror"]);
```

**Parameters:**
- `genres: string[]` - Array of genre names to validate

**Returns:** `boolean`
- `true` if `genres.length >= 2`
- `false` if the array has fewer than 2 elements
- Throws a `TypeError` if `genres` is `null` or `undefined`

**Notes:**
- Use this before passing a genre selection to `blendGenres` to ensure sufficient variety
- Returns `true` for exactly 2 genres (minimum valid selection)

---

### blendGenres

Wraps a genre selection and prompt into a structured result for downstream use.

```typescript
import { blendGenres } from "../utils/genreBlend";

const result = blendGenres({
  genres: ["fantasy", "sci-fi"],
  prompt: "write a story set in a magical space station",
});

console.log(result.selectedGenres); // ["fantasy", "sci-fi"]
console.log(result.blendedPrompt);  // "write a story set in a magical space station"
```

**Parameters:**
- `request: GenreBlendRequest` - Object containing `genres: string[]` and `prompt: string`

**Returns:** `GenreBlendResult`
- `selectedGenres: string[]` - Echoes the input genres array
- `blendedPrompt: string` - Echoes the input prompt

**Notes:**
- This is a pure pass-through function; it does not transform the input
- Use `validatePromptLength` to check the prompt before calling this function

---

### regenerateBlend

Regenerates a genre blend result. Currently delegates to `blendGenres`.

```typescript
import { regenerateBlend } from "../utils/genreBlend";

const result = regenerateBlend({
  genres: ["mystery", "thriller"],
  prompt: "solve the case in an abandoned manor",
});
```

**Parameters:** Same as `blendGenres`

**Returns:** Same shape as `blendGenres`

**Notes:**
- In the current implementation this is equivalent to `blendGenres`
- Callers should use this function to maintain forward compatibility

---

### validatePromptLength

Validates that a prompt does not exceed a maximum character length.

```typescript
import { validatePromptLength } from "../utils/genreBlend";

const withinLimit = validatePromptLength("my prompt text");          // uses default 2000
const withinLimit = validatePromptLength("my prompt text", 500);     // custom limit
```

**Parameters:**
- `prompt: string` - The prompt string to validate
- `maxLength?: number` - Optional maximum length in characters (default: 2000)

**Returns:** `boolean`
- `true` if `prompt.length <= maxLength`
- `false` if `prompt` is `null`, `undefined`, an empty string, or exceeds `maxLength`

**Notes:**
- Call this before passing a prompt to `blendGenres` or `regenerateBlend`
- The default limit of 2000 characters prevents oversized prompts from reaching downstream services
- Length is measured in JavaScript string characters (multibyte characters count as one)

---

### DEFAULT_MAX_PROMPT_LENGTH

Export constant set to `2000`. Use this when you need to reference the default limit programmatically.

```typescript
import { DEFAULT_MAX_PROMPT_LENGTH } from "../utils/genreBlend";
console.log(DEFAULT_MAX_PROMPT_LENGTH); // 2000
```

---

## genreWeights.ts

Provides functions for normalizing, validating, and formatting genre weight configurations.

### normalizeWeights

Normalizes an array of genre weights to percentages that sum to 100.

```typescript
import { normalizeWeights } from "../utils/genreWeights";

const normalized = normalizeWeights({
  genres: [
    { genre: "fantasy", weight: 30 },
    { genre: "sci-fi", weight: 70 },
  ],
});
// normalized.genres[0].weight === 30
// normalized.genres[1].weight === 70
```

**Parameters:**
- `config: GenreWeightConfig` - Object containing a `genres` array

**Returns:** `GenreWeightConfig`
- Weights are rounded to integers using `Math.round`
- Genre names are preserved unchanged

**Edge cases:**
- Empty genres array: returns `{ genres: [] }`
- All weights are zero: returns `{ genres: [] }`

**Notes:**
- The result always sums to 100 (unless the genres array is empty or all weights are zero)
- Use `validateWeights` separately to check if a configuration already sums to 100

---

### validateWeights

Validates that genre weights sum to exactly 100.

```typescript
import { validateWeights } from "../utils/genreWeights";

const isValid = validateWeights({
  genres: [
    { genre: "fantasy", weight: 60 },
    { genre: "sci-fi", weight: 40 },
  ],
});
// isValid === true
```

**Parameters:**
- `config: GenreWeightConfig` - Object containing a `genres` array

**Returns:** `boolean`
- `true` if the sum of all weights equals exactly 100
- `false` otherwise (including empty array)

---

### buildGenrePrompt

Builds a human-readable string from a genre weight configuration.

```typescript
import { buildGenrePrompt } from "../utils/genreWeights";

const prompt = buildGenrePrompt({
  genres: [
    { genre: "fantasy", weight: 70 },
    { genre: "sci-fi", weight: 30 },
  ],
});
// "fantasy (70%), sci-fi (30%)"
```

**Parameters:**
- `config: GenreWeightConfig` - Object containing a `genres` array

**Returns:** `string`
- Each genre formatted as `"<genre> (<weight>%)"`
- Multiple genres joined with `", "`
- Empty array returns `""`

---

## Usage Example

A typical workflow combining both utilities:

```typescript
import { validateGenres, validatePromptLength } from "../utils/genreBlend";
import { normalizeWeights, validateWeights } from "../utils/genreWeights";

// Step 1: validate genre count
if (!validateGenres(genres)) {
  throw new Error("Please select at least 2 genres");
}

// Step 2: validate prompt length
if (!validatePromptLength(prompt)) {
  throw new Error("Prompt exceeds maximum length");
}

// Step 3: normalize weights to percentages
const normalized = normalizeWeights(weightConfig);

// Step 4: validate normalized weights sum to 100
if (!validateWeights(normalized)) {
  throw new Error("Genre weights must sum to 100%");
}

// Step 5: build the prompt
const genrePrompt = buildGenrePrompt(normalized);
```
