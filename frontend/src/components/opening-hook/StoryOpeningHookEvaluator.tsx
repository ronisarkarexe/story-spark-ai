import { useMemo } from "react";
import {
  evaluateOpeningHook,
} from "../../utils/storyOpeningHookEvaluator";

interface Props {
  story: string;
  onRegenerate: () => void;
}

export default function StoryOpeningHookEvaluator({
  story,
  onRegenerate,
}: Props) {

  const report = useMemo(
    () => evaluateOpeningHook(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🎣 AI Story Opening Hook Evaluator
        </h2>

        <button
          onClick={onRegenerate}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Regenerate
        </button>

      </div>

      <div className="grid gap-4 md:grid-cols-5">

        <div className="rounded-lg border border-zinc-700 p-4">
          <p className="text-sm text-gray-400">Overall</p>
          <p className="text-3xl font-bold text-indigo-400">
            {report.overallScore}/100
          </p>
        </div>

        <div className="rounded-lg border border-zinc-700 p-4">
          <p>Engagement</p>
          <p className="text-xl font-bold">{report.engagement}</p>
        </div>

        <div className="rounded-lg border border-zinc-700 p-4">
          <p>Curiosity</p>
          <p className="text-xl font-bold">{report.curiosity}</p>
        </div>

        <div className="rounded-lg border border-zinc-700 p-4">
          <p>Clarity</p>
          <p className="text-xl font-bold">{report.clarity}</p>
        </div>

        <div className="rounded-lg border border-zinc-700 p-4">
          <p>Emotion</p>
          <p className="text-xl font-bold">{report.emotionalImpact}</p>
        </div>

      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <div className="rounded-lg border border-zinc-700 p-4">
          <h3 className="font-semibold text-white">
            Strengths
          </h3>

          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-300">
            {report.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-zinc-700 p-4">
          <h3 className="font-semibold text-white">
            Weaknesses
          </h3>

          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-300">
            {report.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

      </div>

      <div className="mt-6 rounded-lg border border-zinc-700 p-5">

        <h3 className="font-semibold text-white">
          Suggested Opening
        </h3>

        <p className="mt-3 text-gray-300 italic">
          {report.suggestedOpening}
        </p>

      </div>

    </div>
  );
}