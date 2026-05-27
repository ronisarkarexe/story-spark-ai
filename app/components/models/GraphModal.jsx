"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

// Example graph: list of nodes with connections
const graph = {
  A: ["B", "C"],
  B: ["A", "D"],
  C: ["A", "D"],
  D: ["B", "C", "E"],
  E: ["D"],
};

export default function GraphVisualizer() {
  const nodeRefs = useRef({});

  useEffect(() => {
    Object.values(nodeRefs.current).forEach((ref, i) => {
      gsap.fromTo(
        ref,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, delay: i * 0.1, duration: 0.5, ease: "back.out(1.7)" }
      );
    });
  }, []);

  // Positioning nodes manually for now (can automate later with graph layout algorithms)
  const positions = {
    A: { top: "15%", left: "45%" },
    B: { top: "35%", left: "25%" },
    C: { top: "35%", left: "65%" },
    D: { top: "55%", left: "45%" },
    E: { top: "75%", left: "45%" },
  };

  const drawEdges = () => {
    const lines = [];
    const drawn = new Set();

    for (const [node, neighbors] of Object.entries(graph)) {
      for (const neighbor of neighbors) {
        const key = [node, neighbor].sort().join("-");
        if (drawn.has(key)) continue;
        drawn.add(key);

        const from = positions[node];
        const to = positions[neighbor];
        if (!from || !to) continue;

        lines.push(
          <line
            key={key}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="#60A5FA"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          >
            <animate
              attributeName="x1"
              to={from.left}
              dur="0.5s"
              fill="freeze"
              begin="0s"
            />
            <animate
              attributeName="y1"
              to={from.top}
              dur="0.5s"
              fill="freeze"
              begin="0s"
            />
            <animate
              attributeName="x2"
              to={to.left}
              dur="0.5s"
              fill="freeze"
              begin="0s"
            />
            <animate
              attributeName="y2"
              to={to.top}
              dur="0.5s"
              fill="freeze"
              begin="0s"
            />
          </line>
        );
      }
    }
    return lines;
  };

  return (
    <div className="relative w-full h-44 bg-blue-50 border border-blue-200 rounded-lg shadow-inner pt-2">
      {/* SVG edges */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {drawEdges()}
      </svg>

      {/* Nodes */}
      {Object.keys(graph).map((node) => (
        <div
          key={node}
          ref={(el) => (nodeRefs.current[node] = el)}
          className="absolute w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md font-semibold text-sm"
          style={{
            top: positions[node].top,
            left: positions[node].left,
            transform: "translate(-50%, -50%)",
          }}
        >
          {node}
        </div>
      ))}
    </div>
  );
}