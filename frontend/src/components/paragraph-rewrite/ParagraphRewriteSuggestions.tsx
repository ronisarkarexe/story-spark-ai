import { useMemo, useState } from "react";
import {
  generateRewriteSuggestions,
} from "../../utils/paragraphRewriteSuggestions";

interface Props {
  story: string;
  onReplace: (replacement: string) => void;
}

export default function ParagraphRewriteSuggestions({
  story,
  onReplace,
}: Props) {

  const paragraphs = story
    .split("\n\n")
    .filter(Boolean);

  const [selected, setSelected] = useState(0);

  const suggestions = useMemo(
    () =>
      generateRewriteSuggestions(
        paragraphs[selected] || "",
        story
      ),
    [selected, story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-white">
          ✍️ AI Paragraph Rewrite Suggestions
        </h2>

        <button
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Regenerate
        </button>

      </div>

      <label className="block text-white mb-4">
        Select Paragraph

        <select
          className="mt-2 w-full rounded bg-zinc-800 p-2"
          value={selected}
          onChange={(e) =>
            setSelected(Number(e.target.value))
          }
        >
          {paragraphs.map((_, index) => (
            <option
              key={index}
              value={index}
            >
              Paragraph {index + 1}
            </option>
          ))}
        </select>

      </label>

      <div className="space-y-5">

        {suggestions.map((item) => (

          <div
            key={item.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <h3 className="font-semibold text-white mb-3">
              {item.title}
            </h3>

            <p className="text-gray-300 mb-4">
              {item.content}
            </p>

            <button
              onClick={() =>
                onReplace(item.content)
              }
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Replace Paragraph
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}