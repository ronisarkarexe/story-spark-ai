import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import {
  restoreVersion,
  deleteVersion,
} from "../../redux/slices/storySlice";

const VersionHistoryPanel = () => {
  const dispatch = useDispatch();

  const versions = useSelector(
    (state: RootState) => state.story.versions
  );

  const currentStory = useSelector(
    (state: RootState) => state.story.currentStory
  );

  const currentVersionId = useSelector(
    (state: RootState) => state.story.currentVersionId
  );

  if (!versions.length) {
    return (
      <div className="w-72 bg-zinc-900 h-full border-r border-zinc-800 p-5">
        <h2 className="text-2xl font-bold text-white mb-6">
          Version History
        </h2>

        <p className="text-zinc-400 text-sm">
          No saved versions yet.
        </p>

        <p className="text-zinc-500 text-xs mt-2">
          Versions are automatically created whenever a new chapter is generated.
        </p>
      </div>
    );
  }

  const reversedVersions = [...versions].reverse();
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  return (
    <div className="w-72 bg-zinc-900 h-full border-r border-zinc-800 p-5 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-2">
        Version History
      </h2>

      <p className="text-zinc-500 text-sm mb-6">
        {versions.length} saved version
        {versions.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-3">
        {reversedVersions.map((version, index) => {
          // Compare by ID — chapter count is not unique across versions
          const isCurrent = currentVersionId === version.id;

          return (
            <div
              key={version.id}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-blue-900/30 border-blue-500"
                  : "bg-zinc-800 border-zinc-700"
              }`}
            >
              <p className="text-white font-semibold">
                Version #{reversedVersions.length - index}
              </p>

              <p className="text-zinc-400 text-sm mt-1">
                {version.title}
              </p>

              <p className="text-zinc-500 text-xs mt-2">
                {version.chapterCount} Chapter
                {version.chapterCount !== 1 ? "s" : ""}
              </p>

              <p className="text-zinc-500 text-xs mt-1">
                {new Date(
                  version.timestamp
                ).toLocaleString()}
              </p>

              {isCurrent && (
                <div className="mt-2 inline-block px-2 py-1 rounded bg-blue-600 text-white text-xs">
                  Current Version
                </div>
              )}

              <div className="flex flex-col gap-2 mt-3">
                {/* Hide restore on the current version — would discard unsaved edits */}
                {!isCurrent && (
                  <button
                    onClick={() =>
                      dispatch(
                        restoreVersion(version.id)
                      )
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
                  >
                    Restore Version
                  </button>
                )}

                {pendingDeleteId === version.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        dispatch(deleteVersion(version.id));
                        setPendingDeleteId(null);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 rounded-lg transition"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setPendingDeleteId(null)}
                      className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setPendingDeleteId(version.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition"
                  >
                    Delete Version
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionHistoryPanel;