import React from "react";
import { ReaderFeedback } from "../../types/readerFeedback";

export default function ReaderFeedbackSimulator({
  feedback,
}: {
  feedback: ReaderFeedback | null;
}) {
  if (!feedback) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">
        Reader Feedback
      </h2>

      <p>
        Overall Score: {feedback.overall}%
      </p>

      <h3 className="mt-4 font-semibold">
        Strengths
      </h3>

      <ul>
        {feedback.strengths.map((s: string) => (
          <li key={s}>✓ {s}</li>
        ))}
      </ul>

      <h3 className="mt-4 font-semibold">
        Suggestions
      </h3>

      <ul>
        {feedback.improvements.map((s: string) => (
          <li key={s}>• {s}</li>
        ))}
      </ul>

      <p className="mt-4">
        {feedback.summary}
      </p>
    </div>
  );
}