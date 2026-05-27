// app/components/models/GraphCanvas.jsx
"use client";
import { useRef, useState, useCallback } from "react";

const NODE_RADIUS = 26;
const COLORS = {
  unvisited: { fill: "#111", stroke: "#22c55e" },
  visiting:  { fill: "#854d0e", stroke: "#f97316" },
  visited:   { fill: "#14532d", stroke: "#22c55e" },
};

function edgeEndpoint(x1, y1, x2, y2, radius) {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: x2 - (dx / dist) * (radius + 4),
    y: y2 - (dy / dist) * (radius + 4),
  };
}

function SelfLoop({ cx, cy, color }) {
  return (
    <ellipse
      cx={cx}
      cy={cy - NODE_RADIUS - 14}
      rx={14}
      ry={10}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      markerEnd="url(#arrowhead)"
    />
  );
}

export default function GraphCanvas({
  nodes,
  edges,
  isDirected,
  visitedSet,
  currentNode,
  onAddNode,
  onAddEdge,
  onRemoveNode,
  onRemoveEdge,
  onReverseEdge,
}) {
  const svgRef = useRef(null);
  const [edgeStart, setEdgeStart] = useState(null);

  const getNodeState = (id) => {
    if (id === currentNode) return "visiting";
    if (visitedSet?.has(id)) return "visited";
    return "unvisited";
  };

  const handleCanvasClick = useCallback(
    (e) => {
      if (e.target !== svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      onAddNode({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setEdgeStart(null);
    },
    [onAddNode]
  );

  const handleNodeClick = useCallback(
    (e, id) => {
      e.stopPropagation();
      if (edgeStart === null) {
        setEdgeStart(id);
      } else if (edgeStart === id) {
        setEdgeStart(null);
      } else {
        onAddEdge({ from: edgeStart, to: id });
        setEdgeStart(null);
      }
    },
    [edgeStart, onAddEdge]
  );

  const handleNodeRightClick = useCallback(
    (e, id) => {
      e.preventDefault();
      onRemoveNode(id);
      setEdgeStart(null);
    },
    [onRemoveNode]
  );

  const handleEdgeRightClick = useCallback(
    (e, edgeIdx) => {
      e.preventDefault();
      const menu = window.confirm(
        isDirected
          ? "Right-click edge: OK = Reverse direction, Cancel = Delete edge"
          : "Delete this edge?"
      );
      if (menu && isDirected) onReverseEdge(edgeIdx);
      else if (!isDirected || !menu) onRemoveEdge(edgeIdx);
    },
    [isDirected, onRemoveEdge, onReverseEdge]
  );

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{ cursor: edgeStart !== null ? "crosshair" : "default", minHeight: 420 }}
      onClick={handleCanvasClick}
    >
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
        <marker
          id="arrowhead-active"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {edges.map((edge, idx) => {
        const src = nodeMap[edge.from];
        const tgt = nodeMap[edge.to];
        if (!src || !tgt) return null;

        if (edge.from === edge.to) {
          return <SelfLoop key={idx} cx={src.x} cy={src.y} color="#22c55e" />;
        }

        const isActive = currentNode === edge.from || currentNode === edge.to;
        const edgeColor = isActive ? "#f97316" : "#6b7280";
        const markerEnd = isDirected
          ? isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"
          : undefined;

        const { x: ex, y: ey } = isDirected
          ? edgeEndpoint(src.x, src.y, tgt.x, tgt.y, NODE_RADIUS)
          : { x: tgt.x, y: tgt.y };

        return (
          <line
            key={idx}
            x1={src.x}
            y1={src.y}
            x2={ex}
            y2={ey}
            stroke={edgeColor}
            strokeWidth={isActive ? 2 : 1.5}
            markerEnd={markerEnd}
            style={{ cursor: "pointer" }}
            onContextMenu={(e) => handleEdgeRightClick(e, idx)}
          />
        );
      })}

      {nodes.map((node) => {
        const state = getNodeState(node.id);
        const { fill, stroke } = COLORS[state];
        const isSelected = edgeStart === node.id;

        return (
          <g
            key={node.id}
            onClick={(e) => handleNodeClick(e, node.id)}
            onContextMenu={(e) => handleNodeRightClick(e, node.id)}
            style={{ cursor: "pointer" }}
          >
            {isSelected && (
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS + 6}
                fill="none"
                stroke="#f97316"
                strokeWidth={2}
                strokeDasharray="4 3"
                opacity={0.8}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill={fill}
              stroke={stroke}
              strokeWidth={2.5}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#d1d5db"
              fontSize={14}
              fontWeight={500}
              fontFamily="monospace"
            >
              {node.id}
            </text>
          </g>
        );
      })}

      {nodes.length === 0 && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#4b5563"
          fontSize={14}
        >
          Click anywhere to add a node
        </text>
      )}

      {edgeStart !== null && (
        <text x={12} y={20} fill="#f97316" fontSize={12}>
          Click another node to connect · click same node or press Esc to cancel
        </text>
      )}
    </svg>
  );
}