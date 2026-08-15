import { useState } from "react";
import useChapterTitleGenerator from "../../hooks/useChapterTitleGenerator";

export default function ChapterTitleGenerator() {
  const { chapters, regenerateTitles } =
    useChapterTitleGenerator();

  const [selectedTitles, setSelectedTitles] = useState<
    Record<string, string>
  >({});

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          AI Story Chapter Title Generator
        </h2>

        <button
          onClick={regenerateTitles}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Regenerate
        </button>
      </div>

      {chapters.map((chapter) => (
        <div
          key={chapter.chapter}
          className="border rounded-lg p-4 mb-5"
        >
          <h3 className="font-semibold text-lg mb-3">
            {chapter.chapter}
          </h3>

          <div className="space-y-2">
            {chapter.suggestions.map((title) => (
              <button
                key={title}
                onClick={() =>
                  setSelectedTitles({
                    ...selectedTitles,
                    [chapter.chapter]: title,
                  })
                }
                className="block w-full text-left border rounded px-3 py-2 hover:bg-gray-100"
              >
                {title}
              </button>
            ))}
          </div>

          {selectedTitles[chapter.chapter] && (
            <div className="mt-4 text-green-700 font-medium">
              Selected Title: {selectedTitles[chapter.chapter]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}