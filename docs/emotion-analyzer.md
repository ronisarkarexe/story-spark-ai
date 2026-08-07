# analyzeEmotionJourney Utility

The `analyzeEmotionJourney` utility in `frontend/src/utils/emotionAnalyzer.ts`
tracks the emotional intensity of a story scene by scene.

## Usage

```ts
import { analyzeEmotionJourney } from "../utils/emotionAnalyzer";

const points = analyzeEmotionJourney(storyText);
```

## Return Value

An array of `EmotionPoint` objects, one per scene:

```ts
interface EmotionPoint {
  scene: number;   // 1-based scene index
  joy: number;     // count of joy keywords
  fear: number;    // count of fear keywords
  sadness: number; // count of sadness keywords
  anger: number;   // count of anger keywords
  hope: number;    // count of hope keywords
  suspense: number;// count of suspense keywords
}
```

## Behavior

- Scenes are split on double newlines (`\n\s*\n`).
- Each emotion is scored by counting keyword matches (case-insensitive) in the
  scene text:

| Emotion  | Keywords                                        |
| -------- | ----------------------------------------------- |
| joy      | happy, smile, laugh, celebrate                  |
| fear     | fear, dark, monster, terrified                  |
| sadness  | cry, sad, grief, lonely                         |
| anger    | angry, rage, fight, furious                     |
| hope     | hope, dream, believe, future                    |
| suspense | suddenly, mystery, secret, unknown              |

- An empty story returns an empty array.

## Example

```ts
analyzeEmotionJourney("She smiled.\\n\\nA monster appeared.");
// [
//   { scene: 1, joy: 1, fear: 0, ... },
//   { scene: 2, joy: 0, fear: 1, ... },
// ]
```

## Tests

Covered by `frontend/src/utils/__tests__/emotionAnalyzer.test.ts`.
