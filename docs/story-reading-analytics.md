# storyReadingAnalytics Utility

The `generateStoryAnalytics` utility in
`frontend/src/utils/storyReadingAnalytics.ts` produces a dashboard-style
analytics summary for a story.

## Usage

```ts
import { generateStoryAnalytics } from "../utils/storyReadingAnalytics";

const analytics = generateStoryAnalytics(storyText);
```

## Return Value

```ts
interface StoryAnalytics {
  totalViews: number;
  averageReadingTime: number; // ceil(words / 200)
  completionRate: number;     // percent
  likes: number;
  bookmarks: number;
  shares: number;
  engagementTrend: number[];  // sampled readership over time
}
```

## Behavior

- `averageReadingTime` is derived from the word count using 200 words per
  minute.
- The engagement trend is a fixed sample series included for chart rendering.
- Empty input returns an all-zero analytics record.

## Example

```ts
generateStoryAnalytics("word ".repeat(400));
// { totalViews: 0, averageReadingTime: 2, completionRate: 0, ... }
```

## Tests

Covered by `frontend/src/utils/__tests__/storyReadingAnalytics.test.ts`.
