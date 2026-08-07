# analyzeSceneTransitions Utility

The `analyzeSceneTransitions` utility in `frontend/src/utils/sceneTransition.ts`
classifies the flow between scenes in a story.

## Usage

```ts
import { analyzeSceneTransitions } from "../utils/sceneTransition";

const transitions = analyzeSceneTransitions(storyText);
```

## Return Value

```ts
interface SceneTransition {
  scene: number;                 // 1-based scene index
  status: "Good" | "Abrupt";
  suggestion: string;
}
```

## Behavior

- Scenes are split on double newlines (`\n\s*\n`).
- A scene is marked `Abrupt` when it contains `Suddenly`, `Immediately`, or is
  shorter than 120 characters.
- Otherwise the scene is marked `Good`.
- Empty input returns an empty array.

## Example

```ts
analyzeSceneTransitions("A calm scene.\\n\\nSuddenly the door burst open.");
// [{ scene: 1, status: "Good", ... }, { scene: 2, status: "Abrupt", ... }]
```

## Tests

Covered by `frontend/src/utils/__tests__/sceneTransition.test.ts`.
