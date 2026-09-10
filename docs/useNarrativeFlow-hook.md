# useNarrativeFlow Hook

## Overview

The `useNarrativeFlow` hook analyzes story text for narrative flow issues using the `analyzeNarrativeFlow` utility. It detects problematic patterns such as abrupt transitions (e.g., overuse of "Suddenly") and repetitive transition wording (e.g., excessive use of "Then"). The hook re-analyzes the story whenever the content changes.

## File

`frontend/src/hooks/useNarrativeFlow.ts`

## Usage

```tsx
import { useNarrativeFlow } from "@/hooks/useNarrativeFlow";

function NarrativeFlowPanel({ story }: { story: string }) {
  const { issues, setIssues } = useNarrativeFlow(story);

  if (issues.length === 0) {
    return <p>No narrative flow issues detected.</p>;
  }

  return (
    <ul>
      {issues.map((issue) => (
        <li key={issue.id}>
          <strong>{issue.type}</strong> ({issue.severity} severity)
          <p>{issue.explanation}</p>
          <p>Suggestion: {issue.suggestion}</p>
        </li>
      ))}
    </ul>
  );
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `story` | `string` | The story text to analyze for narrative flow issues |

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `issues` | `NarrativeIssue[]` | Array of detected narrative flow issues; empty if no issues found |
| `setIssues` | `React.Dispatch<React.SetStateAction<...>>` | State setter for issues; allows programmatic updates |

## Detected Issue Types

The hook currently detects the following issue patterns:

- **Abrupt Transition**: Flagged when the story contains the word "Suddenly" (High severity). Suggests adding connecting details.
- **Repetition**: Flagged when "Then" appears more than 5 times (Medium severity). Suggests using more varied narrative transitions.

Each `NarrativeIssue` includes:

- `id: number` — Unique identifier for the issue
- `type: string` — Category of the issue (e.g., "Abrupt Transition", "Repetition")
- `severity: string` — "High" or "Medium"
- `scene: string` — The affected scene or area (e.g., "Scene Transition", "Multiple Scenes")
- `explanation: string` — Human-readable explanation of the issue
- `suggestion: string` — Actionable suggestion to fix the issue
