import { useMemo } from "react";
import { generateTitleSuggestions } from "../../utils/titleKeywordOptimizer";

interface Props {
  title: string;
  genre: string;
  onSelect: (title: string) => void;
}

export default function TitleKeywordOptimizer({
  title,
  genre,
  onSelect,
}: Props) {
  const suggestions = useMemo(
    () => generateTitleSuggestions(title, genre),
    [title, genre]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="mb-5 text-xl font-bold text-white">
        AI Story Title Keyword Optimizer
      </h2>

      <div className="space-y-4">
        {suggestions.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-zinc-700 p-4"
          >
            <h3 className="font-semibold text-blue-400">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              {item.reason}
            </p>

            <button
              onClick={() => onSelect(item.title)}
              className="mt-3 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Apply Title
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}