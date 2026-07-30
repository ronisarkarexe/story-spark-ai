import { useMemo } from "react";
import {
  analyzeDialogueBalance,
} from "../../utils/dialogueBalanceAnalyzer";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function DialogueBalanceAnalyzer({
  story,
  onRefresh,
}: Props) {

  const report = useMemo(
    () => analyzeDialogueBalance(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          💬 AI Dialogue Balance Analyzer
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh
        </button>

      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">

        <div className="rounded-lg border border-zinc-700 p-5">
          <h3 className="text-lg font-semibold text-white">
            Dialogue
          </h3>

          <p className="mt-3 text-3xl font-bold text-indigo-400">
            {report.dialoguePercentage}%
          </p>

          <p className="mt-2 text-gray-400">
            {report.dialogueLines} dialogue lines
          </p>
        </div>

        <div className="rounded-lg border border-zinc-700 p-5">
          <h3 className="text-lg font-semibold text-white">
            Narration
          </h3>

          <p className="mt-3 text-3xl font-bold text-green-400">
            {report.narrationPercentage}%
          </p>

          <p className="mt-2 text-gray-400">
            {report.narrationLines} narration lines
          </p>
        </div>

      </div>

      <div className="mb-6">

        <h3 className="mb-3 text-lg font-semibold text-white">
          Visual Balance
        </h3>

        <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-700">

          <div
            className="h-full bg-indigo-500"
            style={{
              width: `${report.dialoguePercentage}%`,
            }}
          />

        </div>

      </div>

      <div className="rounded-lg border border-zinc-700 p-4">

        <h3 className="font-semibold text-white">
          AI Suggestion
        </h3>

        <p className="mt-2 text-gray-300">
          {report.suggestion}
        </p>

      </div>

    </div>
  );
}