import type { RepetitionIssue } from "../../types/repetition";

interface RepetitionCardProps {
  issue: RepetitionIssue;
}

export default function RepetitionCard({ issue }: RepetitionCardProps) {
  return (
    <article className="mb-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{issue.type}</h3>
        <span>{issue.severity}</span>
      </div>
      <p className="mt-2">“{issue.repeatedText}” ({issue.occurrences} times)</p>
      <p className="mt-2 text-sm">{issue.suggestion}</p>
    </article>
  );
}
