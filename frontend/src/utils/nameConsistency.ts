export interface NameIssue {
  original: string;
  suggestion: string;
}

const knownNames: Record<string, string> = {
  Jon: "John",
  Kathrine: "Katherine",
  Sara: "Sarah",
  Micheal: "Michael",
};

export function checkNameConsistency(text: string): NameIssue[] {
  const words = text.split(/\s+/);
  const issues: NameIssue[] = [];

  words.forEach((word) => {
    const clean = word.replace(/[.,!?]/g, "");

    if (knownNames[clean]) {
      issues.push({
        original: clean,
        suggestion: knownNames[clean],
      });
    }
  });

  return issues;
}