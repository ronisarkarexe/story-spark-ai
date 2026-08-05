import { useState } from "react";
import useCharacterChecker from "../../hooks/useCharacterChecker";

export default function CharacterNameChecker() {

  const [story, setStory] = useState("");

  const {
    issues,
    analyzeStory,
    replaceName,
  } = useCharacterChecker();

  return (
    <div className="p-5 rounded-lg shadow bg-white">

      <h2 className="text-2xl font-bold mb-4">
        Character Name Consistency Checker
      </h2>

      <textarea
        rows={8}
        value={story}
        onChange={(e) => setStory(e.target.value)}
        className="w-full border rounded p-3"
        placeholder="Paste your story here..."
      />

      <button
        onClick={() => analyzeStory(story)}
        className="mt-3 bg-blue-600 text-white px-5 py-2 rounded"
      >
        Analyze Names
      </button>

      <div className="mt-5">

        {issues.length === 0 ? (
          <p>No inconsistencies found.</p>
        ) : (
          issues.map((item: any, index) => (
            <div
              key={index}
              className="border rounded p-3 mb-3"
            >
              <p>
                <strong>{item.original}</strong> should be{" "}
                <strong>{item.suggestion}</strong>
              </p>

              <button
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                onClick={() =>
                  setStory(
                    replaceName(
                      story,
                      item.original,
                      item.suggestion
                    )
                  )
                }
              >
                Replace
              </button>
            </div>
          ))
        )}

      </div>

    </div>
  );
}