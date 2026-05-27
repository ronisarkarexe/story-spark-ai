"use client";
import React, { useState } from "react";
import { Play, RotateCcw, Info } from "lucide-react";

export default function HuffmanAnimation() {
  const initialNodes = [
    { id: "A", val: 5, char: "A", x: 100, y: 250, active: true },
    { id: "B", val: 9, char: "B", x: 250, y: 250, active: true },
    { id: "C", val: 12, char: "C", x: 400, y: 250, active: true },
    { id: "D", val: 13, char: "D", x: 550, y: 250, active: true },
    { id: "E", val: 16, char: "E", x: 700, y: 250, active: true },
  ];

  const [nodes, setNodes] = useState([...initialNodes]);
  const [edges, setEdges] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Build Tree' to start Huffman Coding.");
  const [activeIds, setActiveIds] = useState([]);
  const [treeBuilt, setTreeBuilt] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const buildTree = async () => {
    setAnimating(true);
    setMessage("Starting to build Huffman Tree...");
    await delay(1000);

    let currentNodes = [...initialNodes];
    let currentEdges = [];
    let idCounter = 1;

    while (currentNodes.filter(n => n.active).length > 1) {
      // Sort active nodes by value
      let activeNodes = currentNodes.filter(n => n.active).sort((a, b) => a.val - b.val);
      
      let left = activeNodes[0];
      let right = activeNodes[1];

      setActiveIds([left.id, right.id]);
      setMessage(`Selecting two nodes with minimum frequencies: ${left.val} (${left.char || '*'}) and ${right.val} (${right.char || '*'})`);
      await delay(1500);

      // Create new node
      let sum = left.val + right.val;
      let newNodeId = `N${idCounter++}`;
      
      let newX = (left.x + right.x) / 2;
      let newY = Math.min(left.y, right.y) - 60; // place above

      let newNode = { id: newNodeId, val: sum, char: "", x: newX, y: newY, active: true };
      
      left.active = false;
      right.active = false;

      currentNodes.push(newNode);
      currentEdges.push({ source: newNode, target: left, label: "0" });
      currentEdges.push({ source: newNode, target: right, label: "1" });

      setNodes([...currentNodes]);
      setEdges([...currentEdges]);
      
      setMessage(`Combined ${left.val} and ${right.val} to form a new node with frequency ${sum}`);
      await delay(1500);
      setActiveIds([]);
    }

    setMessage("Huffman Tree built successfully! Left branches are '0', right branches are '1'.");
    setTreeBuilt(true);
    setAnimating(false);
  };

  const handleReset = () => {
    setAnimating(false);
    setNodes([...initialNodes]);
    setEdges([]);
    setActiveIds([]);
    setTreeBuilt(false);
    setMessage("Click 'Build Tree' to start Huffman Coding.");
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-5xl mx-auto">
      
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-lg shadow-black/20">
        <div className="text-sm font-bold text-slate-400">Characters & Frequencies</div>
        <div className="flex items-center gap-3">
          <button 
            onClick={buildTree} 
            disabled={animating || treeBuilt}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <Play className="w-4 h-4" /> Build Tree
          </button>
          <button 
            onClick={handleReset} 
            className="px-4 py-2.5 text-sm font-bold text-purple-400 bg-purple-950/20 hover:bg-purple-950/40 rounded-xl transition-all border border-purple-900/30 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex items-center text-xs text-slate-400 font-semibold gap-1.5">
          <Info className="w-4 h-4 text-purple-400" /> Animation Status
        </div>
        <div className="text-sm font-medium text-purple-200/90 leading-relaxed min-h-[20px]">{message}</div>
      </div>

      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-4 min-h-[400px]">
        <div className="overflow-auto flex justify-center mt-6">
          <svg width="800" height="350" viewBox="0 0 800 350" className="max-w-full h-auto drop-shadow-xl">
            {/* Edges */}
            {edges.map((edge, i) => (
              <g key={i}>
                <line 
                  x1={edge.source.x} y1={edge.source.y + 20}
                  x2={edge.target.x} y2={edge.target.y - 20}
                  stroke="#64748b" strokeWidth="2"
                  className="transition-all duration-500"
                />
                <text 
                  x={(edge.source.x + edge.target.x) / 2} 
                  y={(edge.source.y + edge.target.y) / 2 - 5} 
                  fill="#a855f7" fontSize="14" fontWeight="bold"
                >
                  {edge.label}
                </text>
              </g>
            ))}

            {/* Nodes */}
            {nodes.map((node, i) => {
              const isActive = activeIds.includes(node.id);
              return (
                <g key={node.id} className="transition-all duration-500">
                  {isActive && <circle cx={node.x} cy={node.y} r="32" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  <circle 
                    cx={node.x} cy={node.y} r="24" 
                    fill={node.char ? "#1e1b4b" : "#4c1d95"} 
                    stroke={isActive ? "#d8b4fe" : "#7e22ce"} 
                    strokeWidth="2.5" 
                    className="shadow-xl transition-all duration-500" 
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">{node.val}</text>
                  {node.char && <text x={node.x} y={node.y + 40} textAnchor="middle" fill="#d8b4fe" fontSize="14" fontWeight="bold">{node.char}</text>}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
