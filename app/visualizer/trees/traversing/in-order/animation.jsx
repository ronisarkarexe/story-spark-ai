"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export default function InOrderVisualizer() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("Tree is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [traversalResult, setTraversalResult] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState(0);
  const animationRef = useRef(null);

  const insertNode = (node, value) => {
    if (!node) return new TreeNode(value);
    if (value < node.value) {
      return { ...node, left: insertNode(node.left, value) };
    }
    if (value > node.value) {
      return { ...node, right: insertNode(node.right, value) };
    }
    return node;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue, 10);
    if (Number.isNaN(value)) {
      setMessage("Please enter a valid number");
      return;
    }

    setRoot((prev) => {
      const newRoot = insertNode(prev, value);
      setMessage(`Inserted ${value}`);
      return newRoot;
    });
    setInputValue("");
    setTraversalResult([]);
    setHighlightedNodes([]);
    setSteps(0);
  };

  const generateRandomTree = () => {
    const size = Math.floor(Math.random() * 5) + 5;
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);

    let newRoot = null;
    values.forEach((value) => {
      newRoot = insertNode(newRoot, value);
    });

    setRoot(newRoot);
    setMessage(`Generated tree with ${size} nodes`);
    setTraversalResult([]);
    setHighlightedNodes([]);
    setSteps(0);
  };

  const reset = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setRoot(null);
    setInputValue("");
    setIsAnimating(false);
    setMessage("Tree is empty");
    setTraversalResult([]);
    setHighlightedNodes([]);
    setSteps(0);
  };

  const inOrderTraversal = (node, path = []) => {
    if (!node) return path;

    const leftPath = inOrderTraversal(node.left, path);
    leftPath.push({
      value: node.value,
      action: "visit",
      highlighted: true,
    });
    return inOrderTraversal(node.right, leftPath);
  };

  const visualizeInOrder = () => {
    if (!root) {
      setMessage("Tree is empty!");
      return;
    }

    setIsAnimating(true);
    setMessage("Performing in-order traversal...");
    setTraversalResult([]);
    setHighlightedNodes([]);
    setSteps(0);

    const traversalPath = inOrderTraversal(root);
    let step = 0;

    const animateStep = () => {
      if (step < traversalPath.length) {
        const current = traversalPath[step];
        setHighlightedNodes([current.value]);
        setTraversalResult((prev) => [...prev, current.value]);
        setSteps(step + 1);
        step++;
        animationRef.current = setTimeout(animateStep, 1000 / speed);
      } else {
        setMessage(
          `In-order traversal complete: [${traversalPath.map((node) => node.value).join(", ")}]`
        );
        setIsAnimating(false);
        setHighlightedNodes([]);
      }
    };

    animateStep();
  };

  const renderTree = (node, x = 400, y = 50, level = 0, nodes = [], edges = []) => {
    if (!node) return { nodes, edges };

    const nodeRadius = 25;
    const xOffset = Math.max(50, 200 / (level + 1));
    const yOffset = 80;

    nodes.push({
      value: node.value,
      x,
      y,
      highlighted: highlightedNodes.includes(node.value),
    });

    if (node.left) {
      const leftX = x - xOffset;
      const leftY = y + yOffset;
      edges.push({
        x1: x,
        y1: y + nodeRadius,
        x2: leftX,
        y2: leftY - nodeRadius,
      });
      renderTree(node.left, leftX, leftY, level + 1, nodes, edges);
    }

    if (node.right) {
      const rightX = x + xOffset;
      const rightY = y + yOffset;
      edges.push({
        x1: x,
        y1: y + nodeRadius,
        x2: rightX,
        y2: rightY - nodeRadius,
      });
      renderTree(node.right, rightX, rightY, level + 1, nodes, edges);
    }

    return { nodes, edges };
  };

  const { nodes, edges } = root ? renderTree(root) : { nodes: [], edges: [] };

  const getSvgDimensions = () => {
    if (nodes.length === 0) return { width: 800, height: 400 };

    const xValues = nodes.map((node) => node.x);
    const yValues = nodes.map((node) => node.y);
    const padding = 50;

    return {
      width: Math.max(800, Math.max(...xValues) - Math.min(...xValues) + 2 * padding),
      height: Math.max(400, Math.max(...yValues) + 2 * padding),
    };
  };

  const svgDimensions = getSvgDimensions();

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <button
              onClick={generateRandomTree}
              disabled={isAnimating}
              className="mb-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              Generate Random Tree
            </button>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number"
                className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                disabled={isAnimating}
                onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              />
              <button
                onClick={handleInsert}
                disabled={isAnimating}
                className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={visualizeInOrder}
              disabled={!root || isAnimating}
              className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
            >
              {isAnimating ? "Traversing..." : "Start Traversal"}
            </button>
            <button
              onClick={reset}
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Reset All
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">Speed:</span>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="flex-1"
              disabled={isAnimating}
            />
            <span className="w-8 text-sm text-gray-700 dark:text-gray-300">{speed}x</span>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg bg-gray-100 p-2 text-center dark:bg-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">Nodes</div>
              <div className="font-bold">{nodes.length}</div>
            </div>
            <div className="flex-1 rounded-lg bg-gray-100 p-2 text-center dark:bg-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">Steps</div>
              <div className="font-bold">{steps}</div>
            </div>
          </div>
        </div>
      </VisualizerCard>

      <VisualizerCard
        className={
          message.includes("complete")
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : isAnimating
              ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30"
              : ""
        }
      >
        <p className="text-center">{message}</p>
      </VisualizerCard>

      <VisualizerCard>
        <h2 className="mb-3 text-lg font-semibold">Tree Visualization</h2>
        <div className="flex min-h-[400px] justify-center overflow-auto py-4">
          {nodes.length > 0 ? (
            <div className="relative" style={{ minWidth: `${svgDimensions.width}px` }}>
              <svg
                width={svgDimensions.width}
                height={svgDimensions.height}
                viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
                className="mx-auto"
              >
                {edges.map((edge, i) => (
                  <line
                    key={i}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    className="dark:stroke-gray-600"
                  />
                ))}
                {nodes.map((node, i) => (
                  <g key={i}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill={node.highlighted ? "#f59e0b" : "#3b82f6"}
                      stroke={node.highlighted ? "#d97706" : "#1d4ed8"}
                      strokeWidth="2"
                      className={`transition-colors ${node.highlighted ? "animate-pulse" : ""}`}
                    />
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="13"
                      fontWeight="600"
                    >
                      {node.value}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {isAnimating ? "Traversing..." : "No tree generated yet"}
            </div>
          )}
        </div>

        {traversalResult.length > 0 && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-center dark:border-green-800 dark:bg-green-900/20">
            <span className="font-medium">Path: </span>
            <span className="text-green-700 dark:text-green-300">
              [{traversalResult.join(", ")}]
            </span>
          </div>
        )}
      </VisualizerCard>

      <VisualizerCard>
        <h2 className="mb-3 text-lg font-semibold">About In-Order Traversal</h2>
        <div className="space-y-4">
          <div className="prose text-sm dark:prose-invert">
            <p>Visits nodes in the order:</p>
            <ol className="space-y-1 pl-5">
              <li>Left subtree</li>
              <li>Root node</li>
              <li>Right subtree</li>
            </ol>
            <p className="mt-2">For BSTs, this produces nodes in sorted order.</p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900/20">
            <h3 className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">Algorithm:</h3>
            <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-700">
{`function inOrder(node) {
  if (node !== null) {
    inOrder(node.left);
    visit(node);
    inOrder(node.right);
  }
}`}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-gray-100 p-2 text-center dark:bg-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Time</div>
              <div className="font-bold">O(n)</div>
            </div>
            <div className="rounded-lg bg-gray-100 p-2 text-center dark:bg-gray-700">
              <div className="text-gray-500 dark:text-gray-400">Space</div>
              <div className="font-bold">O(h)</div>
            </div>
          </div>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}
