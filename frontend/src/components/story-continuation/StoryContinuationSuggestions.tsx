import { useMemo } from "react";
import {
  generateContinuationSuggestions,
} from "../../utils/storyContinuationSuggestions";

interface Props {
  story: string;
  onInsert: (text: string) => void;
}

export default function StoryContinuationSuggestions({
  story,
  onInsert,
}: Props) {
  const suggestions = useMemo(
    () => generateContinuationSuggestions(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          ✨ AI Story Continuation Suggestions
        </h2>

        <button
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Regenerate
        </button>
      </div>

      <div className="space-y-5">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-zinc-700 p-5"
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              {item.title}
            </h3>

            <p className="text-gray-300 mb-4">
              {item.content}
            </p>

            <button
              onClick={() => onInsert(item.content)}
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Insert into Story
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}