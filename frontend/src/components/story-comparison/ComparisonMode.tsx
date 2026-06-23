import React, { useState } from "react";
import VariationSelector from "./VariationSelector";
import DiffViewer from "./DiffViewer";

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

interface ComparisonModeProps {
  versions: IStoryVersion[];
  isLoadingVersions: boolean;
  onClose: () => void;
}

const ComparisonMode: React.FC<ComparisonModeProps> = ({
  versions,
  isLoadingVersions,
  onClose,
}) => {
  const [selectedVersion1, setSelectedVersion1] = useState<IStoryVersion | null>(null);
  const [selectedVersion2, setSelectedVersion2] = useState<IStoryVersion | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleCompare = () => {
    if (!selectedVersion1 || !selectedVersion2 || selectedVersion1._id === selectedVersion2._id) {
      return;
    }

    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
      setShowComparison(true);
    }, 300);
  };

  const handleBackToSelection = () => {
    setShowComparison(false);
    setSelectedVersion1(null);
    setSelectedVersion2(null);
  };

  if (isLoadingVersions) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading story versions...</p>
      </div>
    );
  }

  if (versions.length < 2) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
        <span className="text-4xl block mb-3">📚</span>
        <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-2 text-lg">No Variations Available</h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
          You need at least 2 story versions to compare. Try editing your story or generating variations first!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">📊 Story Variation Comparison</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Compare two versions to see what changed
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-all"
          aria-label="Close comparison"
        >
          ✕
        </button>
      </div>

      {!showComparison ? (
        <VariationSelector
          versions={versions}
          selectedVersion1={selectedVersion1}
          selectedVersion2={selectedVersion2}
          onSelectVersion1={setSelectedVersion1}
          onSelectVersion2={setSelectedVersion2}
          onCompare={handleCompare}
          isLoading={isComparing}
        />
      ) : selectedVersion1 && selectedVersion2 ? (
        <DiffViewer
          version1={selectedVersion1}
          version2={selectedVersion2}
          onBack={handleBackToSelection}
        />
      ) : null}
    </div>
  );
};

export default ComparisonMode;
