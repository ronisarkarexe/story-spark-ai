import React, { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from "@xyflow/react";

const EDGE_STYLES: Record<string, { stroke: string; strokeDasharray?: string }> = {
  "Friend": { stroke: "#10B981" }, 
  "Romantic Interest": { stroke: "#EC4899" }, 
  "Family": { stroke: "#3B82F6" }, 
  "Rival": { stroke: "#FBBF24", strokeDasharray: "5,5" }, 
  "Enemy": { stroke: "#EF4444", strokeDasharray: "5,5" }, 
  "Mentor": { stroke: "#8B5CF6" }, 
  "Ally": { stroke: "#14B8A6" }, 
  "Unknown": { stroke: "#6B7280", strokeDasharray: "2,4" }, 
};

const RelationshipEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const type = (data?.type as string) || "Unknown";
  const strength = (data?.strength as number) || 50;
  const interactionCount = (data?.interactionCount as number) || 1;

  const typeStyle = EDGE_STYLES[type] || EDGE_STYLES.Unknown;
  const strokeWidth = Math.max(1.5, Math.min(6, strength / 15));

  const edgeStyle = {
    ...style,
    ...typeStyle,
    strokeWidth: selected ? strokeWidth + 2 : strokeWidth,
    stroke: selected ? "#6366F1" : typeStyle.stroke, 
    transition: "stroke-width 0.2s, stroke 0.2s",
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="group/edge flex items-center justify-center"
        >
          <div className="bg-slate-950/90 border border-slate-700/60 rounded-md px-2 py-0.5 text-[9px] text-slate-300 shadow-lg cursor-pointer hover:scale-105 hover:bg-slate-900 transition-all select-none">
            {type} ({strength})
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/edge:block bg-slate-900 border border-slate-700 text-white text-[10px] p-2 rounded whitespace-nowrap shadow-xl z-50">
              <div>Type: <strong>{type}</strong></div>
              <div>Strength: <strong>{strength}/100</strong></div>
              <div>Interactions: <strong>{interactionCount}</strong></div>
            </div>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(RelationshipEdge);
