import { useEffect, useState } from "react";
import {
  extractKeywords,
  removeKeyword,
} from "../../utils/storyKeywordExtractor";

interface Props {
  story: string;
}

export default function StoryKeywordExtractor({
  story,
}: Props) {
  const [result, setResult] = useState(
    extractKeywords(story)
  );

  useEffect(() => {
    setResult(extractKeywords(story));
  }, [story]);

  const deleteKeyword = (keyword: string) => {
    setResult({
      ...result,
      keywords: removeKeyword(
        result.keywords,
        keyword
      ),
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🔑 AI Story Keyword Extractor
      </h2>

      <div className="flex flex-wrap gap-3 mb-6">
        {result.keywords.map((keyword) => (
          <button
            key={keyword}
            onClick={() => deleteKeyword(keyword)}
            className="rounded-full bg-indigo-600 px-4 py-2 text-white"
          >
            {keyword} ✕
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <h3 className="font-semibold text-white">
            Themes
          </h3>
          <ul className="text-gray-300 mt-2">
            {result.themes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Characters
          </h3>
          <ul className="text-gray-300 mt-2">
            {result.characters.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Locations
          </h3>
          <ul className="text-gray-300 mt-2">
            {result.locations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Concepts
          </h3>
          <ul className="text-gray-300 mt-2">
            {result.concepts.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}