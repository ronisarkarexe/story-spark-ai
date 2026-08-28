# storySceneNavigator Utility

The `storySceneNavigator` utilities in `frontend/src/utils/storySceneNavigator.ts`
help split a story into scenes and rename them.

## Usage

```ts
import { detectScenes, renameScene } from "../utils/storySceneNavigator";

const scenes = detectScenes(storyText);
const renamed = renameScene(scenes, 2, "The Climax");
```

## API

- `detectScenes(story: string)` — splits the story on double newlines and
  returns `StoryScene[]` with sequential ids and default titles
  (`Scene 1`, `Scene 2`, ...).
- `renameScene(scenes, id, title)` — returns a new array with the matching
  scene retitled; the input array is not mutated.

## Types

```ts
interface StoryScene {
  id: number;
  title: string;
  content: string;
}
```

## Example

```ts
detectScenes("One.\\n\\nTwo.");
// [{ id: 1, title: "Scene 1", content: "One." }, { id: 2, title: "Scene 2", content: "Two." }]
```

## Tests

Covered by `frontend/src/utils/__tests__/storySceneNavigator.test.ts`.
