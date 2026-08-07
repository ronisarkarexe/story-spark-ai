# analyzePlotGaps Utility

The `analyzePlotGaps` utility in `frontend/src/utils/plotGapAnalyzer.ts` scans a
story for common plot issues such as abrupt transitions, unresolved mysteries,
and unexplained location changes.

## Usage

```ts
import { analyzePlotGaps } from "../utils/plotGapAnalyzer";

const gaps = analyzePlotGaps(storyText);
```

## Return Value

```ts
interface PlotGap {
  id: number;
  type: "Abrupt Transition" | "Unresolved Plot" | "Location Gap" | "No Issues";
  severity: "Low" | "Medium" | "High";
  description: string;
  suggestion: string;
}
```

## Behavior

- **Abrupt Transition**: flagged when the text contains `suddenly`,
  `immediately`, or `next day`.
- **Unresolved Plot**: flagged when `mystery` appears without `solved`.
- **Location Gap**: flagged when `castle` and `forest` both appear without
  `travel`.
- **No Issues**: a single low-severity fallback entry is returned when nothing
  else is flagged.

## Example

```ts
analyzePlotGaps("Suddenly the scene changed.");
// [{ type: "Abrupt Transition", severity: "Medium", ... }]
```

## Tests

Covered by `frontend/src/utils/__tests__/plotGapAnalyzer.test.ts`.
