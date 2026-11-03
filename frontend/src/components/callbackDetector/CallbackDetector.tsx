import useCallbackDetector from "../../hooks/useCallbackDetector";

export default function CallbackDetector() {
  const { callbacks, rerunAnalysis } = useCallbackDetector();

  return (
    <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          AI Story Callback Detector
        </h2>

        <button
          onClick={rerunAnalysis}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reanalyze
        </button>
      </div>

      <div className="space-y-4">
        {callbacks.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4"
          >
            <h3 className="font-semibold text-lg">
              {item.element}
            </h3>

            <p>
              <strong>First Appearance:</strong>{" "}
              {item.firstAppearance}
            </p>

            <p>
              <strong>Callback:</strong> {item.callback}
            </p>

            <p className="mt-2 text-green-700">
              <strong>Suggestion:</strong>{" "}
              {item.suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}