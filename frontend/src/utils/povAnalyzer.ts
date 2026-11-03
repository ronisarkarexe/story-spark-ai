export interface POVIssue {
  sentence: string;
  detectedPOV: string;
  reason: string;
  suggestion: string;
}

const FIRST_PERSON = [
  " i ",
  " me ",
  " my ",
  " mine ",
  " myself "
];

const THIRD_PERSON = [
  " he ",
  " she ",
  " they ",
  " him ",
  " her ",
  " his ",
  " their "
];

export function analyzePOV(
  story: string,
  expectedPOV: "First Person" | "Third Person"
): POVIssue[] {

  const sentences = story.split(/[.!?]/);

  const issues: POVIssue[] = [];

  sentences.forEach(sentence => {

    const lower = ` ${sentence.toLowerCase()} `;

    const first =
      FIRST_PERSON.some(word => lower.includes(word));

    const third =
      THIRD_PERSON.some(word => lower.includes(word));

    if (
      expectedPOV === "First Person" &&
      third
    ) {
      issues.push({
        sentence: sentence.trim(),
        detectedPOV: "Third Person",
        reason:
          "Narration shifts away from the selected POV.",
        suggestion:
          "Rewrite this sentence using first-person narration."
      });
    }

    if (
      expectedPOV === "Third Person" &&
      first
    ) {
      issues.push({
        sentence: sentence.trim(),
        detectedPOV: "First Person",
        reason:
          "Unexpected switch to first-person narration.",
        suggestion:
          "Maintain third-person perspective."
      });
    }

  });

  return issues;
}