"use client";
import React, { useState } from "react";
import { Play, RotateCcw, Info } from "lucide-react";

export default function SyntaxTreesAnimation() {
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Evaluate AST' to evaluate: 3 + (5 * 2)");
  const [activeNode, setActiveNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [nodeValues, setNodeValues] = useState({
    N1: "?", N2: "3", N3: "?", N4: "5", N5: "2"
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const evaluateAST = async () => {
    setAnimating(true);
    setMessage("Starting Post-Order Traversal to evaluate AST...");
    await delay(1500);

    // Root is +, go left to 3
    setActiveNode("N2");
    setActiveEdge("E1");
    setMessage("Visiting left leaf node: 3. Return 3.");
    await delay(1500);

    // Go right from + to *
    setActiveNode("N3");
    setActiveEdge("E2");
    setMessage("Visiting right subtree (*). Must evaluate its children first.");
    await delay(1500);

    // Go left from * to 5
    setActiveNode("N4");
    setActiveEdge("E3");
    setMessage("Visiting left leaf node: 5. Return 5.");
    await delay(1500);

    // Go right from * to 2
    setActiveNode("N5");
    setActiveEdge("E4");
    setMessage("Visiting right leaf node: 2. Return 2.");
    await delay(1500);

    // Evaluate *
    setActiveNode("N3");
    setActiveEdge(null);
    setMessage("Evaluating Node (*): 5 * 2 = 10.");
    setNodeValues(prev => ({ ...prev, N3: "10" }));
    await delay(2000);

    // Evaluate +
    setActiveNode("N1");
    setMessage("Evaluating Root (+): 3 + 10 = 13.");
    setNodeValues(prev => ({ ...prev, N1: "13" }));
    await delay(2000);

    setActiveNode(null);
    setMessage("AST Evaluation Complete. Final Result: 13.");
    setAnimating(false);
  };

  const handleReset = () => {
    setAnimating(false);
    setActiveNode(null);
    setActiveEdge(null);
    setNodeValues({
      N1: "?", N2: "3", N3: "?", N4: "5", N5: "2"
    });
    setMessage("Click 'Evaluate AST' to evaluate: 3 + (5 * 2)");
  };

  const getNodeFill = (id, isLeaf) => {
    if (activeNode === id) return "#a855f7";
    if (nodeValues[id] !== "?") return "#4c1d95";
    return isLeaf ? "#1e1b4b" : "#0f172a";
  };

  const getStroke = (id) => {
    if (activeNode === id) return "#d8b4fe";
    return "#7e22ce";
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-5xl mx-auto">
      
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-lg shadow-black/20">
        <div className="text-sm font-bold text-slate-400">Expression: 3 + (5 * 2)</div>
        <div className="flex items-center gap-3">
          <button 
            onClick={evaluateAST} 
            disabled={animating || nodeValues.N1 !== "?"}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <Play className="w-4 h-4" /> Evaluate AST
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

      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-4 min-h-[350px]">
        <div className="overflow-auto flex justify-center mt-6">
          <svg width="500" height="300" viewBox="0 0 500 300" className="max-w-full h-auto drop-shadow-xl">
            {/* Edges */}
            <g>
              <line x1="250" y1="50" x2="150" y2="120" stroke={activeEdge === "E1" ? "#a855f7" : "#475569"} strokeWidth={activeEdge === "E1" ? "4" : "2"} className="transition-all duration-500" />
              <line x1="250" y1="50" x2="350" y2="120" stroke={activeEdge === "E2" ? "#a855f7" : "#475569"} strokeWidth={activeEdge === "E2" ? "4" : "2"} className="transition-all duration-500" />
              <line x1="350" y1="120" x2="280" y2="190" stroke={activeEdge === "E3" ? "#a855f7" : "#475569"} strokeWidth={activeEdge === "E3" ? "4" : "2"} className="transition-all duration-500" />
              <line x1="350" y1="120" x2="420" y2="190" stroke={activeEdge === "E4" ? "#a855f7" : "#475569"} strokeWidth={activeEdge === "E4" ? "4" : "2"} className="transition-all duration-500" />
            </g>

            {/* Nodes */}
            <g className="transition-all duration-500">
              {activeNode === "N1" && <circle cx="250" cy="50" r="32" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="250" cy="50" r="24" fill={getNodeFill("N1", false)} stroke={getStroke("N1")} strokeWidth="2.5" className="shadow-xl transition-all duration-500" />
              <text x="250" y="55" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">+</text>
              <text x="250" y="90" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">{nodeValues.N1}</text>
            </g>

            <g className="transition-all duration-500">
              {activeNode === "N2" && <circle cx="150" cy="120" r="32" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="150" cy="120" r="24" fill={getNodeFill("N2", true)} stroke={getStroke("N2")} strokeWidth="2.5" className="shadow-xl transition-all duration-500" />
              <text x="150" y="125" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">3</text>
            </g>

            <g className="transition-all duration-500">
              {activeNode === "N3" && <circle cx="350" cy="120" r="32" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="350" cy="120" r="24" fill={getNodeFill("N3", false)} stroke={getStroke("N3")} strokeWidth="2.5" className="shadow-xl transition-all duration-500" />
              <text x="350" y="125" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">*</text>
              <text x="350" y="160" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">{nodeValues.N3}</text>
            </g>

            <g className="transition-all duration-500">
              {activeNode === "N4" && <circle cx="280" cy="190" r="32" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="280" cy="190" r="24" fill={getNodeFill("N4", true)} stroke={getStroke("N4")} strokeWidth="2.5" className="shadow-xl transition-all duration-500" />
              <text x="280" y="195" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">5</text>
            </g>

            <g className="transition-all duration-500">
              {activeNode === "N5" && <circle cx="420" cy="190" r="32" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="420" cy="190" r="24" fill={getNodeFill("N5", true)} stroke={getStroke("N5")} strokeWidth="2.5" className="shadow-xl transition-all duration-500" />
              <text x="420" y="195" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">2</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
