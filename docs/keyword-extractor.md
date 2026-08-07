# storyKeywordExtractor Utility

The `extractKeywords` and `removeKeyword` utilities in
`frontend/src/utils/storyKeywordExtractor.ts` extract significant keywords and
group them into thematic buckets.

## Usage

```ts
import { extractKeywords, removeKeyword } from "../utils/storyKeywordExtractor";

const result = extractKeywords(storyText);
const keywords = removeKeyword(result.keywords, "dragon");
```

## Return Value

```ts
interface StoryKeywordResult {
  keywords: string[];   // up to 12 unique words
  themes: string[];     // first 4
  locations: string[];  // next 3
  characters: string[]; // next 3
  concepts: string[];   // next 4
}
```

## Behavior

- Punctuation is stripped and words are split on whitespace.
- Words of length 3 or fewer and stop words (`the`, `a`, `an`, `and`, `or`,
  `to`, `of`, `in`, `on`, `with`, `for`, `is`, `was`, `were`, `it`, `that`,
  `this`, `at`, `by`) are excluded.
- The remaining words are deduplicated and sliced into buckets.
- `removeKeyword` filters a keyword list without mutating the input.

## Example

```ts
extractKeywords("dragon castle sword magic");
// { keywords: ["dragon", "castle", "sword", "magic"], themes: ["dragon", ...], ... }
```

## Tests

Covered by `frontend/src/utils/__tests__/storyKeywordExtractor.test.ts`.
