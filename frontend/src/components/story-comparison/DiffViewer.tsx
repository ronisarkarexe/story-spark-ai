import React, { useMemo } from "react";
import { diffChars, Change } from "jsdiff";
import DiffHighlight from "./DiffHighlight";

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

interface DiffViewerProps {
  version1: IStoryVersion;
  version2: IStoryVersion;
  onBack: () => void;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ version1, version2, onBack }) => {
  const differences = useMemo(() => {
    return diffChars(version1.content, version2.content);
  }, [version1.content, version2.content]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let total = 0;

    differences.forEach((diff: Change) => {
      if (diff.added) added += diff.value.length;
      if (diff.removed) removed += diff.value.length;
      total += diff.value.length;
    });

    return { added, removed, total, similarity: total > 0 ? ((total - (added + removed)) / total * 100).toFixed(1) : 100 };
  }, [differences]);

  const titleDiff = useMemo(() => {
    return diffChars(version1.title, version2.title);
  }, [version1.title, version2.title]);

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">🔍 Variation Comparison</h3>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-all"
        >
          ← Back to Selection
        </button>
      </div>

      {/* Comparison Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Version 1</p>
          <p className="text-lg font-bold text-blue-900 dark:text-blue-200">v{version1.versionNumber}</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Version 2</p>
          <p className="text-lg font-bold text-purple-900 dark:text-purple-200">v{version2.versionNumber}</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Added</p>
          <p className="text-lg font-bold text-green-900 dark:text-green-200">{stats.added}</p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Removed</p>
          <p className="text-lg font-bold text-red-900 dark:text-red-200">{stats.removed}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase">Legend</p>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-green-200 dark:bg-green-900/40 border border-green-500"></span>
            <span className="text-sm text-slate-700 dark:text-slate-300">Added</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-200 dark:bg-red-900/40 border border-red-500 line-through"></span>
            <span className="text-sm text-slate-700 dark:text-slate-300">Removed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 dark:text-slate-300">Normal text = Unchanged</span>
          </div>
        </div>
      </div>

      {/* Title Comparison */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4 uppercase">Title Comparison</h4>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Version {version1.versionNumber}</p>
            <p className="text-base text-slate-900 dark:text-white leading-relaxed">
              {titleDiff.map((diff: Change, idx: number) => (
                <span key={idx}>
                  {diff.added ? (
                    <DiffHighlight text={diff.value} type="added" />
                  ) : diff.removed ? (
                    <DiffHighlight text={diff.value} type="removed" />
                  ) : (
                    diff.value
                  )}
                </span>
              ))}
            </p>
          </div>
          <div className="h-px bg-slate-300 dark:bg-slate-600"></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Version {version2.versionNumber}</p>
            <p className="text-base text-slate-900 dark:text-white leading-relaxed">
              {titleDiff.map((diff: Change, idx: number) => (
                <span key={idx}>
                  {diff.added ? (
                    <span className="bg-green-200/50 dark:bg-green-900/40 text-green-900 dark:text-green-200 px-1 py-0.5 rounded">
                      {diff.value}
                    </span>
                  ) : diff.removed ? (
                    ""
                  ) : (
                    diff.value
                  )}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* Content Comparison */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4 uppercase">Content Comparison</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px]">
          {/* Version 1 View */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 text-xs font-bold rounded-full">
                Version {version1.versionNumber}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {version1.generationType}
              </span>
            </div>
            <div className="overflow-y-auto max-h-[500px] p-4 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                {differences.map((diff: Change, idx: number) => (
                  <span key={idx}>
                    {!diff.added ? (
                      diff.removed ? (
                        <DiffHighlight text={diff.value} type="removed" />
                      ) : (
                        <span>{diff.value}</span>
                      )
                    ) : (
                      ""
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Version 2 View */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 text-xs font-bold rounded-full">
                Version {version2.versionNumber}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {version2.generationType}
              </span>
            </div>
            <div className="overflow-y-auto max-h-[500px] p-4 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                {differences.map((diff: Change, idx: number) => (
                  <span key={idx}>
                    {!diff.removed ? (
                      diff.added ? (
                        <DiffHighlight text={diff.value} type="added" />
                      ) : (
                        <span>{diff.value}</span>
                      )
                    ) : (
                      ""
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* Full Diff View */}
        <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-600">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase">Full Unified Diff View</p>
          <div className="p-4 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 overflow-x-auto max-h-[300px] overflow-y-auto">
            <p className="text-xs font-mono text-slate-900 dark:text-white leading-relaxed">
              {differences.map((diff: Change, idx: number) => (
                <React.Fragment key={idx}>
                  {diff.added ? (
                    <span className="bg-green-200/50 dark:bg-green-900/40 text-green-900 dark:text-green-200">
                      + {diff.value}
                    </span>
                  ) : diff.removed ? (
                    <span className="bg-red-200/50 dark:bg-red-900/40 text-red-900 dark:text-red-200">
                      - {diff.value}
                    </span>
                  ) : (
                    <span>{diff.value}</span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-300 dark:border-slate-600">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <p className="font-bold mb-1">Version {version1.versionNumber} Info</p>
            <p>Type: {version1.generationType}</p>
            <p>Created: {new Date(version1.createdAt).toLocaleString()}</p>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <p className="font-bold mb-1">Version {version2.versionNumber} Info</p>
            <p>Type: {version2.generationType}</p>
            <p>Created: {new Date(version2.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;
