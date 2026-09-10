import { useMemo, useState } from "react";
import {
  generateEditHistory,
  restoreStoryVersion,
} from "../../utils/storyTimelineEditHistory";

interface Props {
  story: string;
  onRestore: (content: string) => void;
  onRefresh: () => void;
}

export default function StoryTimelineEditHistory({
  story,
  onRestore,
  onRefresh,
}: Props) {

  const history = useMemo(
    () => generateEditHistory(story),
    [story]
  );

  const [selectedVersion, setSelectedVersion] = useState<string>("");

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🕒 Story Timeline Edit History
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh Timeline
        </button>

      </div>

      <div className="space-y-6">

        {history.map((checkpoint) => (

          <div
            key={checkpoint.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-white">
                  {checkpoint.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {checkpoint.timestamp} • {checkpoint.version}
                </p>

              </div>

            </div>

            <p className="mt-3 text-gray-300">
              {checkpoint.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">

              <button
                onClick={() =>
                  setSelectedVersion(checkpoint.content)
                }
                className="rounded bg-zinc-700 px-4 py-2 text-white"
              >
                Preview
              </button>

              <button
                onClick={() =>
                  onRestore(
                    restoreStoryVersion(
                      history,
                      checkpoint.id
                    )
                  )
                }
                className="rounded bg-green-600 px-4 py-2 text-white"
              >
                Restore
              </button>

            </div>

          </div>

        ))}

      </div>

      {selectedVersion && (

        <div className="mt-8 rounded-lg border border-zinc-700 p-5">

          <h3 className="mb-3 text-lg font-semibold text-white">
            Preview Version
          </h3>

          <pre className="whitespace-pre-wrap text-gray-300">
            {selectedVersion}
          </pre>

        </div>

      )}

    </div>
  );
}