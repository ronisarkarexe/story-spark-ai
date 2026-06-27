import { useEffect, useState } from "react";

interface StoryVersion {
  id: string;
  content: string;
  timestamp: string;
}

interface StoryVersionHistoryProps {
  story: {
    uuid: string;
    content: string;
  };
  onRestore: (content: string) => void;
}

const StoryVersionHistory = ({
  story,
  onRestore,
}: StoryVersionHistoryProps) => {
  const [versions, setVersions] = useState<StoryVersion[]>([]);

  // Load saved versions
  useEffect(() => {
    const savedVersions = localStorage.getItem(
      `story-versions-${story.uuid}`
    );

    if (savedVersions) {
      setVersions(JSON.parse(savedVersions));
    }
  }, [story.uuid]);

  // Auto save new version when story changes
  useEffect(() => {
    if (!story.content) return;

    const newVersion: StoryVersion = {
      id: Date.now().toString(),
      content: story.content,
      timestamp: new Date().toLocaleString(),
    };

    setVersions((prev) => {
      const exists = prev.some(
        (version) => version.content === story.content
      );

      if (exists) return prev;

      const updatedVersions = [newVersion, ...prev].slice(0, 10);

      localStorage.setItem(
        `story-versions-${story.uuid}`,
        JSON.stringify(updatedVersions)
      );

      return updatedVersions;
    });
  }, [story.content, story.uuid]);

  return (
    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
      <h3 className="text-lg font-bold text-white mb-4">
        🕒 Story Version History
      </h3>

      {versions.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No previous versions available.
        </p>
      ) : (
        <div className="space-y-3">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className="rounded-lg border border-slate-600 p-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">
                    Version {versions.length - index}
                  </p>
                  <p className="text-xs text-slate-400">
                    {version.timestamp}
                  </p>
                </div>

                <button
                  onClick={() => onRestore(version.content)}
                  className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-500"
                >
                  Restore
                </button>
              </div>

              <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                {version.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryVersionHistory;