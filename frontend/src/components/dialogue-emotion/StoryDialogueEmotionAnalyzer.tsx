import { useMemo } from "react";
import {
  analyzeDialogueEmotion,
} from "../../utils/storyDialogueEmotionAnalyzer";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StoryDialogueEmotionAnalyzer({
  story,
  onRefresh,
}: Props) {

  const report = useMemo(
    () => analyzeDialogueEmotion(story),
    [story]
  );

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "Happy":
        return "bg-green-500";
      case "Sad":
        return "bg-blue-500";
      case "Angry":
        return "bg-red-500";
      case "Fear":
        return "bg-yellow-500";
      case "Confident":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          😊 AI Story Dialogue Emotion Analyzer
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Reanalyze
        </button>

      </div>

      <div className="mb-8">

        <h3 className="mb-4 text-lg font-semibold text-white">
          Character Emotion Summary
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          {report.summaries.map((summary) => (

            <div
              key={summary.character}
              className="rounded-lg border border-zinc-700 p-4"
            >
              <h4 className="font-semibold text-white">
                {summary.character}
              </h4>

              <p className="text-gray-300">
                Dominant Emotion: {summary.dominantEmotion}
              </p>

              <p className="text-gray-300">
                Dialogues: {summary.dialogueCount}
              </p>

            </div>

          ))}

        </div>

      </div>

      <div className="space-y-5">

        {report.dialogues.map((item) => (

          <div
            key={item.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold text-white">
                {item.character}
              </h3>

              <span
                className={`rounded px-3 py-1 text-white ${getEmotionColor(item.emotion)}`}
              >
                {item.emotion}
              </span>

            </div>

            <p className="mt-3 italic text-gray-300">
              "{item.dialogue}"
            </p>

            <p className="mt-3 text-sm text-gray-400">
              Confidence: {item.confidence}%
            </p>

            <p className="mt-2 text-indigo-400">
              {item.suggestion}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}