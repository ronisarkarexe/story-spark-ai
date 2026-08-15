import useNarrativeComplexity from "../../hooks/useNarrativeComplexity";

export default function NarrativeComplexityDashboard() {
  const { metrics, average, recommendation } =
    useNarrativeComplexity();

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          AI Narrative Complexity Dashboard
        </h2>

        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">
                {metric.title}
              </h3>

              <span className="font-bold text-blue-600">
                {metric.score}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${metric.score}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 mt-3">
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-5">
        <h3 className="text-xl font-bold">
          Overall Complexity Score
        </h3>

        <p className="text-4xl font-bold text-indigo-600 my-3">
          {average}%
        </p>

        <p className="text-gray-700">
          {recommendation}
        </p>
      </div>
    </div>
  );
}