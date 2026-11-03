export default function SuggestionCard({
  suggestion,
  onDismiss,
}) {
  return (
    <div className="border rounded-lg p-4 mb-3">
      <h4 className="font-semibold">
        {suggestion.category}
      </h4>

      <p>{suggestion.message}</p>

      <div className="text-sm text-blue-600 mt-2">
        💡 {suggestion.recommendation}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Apply
        </button>

        <button
          onClick={() => onDismiss(suggestion.id)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}