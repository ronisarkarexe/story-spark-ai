# narrativeComplexity Utility

## Overview

The `narrativeComplexity` utility (`frontend/src/utils/narrativeComplexity.ts`) provides functions for analyzing the structural complexity of a story. It returns a set of complexity metrics across different dimensions (subplots, character interactions, timeline depth, world building, and vocabulary diversity) along with a narrative recommendation based on the average complexity score.

## Files

- `frontend/src/utils/narrativeComplexity.ts` — Core utility functions
- `frontend/src/hooks/useNarrativeComplexity.ts` — React hook wrapper

## Interfaces

```typescript
export interface ComplexityMetric {
  title: string;       // e.g. "Subplots", "Character Interactions"
  score: number;      // 0-100 quality score
  description: string; // Human-readable description of the metric
}
```

## Functions

### `getComplexityMetrics(): ComplexityMetric[]`

Returns an array of complexity metrics for the current story context. Each metric provides a score and description across five dimensions:

| Metric | Description |
|--------|-------------|
| Subplots | Balance of supporting storylines |
| Character Interactions | Frequency and depth of character interactions |
| Timeline Depth | Complexity of the story's temporal structure |
| World Building | Richness of environmental and setting details |
| Vocabulary Diversity | Variety and engagement level of vocabulary |

**Returns:** `ComplexityMetric[]` — Array of 5 metric objects.

### `getRecommendation(avg: number): string`

Returns a narrative recommendation string based on the average complexity score.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `avg` | `number` | Average complexity score (0-100) |

**Returns:** `string` — Recommendation message based on thresholds:

- `avg >= 80`: "Story complexity is excellent. Maintain consistency."
- `avg >= 60`: "Balanced complexity. Add depth only where needed."
- `avg < 60`: "Consider enriching plot and character development."

## Usage

### Direct Utility Usage

```typescript
import { getComplexityMetrics, getRecommendation } from "@/utils/narrativeComplexity";

const metrics = getComplexityMetrics();
const average = Math.round(
  metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length
);
const recommendation = getRecommendation(average);

console.log(`Average complexity: ${average}`);
console.log(recommendation);
```

### React Hook Usage

```tsx
import useNarrativeComplexity from "@/hooks/useNarrativeComplexity";

function ComplexityPanel() {
  const { metrics, average, recommendation } = useNarrativeComplexity();

  return (
    <div>
      <h3>Complexity Analysis (Score: {average})</h3>
      <ul>
        {metrics.map((metric) => (
          <li key={metric.title}>
            <strong>{metric.title}</strong>: {metric.score}
            <p>{metric.description}</p>
          </li>
        ))}
      </ul>
      <p>{recommendation}</p>
    </div>
  );
}
```

## Integration

The `useNarrativeComplexity` hook wraps both `getComplexityMetrics` and `getRecommendation` in a `useMemo` hook, recomputing only when the story context changes. This avoids redundant calculations during renders.
