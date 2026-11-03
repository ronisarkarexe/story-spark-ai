import useEndingSatisfaction from "../../hooks/useEndingSatisfaction";

export default function EndingSatisfactionAnalyzer() {
  const {
    metrics,
    overallScore,
    rerunAnalysis,
  } = useEndingSatisfaction();

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          AI Story Ending Satisfaction Analyzer
        </h2>

        <button
          onClick={rerunAnalysis}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reanalyze
        </button>
      </div>

      <div className="space-y-5">
        {metrics.map((item) => (
          <div
            key={item.title}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{item.title}</h3>

              <span className="font-bold text-blue-600">
                {item.score}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 bg-green-500 rounded-full"
                style={{ width: `${item.score}%` }}
              />
            </div>

            <p className="mt-3 text-gray-700">
              {item.description}
            </p>

            <p className="mt-2 text-green-700">
              <strong>Suggestion:</strong> {item.suggestion}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-bold">
          Overall Ending Satisfaction
        </h3>

        <p className="text-4xl font-bold text-indigo-600 mt-2">
          {overallScore}%
        </p>
      </div>
    </div>
  );
}