"use client";
import React, { useState } from "react";
import { Play, RotateCcw, Info, ArrowLeftRight } from "lucide-react";

// Tree 1 Setup
const NODES1 = [
  { id: "1-1", val: "1", x: 200, y: 50, parent: null },
  { id: "1-2", val: "2", x: 100, y: 150, parent: "1-1", isLeft: true },
  { id: "1-3", val: "3", x: 300, y: 150, parent: "1-1", isLeft: false },
  { id: "1-4", val: "4", x: 50, y: 250, parent: "1-2", isLeft: true },
  { id: "1-5", val: "5", x: 150, y: 250, parent: "1-2", isLeft: false },
];

const EDGES1 = NODES1.filter(n => n.parent).map(n => {
  const p = NODES1.find(parent => parent.id === n.parent);
  return { id: `${p.id}-${n.id}`, x1: p.x, y1: p.y + 20, x2: n.x, y2: n.y - 20, parent: p.id, child: n.id };
});

// Tree 2 Setup (Isomorphic, 2 and 3 swapped, 4 and 5 swapped under 2)
const NODES2 = [
  { id: "2-1", val: "1", x: 600, y: 50, parent: null },
  { id: "2-3", val: "3", x: 500, y: 150, parent: "2-1", isLeft: true }, // swapped
  { id: "2-2", val: "2", x: 700, y: 150, parent: "2-1", isLeft: false }, // swapped
  { id: "2-5", val: "5", x: 650, y: 250, parent: "2-2", isLeft: true }, // swapped
  { id: "2-4", val: "4", x: 750, y: 250, parent: "2-2", isLeft: false }, // swapped
];

const EDGES2 = NODES2.filter(n => n.parent).map(n => {
  const p = NODES2.find(parent => parent.id === n.parent);
  return { id: `${p.id}-${n.id}`, x1: p.x, y1: p.y + 20, x2: n.x, y2: n.y - 20, parent: p.id, child: n.id };
});

export default function IsomorphismAnimation() {
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Check Isomorphism' to compare the two trees step-by-step.");
  
  const [activePairs, setActivePairs] = useState([]);
  const [matchStatus, setMatchStatus] = useState({}); // { "1-1_2-1": "match", ... }
  const [isomorphic, setIsomorphic] = useState(null);

  const handleCheck = () => {
    setAnimating(true);
    setActivePairs([]);
    setMatchStatus({});
    setIsomorphic(null);

    const seq = [
      { msg: "Comparing Root Nodes (1, 1). They match.", pair: ["1-1", "2-1"], status: "match" },
      { msg: "Comparing Left(1) with Left(2): (2, 3). Mismatch. Trying swapped...", pair: ["1-2", "2-3"], status: "mismatch" },
      { msg: "Comparing Left(1) with Right(2): (2, 2). Match! Swapped children confirmed.", pair: ["1-2", "2-2"], status: "match" },
      { msg: "Comparing Right(1) with Left(2): (3, 3). Match!", pair: ["1-3", "2-3"], status: "match" },
      { msg: "Comparing Left(2) with Left(5): (4, 5). Mismatch. Trying swapped...", pair: ["1-4", "2-5"], status: "mismatch" },
      { msg: "Comparing Left(2) with Right(4): (4, 4). Match! Swapped children confirmed.", pair: ["1-4", "2-4"], status: "match" },
      { msg: "Comparing Right(2) with Left(5): (5, 5). Match!", pair: ["1-5", "2-5"], status: "match" },
    ];

    let step = 0;
    let newStatus = {};

    const interval = setInterval(() => {
      if (step < seq.length) {
        const curr = seq[step];
        setActivePairs(curr.pair);
        newStatus = { ...newStatus, [`${curr.pair[0]}_${curr.pair[1]}`]: curr.status };
        setMatchStatus(newStatus);
        setMessage(curr.msg);
        step++;
      } else {
        clearInterval(interval);
        setActivePairs([]);
        setIsomorphic(true);
        setMessage("Complete! The trees are isomorphic.");
      }
    }, 1800);
  };

  const handleReset = () => {
    setAnimating(false);
    setActivePairs([]);
    setMatchStatus({});
    setIsomorphic(null);
    setMessage("Click 'Check Isomorphism' to compare the two trees step-by-step.");
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-5xl mx-auto selection:bg-[#a435f0]/30 selection:text-[#c27cf7]">
      
      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-wrap gap-4 justify-between items-center shadow-lg shadow-black/20">
        <div className="flex items-center gap-4 text-green-300 font-mono bg-slate-950/50 px-4 py-2 rounded-lg border border-green-900/50">
          Result: <span className="text-xl font-bold ml-2 text-[#a435f0]">{isomorphic === null ? "?" : (isomorphic ? "True" : "False")}</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleCheck} 
            disabled={animating && isomorphic === null}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-primary hover:bg-primary-dark disabled:bg-primary-dark/40 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <Play className="w-4 h-4 fill-white" /> Check Isomorphism
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
        <div className="text-sm font-medium text-green-200/90 leading-relaxed min-h-[20px]">{message}</div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-4 min-h-[500px]">
        <div className="overflow-auto flex justify-center mt-6">
          <svg width="800" height="350" viewBox="0 0 800 350" className="max-w-full h-auto drop-shadow-xl">
            {/* Divider */}
            <line x1="400" y1="0" x2="400" y2="350" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
            <text x="200" y="20" fill="#94a3b8" fontSize="16" fontWeight="bold" textAnchor="middle">Tree 1</text>
            <text x="600" y="20" fill="#94a3b8" fontSize="16" fontWeight="bold" textAnchor="middle">Tree 2</text>

            {/* Tree 1 Edges */}
            {EDGES1.map(e => <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#334155" strokeWidth="2" />)}
            {/* Tree 2 Edges */}
            {EDGES2.map(e => <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#334155" strokeWidth="2" />)}

            {/* Active Comparison Indicator */}
            {activePairs.length === 2 && (
              <path 
                d={`M ${NODES1.find(n => n.id === activePairs[0]).x} ${NODES1.find(n => n.id === activePairs[0]).y} Q 400 0 ${NODES2.find(n => n.id === activePairs[1]).x} ${NODES2.find(n => n.id === activePairs[1]).y}`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="opacity-50 animate-pulse"
              />
            )}

            {/* Tree 1 Nodes */}
            {NODES1.map(node => {
              const isActive = activePairs[0] === node.id;
              let stroke = "#475569";
              let fill = "#0f172a";
              
              if (isActive) {
                stroke = "#22c55e";
                fill = "#14532d";
              }

              // Check if involved in a match/mismatch
              Object.entries(matchStatus).forEach(([pairKey, status]) => {
                if (pairKey.startsWith(node.id + "_")) {
                  if (status === "match") { stroke = "#4ade80"; fill = "#064e3b"; }
                  if (status === "mismatch") { stroke = "#f87171"; }
                }
              });

              return (
                <g key={node.id} className="transition-all duration-300">
                  {isActive && <circle cx={node.x} cy={node.y} r="30" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  <circle cx={node.x} cy={node.y} r="24" fill={fill} stroke={stroke} strokeWidth="2.5" className="shadow-xl" />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">{node.val}</text>
                </g>
              );
            })}

            {/* Tree 2 Nodes */}
            {NODES2.map(node => {
              const isActive = activePairs[1] === node.id;
              let stroke = "#475569";
              let fill = "#0f172a";
              
              if (isActive) {
                stroke = "#22c55e";
                fill = "#14532d";
              }

              Object.entries(matchStatus).forEach(([pairKey, status]) => {
                if (pairKey.endsWith("_" + node.id)) {
                  if (status === "match") { stroke = "#4ade80"; fill = "#064e3b"; }
                  if (status === "mismatch") { stroke = "#f87171"; }
                }
              });

              return (
                <g key={node.id} className="transition-all duration-300">
                  {isActive && <circle cx={node.x} cy={node.y} r="30" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  <circle cx={node.x} cy={node.y} r="24" fill={fill} stroke={stroke} strokeWidth="2.5" className="shadow-xl" />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">{node.val}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
