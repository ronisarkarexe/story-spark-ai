import useFoilCharacterAnalyzer from "../../hooks/useFoilCharacterAnalyzer";

export default function FoilCharacterAnalyzer() {
  const { pairs, totalCharacters } = useFoilCharacterAnalyzer();

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          AI Story Foil Character Analyzer
        </h2>

        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Refresh
        </button>
      </div>

      <p className="mb-5 text-gray-600">
        Characters analyzed: <strong>{totalCharacters}</strong>
      </p>

      <div className="space-y-4">
        {pairs.map((pair, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h3 className="font-semibold text-lg">
              {pair.protagonist} ↔ {pair.foil}
            </h3>

            <p className="mt-2">
              <strong>Contrast:</strong> {pair.contrast}
            </p>

            <p className="mt-2 text-green-700">
              <strong>Suggestion:</strong> {pair.suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}