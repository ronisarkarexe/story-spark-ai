import { useMemo, useState } from "react";
import { detectCliches } from "../../utils/clicheDetector";

interface Props {
  story: string;
}

export default function ClicheDetectorPanel({
  story,
}: Props) {

  const [ignored, setIgnored] = useState<string[]>([]);

  const results = useMemo(
    () =>
      detectCliches(story).filter(
        item => !ignored.includes(item.phrase)
      ),
    [story, ignored]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

      <h2 className="mb-5 text-xl font-bold">
        AI Story Cliché Detector
      </h2>

      {results.length === 0 ? (
        <p className="text-green-400">
          No common clichés detected.
        </p>
      ) : (
        <div className="space-y-4">
          {results.map(item => (
            <div
              key={item.phrase}
              className="rounded-lg border border-zinc-700 p-4"
            >
              <h3 className="font-semibold text-red-400">
                "{item.phrase}"
              </h3>

              <p className="mt-2 text-gray-300">
                {item.reason}
              </p>

              <div className="mt-3 rounded bg-zinc-800 p-3">
                <strong>Suggestion:</strong>

                <p>{item.suggestion}</p>
              </div>

              <div className="mt-4 flex gap-3">

                <button
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Apply
                </button>

                <button
                  onClick={() =>
                    setIgnored([
                      ...ignored,
                      item.phrase,
                    ])
                  }
                  className="rounded bg-gray-700 px-4 py-2 text-white"
                >
                  Ignore
                </button>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}