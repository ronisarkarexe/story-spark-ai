"use client";
import React, { useState } from "react";
import { Play, RotateCcw, Info } from "lucide-react";

export default function DecisionTreeAnimation() {
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Classify' to trace a decision path.");
  const [activeNode, setActiveNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [sample, setSample] = useState({ weather: "Rainy", wind: "Strong" });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const classify = async () => {
    setAnimating(true);
    setPrediction(null);
    setMessage(`Classifying instance: { Weather: ${sample.weather}, Wind: ${sample.wind} }`);
    await delay(1500);

    // Root Node
    setActiveNode("N1");
    setMessage("Node N1: What is the Weather?");
    await delay(1500);

    if (sample.weather === "Sunny") {
      setActiveEdge("E1");
      setMessage("Weather is Sunny -> Go Left");
      await delay(1000);
      
      setActiveNode("N2");
      setMessage("Leaf Node N2: Play Tennis = Yes!");
      setPrediction("Yes");
    } else {
      setActiveEdge("E2");
      setMessage("Weather is Rainy -> Go Right");
      await delay(1000);
      
      setActiveNode("N3");
      setMessage("Node N3: What is the Wind?");
      await delay(1500);

      if (sample.wind === "Weak") {
        setActiveEdge("E3");
        setMessage("Wind is Weak -> Go Left");
        await delay(1000);

        setActiveNode("N4");
        setMessage("Leaf Node N4: Play Tennis = Yes!");
        setPrediction("Yes");
      } else {
        setActiveEdge("E4");
        setMessage("Wind is Strong -> Go Right");
        await delay(1000);

        setActiveNode("N5");
        setMessage("Leaf Node N5: Play Tennis = No!");
        setPrediction("No");
      }
    }
    
    setAnimating(false);
  };

  const handleReset = () => {
    setAnimating(false);
    setActiveNode(null);
    setActiveEdge(null);
    setPrediction(null);
    setMessage("Click 'Classify' to trace a decision path.");
  };

  const toggleSample = () => {
    if (sample.weather === "Sunny") {
      setSample({ weather: "Rainy", wind: "Weak" });
    } else if (sample.weather === "Rainy" && sample.wind === "Weak") {
      setSample({ weather: "Rainy", wind: "Strong" });
    } else {
      setSample({ weather: "Sunny", wind: "Strong" });
    }
    handleReset();
  };

  // Node styles
  const getFill = (id, isLeaf, color) => {
    if (activeNode === id) return "#a855f7";
    if (isLeaf) return color || "#1e1b4b";
    return "#4c1d95";
  };

  const getStroke = (id) => {
    if (activeNode === id) return "#d8b4fe";
    return "#7e22ce";
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-5xl mx-auto">
      
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-lg shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-slate-400">Current Sample: </div>
          <button 
            onClick={toggleSample}
            disabled={animating}
            className="px-3 py-1.5 bg-slate-800 text-purple-300 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors"
          >
            Weather: {sample.weather}, Wind: {sample.wind}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={classify} 
            disabled={animating}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <Play className="w-4 h-4" /> Classify
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
          <svg width="600" height="300" viewBox="0 0 600 300" className="max-w-full h-auto drop-shadow-xl">
            {/* Edges */}
            <g>
              <line x1="300" y1="60" x2="150" y2="150" stroke={activeEdge === "E1" ? "#a855f7" : "#475569"} strokeWidth={activeEdge === "E1" ? "4" : "2"} className="transition-all duration-500" />
              <line x1="300" y1="60" x2="450" y2="150" stroke={activeEdge === "E2" ? "#a855f7" : "#475569"} strokeWidth={activeEdge === "E2" ? "4" : "2"} className="transition-all duration-500" />
              <line x1="450" y1="150" x2="350" y2="240" stroke={activeEdge === "E3" ? "#a855f7" : "#475569"} strokeWidth={activeEdge === "E3" ? "4" : "2"} className="transition-all duration-500" />
              <line x1="450" y1="150" x2="550" y2="240" stroke={activeEdge === "E4" ? "#a855f7" : "#475569"} strokeWidth={activeEdge === "E4" ? "4" : "2"} className="transition-all duration-500" />
              
              <text x="210" y="95" fill="#94a3b8" fontSize="12" fontWeight="bold">Sunny</text>
              <text x="390" y="95" fill="#94a3b8" fontSize="12" fontWeight="bold">Rainy</text>
              <text x="380" y="190" fill="#94a3b8" fontSize="12" fontWeight="bold">Weak</text>
              <text x="510" y="190" fill="#94a3b8" fontSize="12" fontWeight="bold">Strong</text>
            </g>

            {/* Nodes */}
            <g className="transition-all duration-500">
              {activeNode === "N1" && <rect x="230" y="40" width="140" height="40" rx="20" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <rect x="240" y="40" width="120" height="40" rx="20" fill={getFill("N1", false)} stroke={getStroke("N1")} strokeWidth="2.5" className="transition-all duration-500" />
              <text x="300" y="65" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Weather?</text>
            </g>

            <g className="transition-all duration-500">
              <rect x="100" y="130" width="100" height="40" rx="8" fill={getFill("N2", true, "#065f46")} stroke={getStroke("N2")} strokeWidth="2.5" className="transition-all duration-500" />
              <text x="150" y="155" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Yes</text>
            </g>

            <g className="transition-all duration-500">
              <rect x="390" y="130" width="120" height="40" rx="20" fill={getFill("N3", false)} stroke={getStroke("N3")} strokeWidth="2.5" className="transition-all duration-500" />
              <text x="450" y="155" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Wind?</text>
            </g>

            <g className="transition-all duration-500">
              <rect x="300" y="220" width="100" height="40" rx="8" fill={getFill("N4", true, "#065f46")} stroke={getStroke("N4")} strokeWidth="2.5" className="transition-all duration-500" />
              <text x="350" y="245" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">Yes</text>
            </g>

            <g className="transition-all duration-500">
              <rect x="500" y="220" width="100" height="40" rx="8" fill={getFill("N5", true, "#991b1b")} stroke={getStroke("N5")} strokeWidth="2.5" className="transition-all duration-500" />
              <text x="550" y="245" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">No</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
