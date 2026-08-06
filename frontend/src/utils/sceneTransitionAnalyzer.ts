export interface TransitionIssue {
  type: 'abrupt' | 'weak' | 'time_jump';
  severity: 'low' | 'medium' | 'high';
  beforeScene: number;
  afterScene: number;
  explanation: string;
  suggestion: string;
}

export interface TransitionAnalysis {
  sceneCount: number;
  issues: TransitionIssue[];
  score: number;
}

const ABRUPT_CONNECTORS = ['then', 'suddenly', 'immediately', 'next moment', 'without warning'];
const WEAK_CONNECTORS = ['and then', 'after that', 'later', 'eventually', 'some time passed'];
const TIME_JUMP_MARKERS = ['years later', 'months later', 'weeks later', 'days later', 'hours later'];

function hasConnector(text: string, connectors: string[]): boolean {
  const lower = text.toLowerCase();
  return connectors.some(conn => lower.includes(conn));
}

function scoreTransition(
  beforeText: string,
  afterText: string,
  beforeScene: number,
  afterScene: number
): TransitionIssue | null {
  const lowerBefore = beforeText.toLowerCase();
  const lowerAfter = afterText.toLowerCase();

  // Check for abrupt transitions
  if (hasConnector(lowerAfter, ABRUPT_CONNECTORS)) {
    return {
      type: 'abrupt',
      severity: 'high',
      beforeScene,
      afterScene,
      explanation: 'An abrupt transition was detected without preparation.',
      suggestion: 'Add a brief connecting sentence or use a smoother connector.',
    };
  }

  // Check for time jumps without markers
  const hasTimeJump = hasConnector(lowerAfter, TIME_JUMP_MARKERS);
  const hasTimeInBefore = / yesterday| last | previous | earlier /.test(lowerBefore);
  if (!hasTimeJump && hasTimeInBefore && hasConnector(lowerAfter, WEAK_CONNECTORS)) {
    return {
      type: 'time_jump',
      severity: 'medium',
      beforeScene,
      afterScene,
      explanation: 'A time jump is implied but not clearly marked.',
      suggestion: 'Use an explicit time marker (e.g., "hours later") to prepare the reader.',
    };
  }

  // Check for weak transitions
  const beforeLength = beforeText.trim().split(/\s+/).length;
  const afterLength = afterText.trim().split(/\s+/).length;
  if (beforeLength < 10 && afterLength < 10 && !hasConnector(lowerAfter, WEAK_CONNECTORS)) {
    return null; // Short scenes without weak connectors are acceptable
  }

  if (hasConnector(lowerAfter, WEAK_CONNECTORS)) {
    return {
      type: 'weak',
      severity: 'low',
      beforeScene,
      afterScene,
      explanation: 'A weak transition connector was found.',
      suggestion: 'Consider a more specific transition or add connecting context.',
    };
  }

  return null;
}

export function analyzeSceneTransitions(story: string): TransitionAnalysis {
  if (!story || !story.trim()) {
    return { sceneCount: 0, issues: [], score: 100 };
  }

  const scenes = story
    .split(/\n\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (scenes.length <= 1) {
    return { sceneCount: scenes.length, issues: [], score: 100 };
  }

  const issues: TransitionIssue[] = [];

  for (let i = 0; i < scenes.length - 1; i++) {
    const issue = scoreTransition(scenes[i], scenes[i + 1], i + 1, i + 2);
    if (issue) {
      issues.push(issue);
    }
  }

  const maxIssues = scenes.length - 1;
  const score = maxIssues === 0 ? 100 : Math.max(0, Math.round((1 - issues.length / maxIssues) * 100));

  return { sceneCount: scenes.length, issues, score };
}
