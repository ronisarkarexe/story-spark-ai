import { useMemo, useState } from "react";
import { compareStories } from "../../utils/storyComparisonMetrics";

interface Props {
  storyA: string;
  storyB: string;
}

export default function StoryComparisonDashboard({
  storyA,
  storyB,
}: Props) {
  const comparison = useMemo(
    () => compareStories(storyA, storyB),
    [storyA, storyB]
  );

  const [active, setActive] = useState<"A" | "B">("A");

  const current =
    active === "A"
      ? comparison.first
      : comparison.second;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        📊 Story Comparison Dashboard
      </h2>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActive("A")}
          className="px-4 py-2 rounded bg-indigo-600 text-white"
        >
          Story A
        </button>

        <button
          onClick={() => setActive("B")}
          className="px-4 py-2 rounded bg-zinc-700 text-white"
        >
          Story B
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div>📝 Word Count: {current.wordCount}</div>

        <div>⏱ Reading Time: {current.readingTime} min</div>

        <div>📚 Vocabulary Richness: {current.vocabularyRichness}%</div>

        <div>💬 Dialogue: {current.dialoguePercentage}%</div>

        <div>⚡ Pacing: {current.pacing}/100</div>

        <div>😊 Sentiment: {current.sentiment}</div>

      </div>
    </div>
  );
}