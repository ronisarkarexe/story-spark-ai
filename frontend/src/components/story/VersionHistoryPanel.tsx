import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { restoreVersion, deleteVersion } from "../../redux/slices/storySlice";
import { StoryVersion } from "../../types/story.types";

const VersionHistoryPanel: React.FC = () => {
  const dispatch = useDispatch();
  const versions = useSelector((state: RootState) => state.story.versions || []) as StoryVersion[];
  const currentStory = useSelector((state: RootState) => state.story.currentStory);

  if (!versions.length) {
    return (
      <div className="w-72 bg-zinc-900 h-screen border-r border-zinc-800 p-5 overflow-y-auto">
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

  const handleRestoreVersion = (versionId: string) => {
    if (window.confirm("Are you sure you want to restore this version? This will replace your current story.")) {
      dispatch(restoreVersion(versionId));
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    if (window.confirm("Are you sure you want to delete this version? This action cannot be undone.")) {
      dispatch(deleteVersion(versionId));
    }
  };

  return (
    <div className="w-72 bg-zinc-900 h-screen border-r border-zinc-800 p-5 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-2">
        Version History
      </h2>

      <p className="text-zinc-500 text-sm mb-6">
        {versions.length} saved version
        {versions.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-3">
        {reversedVersions.map((version, index) => {
          const isCurrent = currentStory?.chapters.length === version.chapterCount;

          return (
            <div
              key={version.id}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-blue-900/30 border-blue-500"
                  : "bg-zinc-800 border-zinc-700 hover:bg-zinc-800/80"
              }`}
            >
              <p className="text-white font-semibold">
                Version #{reversedVersions.length - index}
              </p>

              <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
                {version.title}
              </p>

              <p className="text-zinc-500 text-xs mt-2">
                {version.chapterCount} Chapter
                {version.chapterCount !== 1 ? "s" : ""}
              </p>

              <p className="text-zinc-500 text-xs mt-1">
                {new Date(version.timestamp).toLocaleString()}
              </p>

              {isCurrent && (
                <div className="mt-2 inline-block px-2 py-1 rounded-md bg-blue-600 text-white text-xs font-medium">
                  Current Version
                </div>
              )}

              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={() => handleRestoreVersion(version.id)}
                  disabled={isCurrent}
                  className={`w-full text-sm py-2 rounded-lg transition ${
                    isCurrent
                      ? "bg-gray-600 cursor-not-allowed opacity-50"
                      : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  }`}
                >
                  Restore Version
                </button>

                <button
                  onClick={() => handleDeleteVersion(version.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition cursor-pointer"
                >
                  Delete Version
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionHistoryPanel;