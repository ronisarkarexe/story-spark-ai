"use client";
// components/BinaryTree.js
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const NODE_RADIUS = 8;
const V_SPACING = 30;
const BASE_H_SPACING = 70;

const shadesOfBlue = [
  "#0d47a1", // level 0
  "#1976d2", // level 1
  "#42a5f5", // level 2
];

// Generate nodes with explicit IDs matching heap indices
function generateTreeNodes(level, maxLevel, x, y, spacing, id, nodes) {
  if (level > maxLevel) return;

  nodes[id] = { id, x, y, level, shade: shadesOfBlue[level] };

  if (level < maxLevel) {
    const nextY = y + V_SPACING;
    const childSpacing = spacing / 2;

    generateTreeNodes(level + 1, maxLevel, x - childSpacing, nextY, childSpacing, 2 * id + 1, nodes);
    generateTreeNodes(level + 1, maxLevel, x + childSpacing, nextY, childSpacing, 2 * id + 2, nodes);
  }
}

export default function BinaryTree() {
  const treeRef = useRef(null);

  const SVG_WIDTH = 225;
  const SVG_HEIGHT = 3 * V_SPACING + 20;
  const maxLevel = 2; // 3 levels total (0,1,2)

  const nodes = [];
  generateTreeNodes(0, maxLevel, SVG_WIDTH / 2, 30, BASE_H_SPACING, 0, nodes);

  useEffect(() => {
    gsap.fromTo(
      treeRef.current.querySelectorAll("circle"),
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.7)",
      }
    );
  }, []);

  return (
    <svg
      ref={treeRef}
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
      style={{ backgroundColor: "#f0f7ff", borderRadius: 8 }}
    >
      {/* Draw edges */}
      {nodes.map((node) => {
        if (!node || node.level === maxLevel) return null;

        const leftChild = nodes[2 * node.id + 1];
        const rightChild = nodes[2 * node.id + 2];

        return (
          <g key={`edges-${node.id}`}>
            {leftChild && (
              <line
                x1={node.x}
                y1={node.y + NODE_RADIUS}
                x2={leftChild.x}
                y2={leftChild.y - NODE_RADIUS}
                stroke="#1976d2"
                strokeWidth="2"
              />
            )}
            {rightChild && (
              <line
                x1={node.x}
                y1={node.y + NODE_RADIUS}
                x2={rightChild.x}
                y2={rightChild.y - NODE_RADIUS}
                stroke="#1976d2"
                strokeWidth="2"
              />
            )}
          </g>
        );
      })}

      {/* Draw nodes */}
      {nodes.map(
        (node) =>
          node && (
            <circle
              key={`node-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill={node.shade}
              stroke="#0d47a1"
              strokeWidth="2"
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
          )
      )}
    </svg>
  );
}