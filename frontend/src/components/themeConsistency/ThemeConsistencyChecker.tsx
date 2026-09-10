import useThemeConsistency from "../../hooks/useThemeConsistency";

export default function ThemeConsistencyChecker() {
  const { themes, average, rerunAnalysis } =
    useThemeConsistency();

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          AI Story Theme Consistency Checker
        </h2>

        <button
          onClick={rerunAnalysis}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Reanalyze
        </button>
      </div>

      <div className="space-y-5">
        {themes.map((theme) => (
          <div
            key={theme.theme}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">
                {theme.theme}
              </h3>

              <span className="font-bold text-indigo-600">
                {theme.consistency}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 bg-green-500 rounded-full"
                style={{
                  width: `${theme.consistency}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm">
              <strong>Weak Chapter:</strong>{" "}
              {theme.weakChapter}
            </p>

            <p className="text-green-700 mt-2">
              <strong>Suggestion:</strong>{" "}
              {theme.suggestion}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-5">
        <h3 className="text-xl font-bold">
          Overall Theme Consistency
        </h3>

        <p className="text-4xl font-bold text-blue-600 mt-2">
          {average}%
        </p>
      </div>
    </div>
  );
}