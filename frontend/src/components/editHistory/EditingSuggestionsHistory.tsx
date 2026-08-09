import useEditingHistory from "../../hooks/useEditingHistory";

export default function EditingSuggestionsHistory() {
  const history = useEditingHistory();

  return (
    <div className="rounded-lg border p-5 shadow bg-white">

      <h2 className="text-xl font-bold mb-4">
        AI Editing Suggestions History
      </h2>

      {history.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 mb-3"
        >
          <div className="flex justify-between items-center">

            <span className="font-semibold">
              Suggestion #{item.id}
            </span>

            <span
              className={`px-2 py-1 rounded text-sm ${
                item.status === "Accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.status}
            </span>

          </div>

          <p className="mt-2">
            {item.suggestion}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            {item.timestamp}
          </p>

          <button className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Restore Suggestion
          </button>

        </div>
      ))}

    </div>
  );
}