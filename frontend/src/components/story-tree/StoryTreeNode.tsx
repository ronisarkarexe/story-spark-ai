import React from "react";
import { Handle, Position } from "reactflow";

export interface StoryTreeNodeProps {
  data: {
    title: string;
    branchDepth: number;
    createdAt: string;
    isRoot: boolean;
    isSelected?: boolean;
    isMatchingSearch?: boolean;
  };
}

const StoryTreeNode: React.FC<StoryTreeNodeProps> = ({ data }) => {
  const formattedDate = new Date(data.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`relative px-4 py-3 rounded-xl border w-60 shadow-lg backdrop-blur-xl transition-all duration-300 text-left ${
        data.isSelected
          ? "bg-indigo-600/25 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] text-white scale-105 ring-1 ring-indigo-500/50"
          : data.isMatchingSearch
          ? "bg-amber-500/10 border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.3)] text-gray-100 scale-102"
          : "bg-slate-900/80 border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 text-gray-250"
      }`}
    >
      {/* Top Handle for Target connection */}
      {!data.isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: "#4f46e5", width: 8, height: 8 }}
        />
      )}

      {/* Badges Container */}
      <div className="flex items-center gap-2 mb-2">
        {data.isRoot ? (
          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            🌱 Root Story
          </span>
        ) : (
          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
            🌿 Branch
          </span>
        )}
        <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-800/80 text-slate-400 rounded-full">
          Depth {data.branchDepth}
        </span>
      </div>

      {/* Story Title */}
      <h3 className="text-sm font-bold truncate leading-snug pr-2" title={data.title}>
        {data.title}
      </h3>

      {/* Meta details */}
      <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500 font-medium border-t border-slate-800/60 pt-2">
        <span>Created</span>
        <span>{formattedDate}</span>
      </div>

      {/* Bottom Handle for Source connection */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#4f46e5", width: 8, height: 8 }}
      />
    </div>
  );
};

export default React.memo(StoryTreeNode);
