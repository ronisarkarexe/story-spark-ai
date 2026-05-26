"use client";
import React, { useState } from "react";
import { Play, RotateCcw, Info, FileDown, FileUp } from "lucide-react";

const NODES = [
  { id: "1", val: "1", x: 400, y: 60, parent: null },
  { id: "2", val: "2", x: 250, y: 150, parent: "1", isLeft: true },
  { id: "3", val: "3", x: 550, y: 150, parent: "1", isLeft: false },
  { id: "4", val: "4", x: 450, y: 240, parent: "3", isLeft: true },
  { id: "5", val: "5", x: 650, y: 240, parent: "3", isLeft: false },
];

const EDGES = NODES.filter(n => n.parent).map(n => {
  const p = NODES.find(parent => parent.id === n.parent);
  return { id: `${p.id}-${n.id}`, x1: p.x, y1: p.y + 20, x2: n.x, y2: n.y - 20, parent: p.id, child: n.id };
});

// Pre-order traversal with nulls
// 1 -> 2 -> N -> N -> 3 -> 4 -> N -> N -> 5 -> N -> N
const SEQUENCE = [
  { type: "node", id: "1", val: "1" },
  { type: "node", id: "2", val: "2" },
  { type: "null", parent: "2", dir: "left" },
  { type: "null", parent: "2", dir: "right" },
  { type: "node", id: "3", val: "3" },
  { type: "node", id: "4", val: "4" },
  { type: "null", parent: "4", dir: "left" },
  { type: "null", parent: "4", dir: "right" },
  { type: "node", id: "5", val: "5" },
  { type: "null", parent: "5", dir: "left" },
  { type: "null", parent: "5", dir: "right" },
];

export default function SerializationAnimation() {
  const [animating, setAnimating] = useState(false);
  const [mode, setMode] = useState("idle"); // idle, serializing, deserializing
  const [message, setMessage] = useState("Click 'Serialize' to start flattening the tree into a string.");
  
  const [activeStep, setActiveStep] = useState(-1);
  const [serializedArray, setSerializedArray] = useState([]);
  
  // Deserialization specific
  const [builtNodes, setBuiltNodes] = useState([]);
  const [builtEdges, setBuiltEdges] = useState([]);

  const handleSerialize = () => {
    setAnimating(true);
    setMode("serializing");
    setActiveStep(-1);
    setSerializedArray([]);
    setBuiltNodes([]);
    setBuiltEdges([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < SEQUENCE.length) {
        setActiveStep(step);
        setSerializedArray(prev => [...prev, SEQUENCE[step].val || "N"]);
        
        if (SEQUENCE[step].type === "node") {
            setMessage(`Visiting Node ${SEQUENCE[step].val}. Appending to string.`);
        } else {
            setMessage(`Visiting Null child of Node ${SEQUENCE[step].parent}. Appending 'N'.`);
        }
        
        step++;
      } else {
        clearInterval(interval);
        setAnimating(false);
        setActiveStep(-1);
        setMessage("Serialization Complete! Click 'Deserialize' to reconstruct the tree from the string.");
      }
    }, 1000);
  };

  const handleDeserialize = () => {
    setAnimating(true);
    setMode("deserializing");
    setActiveStep(-1);
    setBuiltNodes([]);
    setBuiltEdges([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < SEQUENCE.length) {
        setActiveStep(step);
        
        if (SEQUENCE[step].type === "node") {
            setMessage(`Reading '${SEQUENCE[step].val}'. Creating Node ${SEQUENCE[step].val}.`);
            setBuiltNodes(prev => [...prev, SEQUENCE[step].id]);
            if (SEQUENCE[step].parent) {
                setBuiltEdges(prev => [...prev, `${SEQUENCE[step].parent}-${SEQUENCE[step].id}`]);
            }
        } else {
            setMessage(`Reading 'N'. Returning null to parent ${SEQUENCE[step].parent}.`);
        }
        
        step++;
      } else {
        clearInterval(interval);
        setAnimating(false);
        setActiveStep(-1);
        setMessage("Deserialization Complete! The tree has been reconstructed.");
      }
    }, 1000);
  };

  const handleReset = () => {
    setAnimating(false);
    setMode("idle");
    setActiveStep(-1);
    setSerializedArray([]);
    setBuiltNodes([]);
    setBuiltEdges([]);
    setMessage("Click 'Serialize' to start flattening the tree into a string.");
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-5xl mx-auto selection:bg-[#a435f0]/30 selection:text-[#c27cf7]">
      
      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-wrap gap-4 justify-between items-center shadow-lg shadow-black/20">
        
        {/* Output Array Visualization */}
        <div className="flex-1 bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto min-h-[60px]">
            {serializedArray.length === 0 && mode === "idle" && <span className="text-slate-500 text-sm italic">Serialized string will appear here...</span>}
            {serializedArray.map((val, idx) => (
                <div key={idx} className={`w-8 h-8 flex items-center justify-center font-mono font-bold rounded shadow-sm text-sm shrink-0 transition-all ${
                    idx === activeStep 
                    ? "bg-orange-500 text-white scale-110" 
                    : val === "N" 
                        ? "bg-slate-800 text-slate-400" 
                        : "bg-orange-950/50 text-[#a435f0] border border-orange-900/50"
                }`}>
                    {val}
                </div>
            ))}
            {serializedArray.length > 0 && <span className="text-orange-500 font-mono text-xl ml-2 animate-pulse">_</span>}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSerialize} 
            disabled={animating || mode === "serializing" || serializedArray.length === SEQUENCE.length}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-primary hover:bg-primary-dark disabled:bg-primary-dark/40 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <FileDown className="w-4 h-4" /> Serialize
          </button>
          
          <button 
            onClick={handleDeserialize} 
            disabled={animating || serializedArray.length !== SEQUENCE.length || mode === "deserializing"}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-primary hover:bg-primary-dark disabled:bg-primary-dark/40 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <FileUp className="w-4 h-4" /> Deserialize
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
        <div className="text-sm font-medium text-orange-200/90 leading-relaxed min-h-[20px]">{message}</div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-4 min-h-[400px]">
        <div className="overflow-auto flex justify-center mt-6">
          <svg width="800" height="350" viewBox="0 0 800 350" className="max-w-full h-auto drop-shadow-xl">
            
            {/* Edges */}
            {EDGES.map(e => {
              const isVisible = mode === "serializing" || mode === "idle" || builtEdges.includes(e.id);
              const isActive = mode === "serializing" && activeStep >= 0 && (
                  (SEQUENCE[activeStep].id === e.child) || 
                  (SEQUENCE[activeStep].parent === e.parent && SEQUENCE[activeStep].type === "null")
              );
              
              if (!isVisible) return null;

              return (
                <line 
                  key={e.id} 
                  x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
                  stroke={isActive ? "#f97316" : "#334155"} 
                  strokeWidth={isActive ? "4" : "2"}
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const isVisible = mode === "serializing" || mode === "idle" || builtNodes.includes(node.id);
              const isActive = mode === "serializing" && activeStep >= 0 && SEQUENCE[activeStep].id === node.id;
              const isDeserializingActive = mode === "deserializing" && activeStep >= 0 && SEQUENCE[activeStep].id === node.id;
              
              if (!isVisible) return null;

              let stroke = "#475569";
              let fill = "#0f172a";
              
              if (isActive || isDeserializingActive) {
                stroke = "#f97316";
                fill = "#7c2d12";
              } else if (builtNodes.includes(node.id)) {
                 stroke = "#ea580c";
              }

              return (
                <g key={node.id} className="transition-all duration-500">
                  {(isActive || isDeserializingActive) && <circle cx={node.x} cy={node.y} r="32" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  <circle cx={node.x} cy={node.y} r="26" fill={fill} stroke={stroke} strokeWidth="2.5" className="shadow-xl" />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">{node.val}</text>
                </g>
              );
            })}

            {/* Null pointers visualization (only show active ones) */}
            {activeStep >= 0 && SEQUENCE[activeStep].type === "null" && (
                <g className="transition-all duration-500">
                    {(() => {
                        const parentNode = NODES.find(n => n.id === SEQUENCE[activeStep].parent);
                        const dx = SEQUENCE[activeStep].dir === "left" ? -40 : 40;
                        const dy = 50;
                        return (
                            <>
                                <line x1={parentNode.x} y1={parentNode.y + 20} x2={parentNode.x + dx} y2={parentNode.y + dy} stroke="#f97316" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse"/>
                                <circle cx={parentNode.x + dx} cy={parentNode.y + dy} r="15" fill="#0f172a" stroke="#f97316" strokeWidth="2" />
                                <text x={parentNode.x + dx} y={parentNode.y + dy + 4} textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="bold" fontFamily="monospace">N</text>
                            </>
                        )
                    })()}
                </g>
            )}

          </svg>
        </div>
      </div>
    </div>
  );
}
