import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export interface CharacterNodeData extends Record<string, unknown> {
  name: string;
  appearanceCount: number;
  importanceScore: number;
  isSelected: boolean;
}

const CharacterNode = ({ data }: NodeProps<any>) => {
  const nodeData = data as CharacterNodeData;
  const baseSize = 48;
  const size = baseSize + (nodeData.importanceScore || 0) * 0.6; // Scale up to ~110px
  const borderGlow = nodeData.isSelected 
    ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" 
    : "border-indigo-400/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]";

  return (
    <div className="relative group flex items-center justify-center">
      {/* Tooltip on Hover */}
      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center bg-slate-950/95 border border-slate-700/60 text-white text-[11px] rounded-lg py-2 px-3 shadow-xl backdrop-blur-sm pointer-events-none z-50 min-w-[140px] transition-all duration-200">
        <span className="font-bold border-b border-white/10 pb-1 mb-1 w-full text-center">{nodeData.name}</span>
        <span className="text-slate-300">Appearances: <strong className="text-indigo-300">{nodeData.appearanceCount}</strong></span>
        <span className="text-slate-300">Importance: <strong className="text-indigo-300">{nodeData.importanceScore}%</strong></span>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
      </div>

      <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />

      <div 
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`rounded-full bg-gradient-to-br from-slate-900 to-slate-950 border-2 ${borderGlow} flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer`}
      >
        <span 
          style={{ fontSize: `${Math.max(10, size * 0.18)}px` }}
          className="text-white font-extrabold text-center px-2 break-words leading-tight select-none"
        >
          {nodeData.name}
        </span>
      </div>
    </div>
  );
};

export default memo(CharacterNode);
