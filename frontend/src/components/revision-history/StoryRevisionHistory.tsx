import { useMemo, useState } from "react";
import {
  StoryRevision,
  compareRevisions,
  restoreRevision,
} from "../../utils/storyRevisionHistory";

interface Props {
  revisions: StoryRevision[];
  onRestore?: (content: string) => void;
}

export default function StoryRevisionHistory({
  revisions,
  onRestore,
}: Props) {
  const [selected, setSelected] = useState(0);

  const current = revisions[selected];
  const previous = revisions[selected - 1];

  const diff = useMemo(() => {
    if (!current || !previous)
      return {
        additions: 0,
        deletions: 0,
        modifications: 0,
      };

    return compareRevisions(
      previous.content,
      current.content
    );
  }, [current, previous]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🕒 Story Revision History
      </h2>

      <div className="space-y-3 mb-6">
        {revisions.map((revision, index) => (
          <button
            key={revision.id}
            onClick={() => setSelected(index)}
            className={`w-full rounded-lg border p-3 text-left ${
              selected === index
                ? "border-indigo-500 bg-zinc-800"
                : "border-zinc-700"
            }`}
          >
            <div className="font-semibold text-white">
              Revision {index + 1}
            </div>

            <div className="text-sm text-gray-400">
              {revision.timestamp}
            </div>
          </button>
        ))}
      </div>

      {previous && current && (
        <div className="rounded-lg border border-zinc-700 p-4 mb-6">
          <h3 className="font-semibold text-white mb-4">
            Visual Diff Summary
          </h3>

          <p className="text-green-400">
            ➕ Additions: {diff.additions}
          </p>

          <p className="text-red-400">
            ➖ Deletions: {diff.deletions}
          </p>

          <p className="text-yellow-400">
            ✏️ Modifications: {diff.modifications}
          </p>
        </div>
      )}

      {current && (
        <button
          onClick={() =>
            onRestore?.(restoreRevision(current))
          }
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Restore This Version
        </button>
      )}

    </div>
  );
}