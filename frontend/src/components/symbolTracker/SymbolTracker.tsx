import useSymbolTracker from "../../hooks/useSymbolTracker";

interface Props {
  story: string;
}

export default function SymbolTracker({ story }: Props) {
  const symbols = useSymbolTracker(story);

  return (
    <div className="rounded-lg border p-5 shadow bg-white">
      <h2 className="text-xl font-bold mb-5">
        Story Symbol Tracker
      </h2>

      {symbols.length === 0 ? (
        <p>No recurring symbols found.</p>
      ) : (
        symbols.map((item) => (
          <div
            key={item.symbol}
            className="border rounded-lg p-4 mb-4"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold capitalize">
                {item.symbol}
              </h3>

              <span
                className={
                  item.status === "Resolved"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {item.status}
              </span>
            </div>

            <p className="mt-2">
              Occurrences: {item.occurrences}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              {item.status === "Resolved"
                ? "Recurring throughout the story."
                : "Appears only once. Consider resolving or reinforcing this symbol."}
            </p>
          </div>
        ))
      )}
    </div>
  );
}