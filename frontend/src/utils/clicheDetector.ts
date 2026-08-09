export interface ClicheResult {
  phrase: string;
  reason: string;
  suggestion: string;
}

const CLICHES = [
  {
    phrase: "once upon a time",
    reason: "Very common story opening.",
    suggestion: "Open with an action or unique scene."
  },
  {
    phrase: "happily ever after",
    reason: "Frequently used ending.",
    suggestion: "Create a more memorable conclusion."
  },
  {
    phrase: "chosen one",
    reason: "Overused fantasy trope.",
    suggestion: "Give the protagonist a unique motivation."
  },
  {
    phrase: "it was all a dream",
    reason: "Predictable plot twist.",
    suggestion: "Use a twist that changes the reader's understanding."
  }
];

export function detectCliches(text: string): ClicheResult[] {
  const lower = text.toLowerCase();

  return CLICHES.filter(item =>
    lower.includes(item.phrase)
  );
}