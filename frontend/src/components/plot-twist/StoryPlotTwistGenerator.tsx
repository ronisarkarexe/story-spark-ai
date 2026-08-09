import { useMemo, useState } from "react";
import {
  generatePlotTwists,
  regeneratePlotTwists,
} from "../../utils/storyPlotTwist";

interface Props {
  story: string;
  onApply?: (twist: string) => void;
}

export default function StoryPlotTwistGenerator({
  story,
  onApply,
}: Props) {
  const [twists, setTwists] = useState(() =>
    generatePlotTwists(story)
  );

  const [selected, setSelected] = useState<number | null>(null);

  useMemo(() => {
    setTwists(generatePlotTwists(story));
  }, [story]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🎭 AI Plot Twist Generator
      </h2>

      <button
        onClick={() =>
          setTwists(regeneratePlotTwists(story))
        }
        className="mb-6 rounded bg-indigo-600 px-4 py-2 text-white"
      >
        Regenerate Twists
      </button>

      <div className="space-y-4">
        {twists.map((twist) => (
          <div
            key={twist.id}
            className={`rounded-lg border p-4 ${
              selected === twist.id
                ? "border-indigo-500"
                : "border-zinc-700"
            }`}
          >
            <h3 className="font-semibold text-white">
              {twist.title}
            </h3>

            <p className="mt-2 text-gray-300">
              {twist.description}
            </p>

            <div className="mt-4 flex gap-3">

              <button
                onClick={() => setSelected(twist.id)}
                className="rounded bg-zinc-700 px-3 py-2 text-white"
              >
                Preview
              </button>

              <button
                onClick={() =>
                  onApply?.(twist.description)
                }
                className="rounded bg-green-600 px-3 py-2 text-white"
              >
                Apply
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}