"use client";
import React, { useState } from "react";
import { Play, RotateCcw, Info } from "lucide-react";

export default function HeapSortAnimation() {
  const initialArray = [7, 1, 8, 5, 2];
  const [array, setArray] = useState([...initialArray]);
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Start Sort' to visualize Heap Sort.");
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [heapSize, setHeapSize] = useState(initialArray.length);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const heapify = async (arr, n, i, sorted, setArr, setMsg, setActives) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    setActives([i]);
    setMsg(`Checking node ${arr[i]} at index ${i}`);
    await delay(1000);

    if (left < n) {
      setActives([i, left]);
      setMsg(`Comparing ${arr[largest]} with left child ${arr[left]}`);
      await delay(1000);
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      setActives([largest, right]);
      setMsg(`Comparing ${arr[largest]} with right child ${arr[right]}`);
      await delay(1000);
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      setActives([i, largest]);
      setMsg(`Swapping ${arr[i]} and ${arr[largest]}`);
      await delay(1000);
      
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      
      setArr([...arr]);
      await heapify(arr, n, largest, sorted, setArr, setMsg, setActives);
    }
  };

  const startHeapSort = async () => {
    setAnimating(true);
    let arr = [...array];
    let n = arr.length;
    let sorted = [];
    
    setSortedIndices([]);
    setHeapSize(n);

    setMessage("Phase 1: Build Max-Heap");
    await delay(1000);

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i, sorted, setArray, setMessage, setActiveIndices);
    }

    setMessage("Max-Heap built successfully!");
    await delay(1500);

    setMessage("Phase 2: Extract max and shrink heap");
    await delay(1000);

    for (let i = n - 1; i > 0; i--) {
      setActiveIndices([0, i]);
      setMessage(`Swapping root (Max: ${arr[0]}) with last heap element ${arr[i]}`);
      await delay(1500);

      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;

      setArray([...arr]);
      sorted.push(i);
      setSortedIndices([...sorted]);
      setHeapSize(i);
      
      setMessage(`Element ${arr[i]} is now in its sorted position.`);
      await delay(1000);

      await heapify(arr, i, 0, sorted, setArray, setMessage, setActiveIndices);
    }
    
    sorted.push(0);
    setSortedIndices([...sorted]);
    setHeapSize(0);
    setActiveIndices([]);
    setMessage("Heap Sort complete!");
    setAnimating(false);
  };

  const handleReset = () => {
    setAnimating(false);
    setArray([...initialArray]);
    setActiveIndices([]);
    setSortedIndices([]);
    setHeapSize(initialArray.length);
    setMessage("Click 'Start Sort' to visualize Heap Sort.");
  };

  // SVG Helper
  const getNodeColor = (index) => {
    if (sortedIndices.includes(index)) return "#3b0764"; // sorted
    if (activeIndices.includes(index)) return "#a855f7"; // active
    if (index >= heapSize) return "#0f172a"; // outside heap but not sorted yet? (Shouldn't happen)
    return "#4c1d95"; // in heap
  };
  
  const getStrokeColor = (index) => {
    if (sortedIndices.includes(index)) return "#581c87";
    if (activeIndices.includes(index)) return "#d8b4fe";
    return "#7e22ce";
  };

  // Node positions for a tree of size 5
  // 0: root
  // 1: left child of 0
  // 2: right child of 0
  // 3: left child of 1
  // 4: right child of 1
  const positions = [
    { x: 400, y: 50 },
    { x: 250, y: 140 },
    { x: 550, y: 140 },
    { x: 150, y: 230 },
    { x: 350, y: 230 }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-lg shadow-black/20">
        <div className="text-sm font-bold text-slate-400">Array: [{initialArray.join(", ")}]</div>
        <div className="flex items-center gap-3">
          <button 
            onClick={startHeapSort} 
            disabled={animating}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <Play className="w-4 h-4" /> Start Sort
          </button>
          <button 
            onClick={handleReset} 
            className="px-4 py-2.5 text-sm font-bold text-purple-400 bg-purple-950/20 hover:bg-purple-950/40 rounded-xl transition-all border border-purple-900/30 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex items-center text-xs text-slate-400 font-semibold gap-1.5">
          <Info className="w-4 h-4 text-purple-400" /> Animation Status
        </div>
        <div className="text-sm font-medium text-purple-200/90 leading-relaxed min-h-[20px]">{message}</div>
      </div>

      {/* Array View */}
      <div className="flex justify-center gap-2">
        {array.map((val, idx) => (
          <div 
            key={idx} 
            className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded-lg border-2 ${
              sortedIndices.includes(idx) ? "bg-purple-900 border-purple-800 text-purple-300" :
              activeIndices.includes(idx) ? "bg-purple-600 border-purple-400 text-white scale-110 shadow-lg shadow-purple-500/50" :
              "bg-slate-800 border-slate-700 text-slate-300"
            } transition-all duration-300`}
          >
            {val}
          </div>
        ))}
      </div>

      {/* Tree SVG */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-4 min-h-[350px]">
        <div className="overflow-auto flex justify-center mt-6">
          <svg width="800" height="300" viewBox="0 0 800 300" className="max-w-full h-auto drop-shadow-xl">
            {/* Edges */}
            {array.map((_, i) => {
              const left = 2 * i + 1;
              const right = 2 * i + 2;
              const edges = [];
              if (left < array.length) {
                edges.push(
                  <line 
                    key={`${i}-${left}`}
                    x1={positions[i].x} y1={positions[i].y + 20}
                    x2={positions[left].x} y2={positions[left].y - 20}
                    stroke={sortedIndices.includes(left) || sortedIndices.includes(i) ? "#334155" : "#64748b"}
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                );
              }
              if (right < array.length) {
                edges.push(
                  <line 
                    key={`${i}-${right}`}
                    x1={positions[i].x} y1={positions[i].y + 20}
                    x2={positions[right].x} y2={positions[right].y - 20}
                    stroke={sortedIndices.includes(right) || sortedIndices.includes(i) ? "#334155" : "#64748b"}
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                );
              }
              return edges;
            })}

            {/* Nodes */}
            {array.map((val, i) => {
              const isSorted = sortedIndices.includes(i);
              return (
                <g key={i} className={`transition-all duration-500 ${isSorted ? "opacity-50" : ""}`}>
                  {activeIndices.includes(i) && <circle cx={positions[i].x} cy={positions[i].y} r="32" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  <circle 
                    cx={positions[i].x} cy={positions[i].y} r="24" 
                    fill={getNodeColor(i)} 
                    stroke={getStrokeColor(i)} 
                    strokeWidth="2.5" 
                    className="shadow-xl transition-all duration-500" 
                  />
                  <text x={positions[i].x} y={positions[i].y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">{val}</text>
                  <text x={positions[i].x + 35} y={positions[i].y + 5} fill="#94a3b8" fontSize="12">[{i}]</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
