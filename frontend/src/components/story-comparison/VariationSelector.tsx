import React from "react";

interface IStoryVersion {
  _id: string;
  storyId: string;
  content: string;
  title: string;
  prompt?: string;
  generationType: string;
  versionNumber: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface VariationSelectorProps {
  versions: IStoryVersion[];
  selectedVersion1: IStoryVersion | null;
  selectedVersion2: IStoryVersion | null;
  onSelectVersion1: (version: IStoryVersion) => void;
  onSelectVersion2: (version: IStoryVersion) => void;
  onCompare: () => void;
  isLoading?: boolean;
}

const VariationSelector: React.FC<VariationSelectorProps> = ({
  versions,
  selectedVersion1,
  selectedVersion2,
  onSelectVersion1,
  onSelectVersion2,
  onCompare,
  isLoading = false,
}) => {
  const isReadyToCompare = selectedVersion1 && selectedVersion2 && selectedVersion1._id !== selectedVersion2._id;

  const getVersionLabel = (version: IStoryVersion) => {
    return `v${version.versionNumber} - ${version.generationType} (${new Date(version.createdAt).toLocaleDateString()})`;
  };

  const getGenerationTypeColor = (generationType: string) => {
    switch (generationType) {
      case "edited":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "regenerated":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "alternate-ending":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "restored":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Version 1 Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-gray-300 mb-3">
            📝 Select First Version
          </label>
          <select
            value={selectedVersion1?._id || ""}
            onChange={(e) => {
              const version = versions.find((v) => v._id === e.target.value);
              if (version) onSelectVersion1(version);
            }}
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
          >
            <option value="">Choose a version...</option>
            {versions.map((version) => (
              <option key={version._id} value={version._id}>
                {getVersionLabel(version)}
              </option>
            ))}
          </select>
          {selectedVersion1 && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  VERSION #{selectedVersion1.versionNumber}
                </span>
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getGenerationTypeColor(
                    selectedVersion1.generationType
                  )}`}
                >
                  {selectedVersion1.generationType}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-1">
                {selectedVersion1.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                📅 {new Date(selectedVersion1.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Version 2 Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-gray-300 mb-3">
            📝 Select Second Version
          </label>
          <select
            value={selectedVersion2?._id || ""}
            onChange={(e) => {
              const version = versions.find((v) => v._id === e.target.value);
              if (version) onSelectVersion2(version);
            }}
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
          >
            <option value="">Choose a version...</option>
            {versions.map((version) => (
              <option key={version._id} value={version._id}>
                {getVersionLabel(version)}
              </option>
            ))}
          </select>
          {selectedVersion2 && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  VERSION #{selectedVersion2.versionNumber}
                </span>
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getGenerationTypeColor(
                    selectedVersion2.generationType
                  )}`}
                >
                  {selectedVersion2.generationType}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-1">
                {selectedVersion2.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                📅 {new Date(selectedVersion2.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compare Button */}
      <button
        onClick={onCompare}
        disabled={!isReadyToCompare || isLoading}
        className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
          isReadyToCompare && !isLoading
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 cursor-pointer active:scale-95"
            : "bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-50"
        }`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
            Analyzing...
          </>
        ) : (
          <>
            🔍 Compare Variations
          </>
        )}
      </button>

      {!isReadyToCompare && selectedVersion1 && selectedVersion2 && selectedVersion1._id === selectedVersion2._id && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            ⚠️ Please select two different versions to compare.
          </p>
        </div>
      )}
    </div>
  );
};

export default VariationSelector;
