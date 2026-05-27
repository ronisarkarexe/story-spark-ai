"use client";
import React, { useState } from "react";
import { Play, RotateCcw, Info, Scan } from "lucide-react";

const NODES = [
  { id: "A", x: 400, y: 50, parent: null },
  { id: "B", x: 250, y: 120, parent: "A" },
  { id: "C", x: 550, y: 120, parent: "A" },
  { id: "D", x: 150, y: 210, parent: "B" },
  { id: "E", x: 350, y: 210, parent: "B" },
  { id: "F", x: 100, y: 300, parent: "D" },
  { id: "G", x: 200, y: 300, parent: "D" },
  { id: "H", x: 400, y: 300, parent: "E" },
  { id: "I", x: 450, y: 390, parent: "H" },
];

const EDGES = NODES.filter(n => n.parent).map(n => {
  const p = NODES.find(parent => parent.id === n.parent);
  return { id: `${p.id}-${n.id}`, x1: p.x, y1: p.y + 20, x2: n.x, y2: n.y - 20, parent: p.id, child: n.id };
});

export default function DiameterAnimation() {
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Find Diameter' to calculate subtree heights.");
  
  // Animation states
  const [activeNodes, setActiveNodes] = useState([]);
  const [calculatedHeights, setCalculatedHeights] = useState({});
  const [maxDiameter, setMaxDiameter] = useState(0);
  const [diameterPathEdges, setDiameterPathEdges] = useState([]);
  const [diameterPathNodes, setDiameterPathNodes] = useState([]);

  // Diameter path is explicitly: F-D-B-E-H-I
  const finalDiameterNodes = ["F", "D", "B", "E", "H", "I"];
  const finalDiameterEdges = ["D-F", "B-D", "B-E", "E-H", "H-I"];
  const finalMaxDiameter = 5;

  const handleFindDiameter = () => {
    setAnimating(true);
    setActiveNodes([]);
    setCalculatedHeights({});
    setMaxDiameter(0);
    setDiameterPathEdges([]);
    setDiameterPathNodes([]);

    const seq = [
      { msg: "Computing heights of leaves (F, G, I, C)...", nodes: ["F", "G", "I", "C"], heights: {"F":1, "G":1, "I":1, "C":1}, maxD: 0 },
      { msg: "Computing heights of H and D...", nodes: ["H", "D"], heights: {"F":1, "G":1, "I":1, "C":1, "H":2, "D":2}, maxD: 2 },
      { msg: "Computing height of E...", nodes: ["E"], heights: {"F":1, "G":1, "I":1, "C":1, "H":2, "D":2, "E":3}, maxD: 2 },
      { msg: "Computing height of B... updating Max Diameter!", nodes: ["B"], heights: {"F":1, "G":1, "I":1, "C":1, "H":2, "D":2, "E":3, "B":4}, maxD: 5 },
      { msg: "Computing height of Root A...", nodes: ["A"], heights: {"F":1, "G":1, "I":1, "C":1, "H":2, "D":2, "E":3, "B":4, "A":5}, maxD: 5 },
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < seq.length) {
        setActiveNodes(seq[step].nodes);
        setCalculatedHeights(seq[step].heights);
        setMaxDiameter(seq[step].maxD);
        setMessage(seq[step].msg);
        step++;
      } else {
        clearInterval(interval);
        setActiveNodes([]);
        setMessage(`Complete! The maximum diameter is ${finalMaxDiameter}. (Highlighted path)`);
        setDiameterPathEdges(finalDiameterEdges);
        setDiameterPathNodes(finalDiameterNodes);
      }
    }, 1500);
  };

  const handleReset = () => {
    setAnimating(false);
    setActiveNodes([]);
    setCalculatedHeights({});
    setMaxDiameter(0);
    setDiameterPathEdges([]);
    setDiameterPathNodes([]);
    setMessage("Click 'Find Diameter' to calculate subtree heights.");
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-5xl mx-auto selection:bg-[#a435f0]/30 selection:text-[#c27cf7]">
      
      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-wrap gap-4 justify-between items-center shadow-lg shadow-black/20">
        <div className="flex items-center gap-4 text-cyan-300 font-mono bg-slate-950/50 px-4 py-2 rounded-lg border border-cyan-900/50">
          Max Diameter: <span className="text-xl font-bold ml-2 text-[#a435f0]">{maxDiameter}</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleFindDiameter} 
            disabled={animating && diameterPathEdges.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-primary hover:bg-primary-dark disabled:bg-primary-dark/40 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <Scan className="w-4 h-4" /> Find Diameter
          </button>
          <button 
            onClick={handleReset} 
            className="px-4 py-2.5 text-sm font-bold text-[#a435f0] bg-[#a435f0]/10 hover:bg-[#a435f0]/20 rounded-xl transition-all border border-[#a435f0]/30 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex items-center text-xs text-slate-400 font-semibold gap-1.5">
          <Info className="w-4 h-4 text-[#a435f0]" /> Animation Status
        </div>
        <div className="text-sm font-medium text-cyan-200/90 leading-relaxed min-h-[20px]">{message}</div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-4 min-h-[500px]">
        <div className="overflow-auto flex justify-center mt-6">
          <svg width="800" height="420" viewBox="0 0 800 420" className="max-w-full h-auto drop-shadow-xl">
            {/* Edges */}
            {EDGES.map(e => {
              const isPath = diameterPathEdges.includes(e.id) || diameterPathEdges.includes(`${e.child}-${e.parent}`);
              
              return (
                <line 
                  key={e.id} 
                  x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
                  stroke={isPath ? "#06b6d4" : "#334155"} 
                  strokeWidth={isPath ? "5" : "2"}
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const isActive = activeNodes.includes(node.id);
              const isPath = diameterPathNodes.includes(node.id);
              const h = calculatedHeights[node.id];
              
              let fill = "#0f172a";
              let stroke = "#475569";
              let r = "20";

              if (isPath) {
                fill = "#164e63";
                stroke = "#22d3ee";
                r = "26";
              } else if (isActive) {
                fill = "#083344";
                stroke = "#06b6d4";
                r = "24";
              } else if (h !== undefined) {
                stroke = "#0891b2";
              }

              return (
                <g key={node.id} className="transition-all duration-500">
                  {isPath && <circle cx={node.x} cy={node.y} r="32" fill="none" stroke="#67e8f9" strokeWidth="2" className="opacity-80 animate-ping" />}
                  {isActive && <circle cx={node.x} cy={node.y} r="30" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  
                  <circle 
                    cx={node.x} cy={node.y} r={r} 
                    fill={fill} stroke={stroke} strokeWidth="2.5" 
                    className="shadow-xl transition-all duration-500" 
                  />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">{node.id}</text>
                  
                  {/* Height Indicator Label */}
                  {h !== undefined && (
                    <text x={node.x + 28} y={node.y + 4} fill="#67e8f9" fontSize="12" fontWeight="bold">h:{h}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
