import React, { useMemo } from "react";
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
  version3?: IStoryVersion | null;
  onBack: () => void;
  onRestore?: (versionId: string) => void;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ version1, version2, version3, onBack, onRestore }) => {
  const getUniqueParagraphs = (content: string, otherContents: string[]) => {
    const lines = content.split('\n');
    return lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return { text: line, isUnique: false };
      const isUnique = otherContents.every(other => !other.includes(trimmed));
      return { text: line, isUnique };
    });
  };

  const content1 = useMemo(() => getUniqueParagraphs(version1.content, [version2.content, version3?.content].filter(Boolean) as string[]), [version1, version2, version3]);
  const content2 = useMemo(() => getUniqueParagraphs(version2.content, [version1.content, version3?.content].filter(Boolean) as string[]), [version1, version2, version3]);
  const content3 = useMemo(() => version3 ? getUniqueParagraphs(version3.content, [version1.content, version2.content]) : null, [version1, version2, version3]);

  const stats = useMemo(() => {
    return {
      unique1: content1.filter(p => p.isUnique).length,
      unique2: content2.filter(p => p.isUnique).length,
      unique3: content3 ? content3.filter(p => p.isUnique).length : 0,
    };
  }, [content1, content2, content3]);

  const renderVersionColumn = (version: IStoryVersion, content: { text: string; isUnique: boolean }[], uniqueCount: number, bgColorClass: string, textColorClass: string) => {
    return (
      <div className="space-y-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 ${bgColorClass} ${textColorClass} text-xs font-bold rounded-full`}>
              Version {version.versionNumber}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {version.generationType}
            </span>
          </div>
          {onRestore && (
            <button
              onClick={() => onRestore(version._id)}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded transition-all active:scale-95 shadow-sm whitespace-nowrap"
            >
              ⭐ Choose Best Version
            </button>
          )}
        </div>
        <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 mb-2 shadow-sm">
           <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-1">Unique Paragraphs</p>
           <p className={`text-xl font-bold ${textColorClass}`}>{uniqueCount}</p>
        </div>
        <div className="overflow-y-auto h-[600px] p-5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 flex-1 shadow-inner">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            {version.title}
          </h4>
          <div className="text-sm text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
            {content.map((item, idx) => (
              <React.Fragment key={idx}>
                {item.isUnique ? (
                  <DiffHighlight text={item.text} type="added" />
                ) : (
                  <span>{item.text}</span>
                )}
                {idx < content.length - 1 && '\n'}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
          <p>Created: {new Date(version.createdAt).toLocaleString()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">🔍 Variation Comparison</h3>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-all font-medium"
        >
          ← Back to Selection
        </button>
      </div>

      {/* Legend */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-6 items-center">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Legend:</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-green-200 dark:bg-green-900/40 border border-green-500"></span>
            <span className="text-sm text-slate-700 dark:text-slate-300">Unique Paragraph (not found in other selected versions)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 dark:text-slate-300">Normal text = Shared content</span>
          </div>
        </div>
      </div>

      {/* Content Comparison */}
      <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className={`grid grid-cols-1 ${version3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          {/* Version 1 View */}
          {renderVersionColumn(version1, content1, stats.unique1, "bg-blue-100 dark:bg-blue-900/30", "text-blue-900 dark:text-blue-200")}

          {/* Version 2 View */}
          {renderVersionColumn(version2, content2, stats.unique2, "bg-purple-100 dark:bg-purple-900/30", "text-purple-900 dark:text-purple-200")}

          {/* Version 3 View */}
          {version3 && content3 && renderVersionColumn(version3, content3, stats.unique3, "bg-emerald-100 dark:bg-emerald-900/30", "text-emerald-900 dark:text-emerald-200")}
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;
