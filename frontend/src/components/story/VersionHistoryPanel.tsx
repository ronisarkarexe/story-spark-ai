import React from "react";

const VersionHistoryPanel = () => {
  return (
    <div className="w-72 bg-zinc-900 h-screen border-r border-zinc-800 p-5">
      <h2 className="text-2xl font-bold text-white mb-6">
        Version History
      </h2>
      <p className="text-zinc-400 text-sm">
        No saved versions yet.
      </p>
      <p className="text-zinc-500 text-xs mt-2">
        Versions are automatically created when a new chapter is generated.
      </p>
    </div>
  );
};

export default VersionHistoryPanel;