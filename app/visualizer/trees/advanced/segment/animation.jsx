"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info,
  RefreshCw
} from "lucide-react";

const DEFAULT_VALUES = [5, 11, 8, 12, 4, 9, 3, 7];

// Build segment tree (sum) over arr (0-indexed)
// Returns tree array (1-indexed), tree[1] = root
function buildSegTree(arr) {
  const n = arr.length;
  const tree = new Array(4 * n).fill(0);
  function build(node, start, end) {
    if (start === end) {
      tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      build(2 * node, start, mid);
      build(2 * node + 1, mid + 1, end);
      tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
  }
  build(1, 0, n - 1);
  return tree;
}

// Collect tree nodes with positions for rendering
function collectNodes(tree, n) {
  const nodes = [];
  function dfs(node, start, end, depth, xMin, xMax) {
    if (start > end || node >= tree.length) return;
    const x = (xMin + xMax) / 2;
    const y = 50 + depth * 90;
    nodes.push({ node, start, end, x, y, value: tree[node] });
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      dfs(2 * node, start, mid, depth + 1, xMin, (xMin + xMax) / 2);
      dfs(2 * node + 1, mid + 1, end, depth + 1, (xMin + xMax) / 2, xMax);
    }
  }
  dfs(1, 0, n - 1, 0, 60, 740);
  return nodes;
}

export default function SegmentAnimation() {
  const [arr, setArr] = useState([...DEFAULT_VALUES]);
  const [tree, setTree] = useState(() => buildSegTree(DEFAULT_VALUES));
  const [mode, setMode] = useState("query"); // "query" | "update"
  const [queryL, setQueryL] = useState("");
  const [queryR, setQueryR] = useState("");
  const [updateIdx, setUpdateIdx] = useState("");
  const [updateVal, setUpdateVal] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState("Build complete! Select a range query or point update to visualize.");
  const [highlightedNodes, setHighlightedNodes] = useState({}); // node -> state
  const [highlightedArray, setHighlightedArray] = useState({});
  const [resultBox, setResultBox] = useState(null);

  const timerRef = useRef(null);
  const n = arr.length;
  const treeNodes = collectNodes(tree, n);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (currentStepIdx < 0 || currentStepIdx >= steps.length) return;
    const step = steps[currentStepIdx];
    setHighlightedNodes(step.highlightedNodes || {});
    setHighlightedArray(step.highlightedArray || {});
    setMessage(step.explanation || "");
    if (step.result !== undefined) setResultBox(step.result);
  }, [currentStepIdx, steps]);

  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;
    if (currentStepIdx >= steps.length - 1) { setIsAnimating(false); return; }
    timerRef.current = setTimeout(() => setCurrentStepIdx(p => p + 1), 1600 / speed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAnimating, currentStepIdx, steps, speed]);

  const pauseVisualizer = () => { setIsAnimating(false); if (timerRef.current) clearTimeout(timerRef.current); };
  const startVisualizer = () => {
    if (steps.length === 0) return;
    setIsAnimating(true);
    const nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };
  const stepForward = () => { setIsAnimating(false); if (currentStepIdx < steps.length - 1) setCurrentStepIdx(p => p + 1); };
  const stepBackward = () => { setIsAnimating(false); if (currentStepIdx > 0) setCurrentStepIdx(p => p - 1); };
  const resetPlayback = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setHighlightedNodes({});
    setHighlightedArray({});
    setResultBox(null);
    setMessage("Playback reset.");
  };

  const handleReset = () => {
    setArr([...DEFAULT_VALUES]);
    setTree(buildSegTree(DEFAULT_VALUES));
    setSteps([]);
    setCurrentStepIdx(-1);
    setHighlightedNodes({});
    setHighlightedArray({});
    setResultBox(null);
    setQueryL(""); setQueryR(""); setUpdateIdx(""); setUpdateVal("");
    setMessage("Tree reset to default. Choose an operation to begin.");
  };

  // === RANGE QUERY ===
  const triggerQuery = () => {
    const l = parseInt(queryL);
    const r = parseInt(queryR);
    if (isNaN(l) || isNaN(r) || l < 0 || r >= n || l > r) {
      setMessage(`⚠️ Enter a valid range (0 ≤ L ≤ R ≤ ${n - 1}).`);
      return;
    }

    setIsAnimating(false);
    setResultBox(null);

    const newSteps = [];
    let totalSum = 0;

    const queryDFS = (node, start, end, qL, qR) => {
      if (qR < start || end < qL) {
        newSteps.push({
          highlightedNodes: { [node]: "error" },
          highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
          explanation: `Node [${start}..${end}] is completely outside query [${qL}..${qR}]. Return 0. (Out-of-range node)`,
          result: undefined
        });
        return 0;
      }
      if (qL <= start && end <= qR) {
        totalSum += tree[node];
        newSteps.push({
          highlightedNodes: { [node]: "matched" },
          highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
          explanation: `Node [${start}..${end}] is completely inside query [${qL}..${qR}]. Include BIT[${node}] = ${tree[node]}.`,
          result: undefined
        });
        return tree[node];
      }
      newSteps.push({
        highlightedNodes: { [node]: "visiting" },
        highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
        explanation: `Node [${start}..${end}] partially overlaps [${qL}..${qR}]. Recurse into both children.`,
        result: undefined
      });
      const mid = Math.floor((start + end) / 2);
      const leftVal = queryDFS(2 * node, start, mid, qL, qR);
      const rightVal = queryDFS(2 * node + 1, mid + 1, end, qL, qR);
      return leftVal + rightVal;
    };

    const result = queryDFS(1, 0, n - 1, l, r);

    newSteps.push({
      highlightedNodes: {},
      highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "matched"])),
      explanation: `✅ Range Sum Query [${l}, ${r}] complete. Result = ${result}.`,
      result: `Sum[${l}..${r}] = ${result}`
    });

    setQueryL(""); setQueryR("");
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // === POINT UPDATE ===
  const triggerUpdate = () => {
    const idx = parseInt(updateIdx);
    const newVal = parseInt(updateVal);
    if (isNaN(idx) || isNaN(newVal) || idx < 0 || idx >= n) {
      setMessage(`⚠️ Enter a valid index (0-${n - 1}) and new value.`);
      return;
    }

    setIsAnimating(false);
    setResultBox(null);

    const newArr = [...arr];
    const oldVal = newArr[idx];
    newArr[idx] = newVal;
    const newTree = buildSegTree(newArr);

    const newSteps = [];
    const delta = newVal - oldVal;

    const updateDFS = (node, start, end, target, delta) => {
      newSteps.push({
        highlightedNodes: { [node]: start === end ? "matched" : "visiting" },
        highlightedArray: { [target]: start === end ? "matched" : "active" },
        explanation: start === end
          ? `Leaf node [${start}]: Update value from ${oldVal} to ${newVal}. Delta = ${delta > 0 ? "+" : ""}${delta}.`
          : `Internal node [${start}..${end}]: Recurse ${target <= Math.floor((start + end) / 2) ? "left" : "right"} toward index ${target}.`,
        result: undefined
      });

      if (start === end) return;
      const mid = Math.floor((start + end) / 2);
      if (target <= mid) updateDFS(2 * node, start, mid, target, delta);
      else updateDFS(2 * node + 1, mid + 1, end, target, delta);
    };

    updateDFS(1, 0, n - 1, idx, delta);

    newSteps.push({
      highlightedNodes: {},
      highlightedArray: { [idx]: "matched" },
      explanation: `✅ Point Update complete. arr[${idx}] = ${oldVal} → ${newVal}. All ancestor nodes updated with delta=${delta}.`,
      result: `Updated arr[${idx}]: ${oldVal} → ${newVal}`
    });

    setArr(newArr);
    setTree(newTree);
    setUpdateIdx(""); setUpdateVal("");
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // Color helpers
  const getNodeColor = (nodeId) => {
    const s = highlightedNodes[nodeId];
    if (s === "visiting") return { fill: "#8b5cf6", stroke: "#c084fc", text: "#fff", glow: true };
    if (s === "matched")  return { fill: "#10b981", stroke: "#34d399", text: "#fff", glow: true };
    if (s === "error")    return { fill: "#ef4444", stroke: "#f87171", text: "#fff", glow: false };
    return { fill: "#1e293b", stroke: "#475569", text: "#e2e8f0", glow: false };
  };

  const getArrayColor = (i) => {
    const s = highlightedArray[i];
    if (s === "active")   return "border-purple-500 bg-purple-900/50 text-purple-100";
    if (s === "matched")  return "border-emerald-500 bg-emerald-900/50 text-emerald-100";
    if (s === "error")    return "border-rose-500 bg-rose-900/50 text-rose-100";
    return "border-slate-700 bg-slate-900 text-slate-300";
  };

  // Build edge list from treeNodes
  const edges = treeNodes
    .filter(node => node.start < node.end)
    .flatMap(parent => {
      const mid = Math.floor((parent.start + parent.end) / 2);
      const leftChild = treeNodes.find(n => n.node === 2 * parent.node && n.start === parent.start && n.end === mid);
      const rightChild = treeNodes.find(n => n.node === 2 * parent.node + 1 && n.start === mid + 1 && n.end === parent.end);
      const edges = [];
      if (leftChild) edges.push({ x1: parent.x, y1: parent.y + 22, x2: leftChild.x, y2: leftChild.y - 22, highlighted: !!highlightedNodes[leftChild.node] });
      if (rightChild) edges.push({ x1: parent.x, y1: parent.y + 22, x2: rightChild.x, y2: rightChild.y - 22, highlighted: !!highlightedNodes[rightChild.node] });
      return edges;
    });

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-7xl mx-auto selection:bg-purple-500/30 selection:text-purple-200">

      {/* Mode Tabs */}
      <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-800">
        {[["query", "Range Query"], ["update", "Point Update"]].map(([val, label]) => (
          <button key={val} onClick={() => { setMode(val); resetPlayback(); }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === val ? "bg-purple-600 text-white shadow-md shadow-purple-950" : "text-slate-400 hover:text-slate-200"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {mode === "query" ? (
            <>
              <input type="number" value={queryL} onChange={e => setQueryL(e.target.value)} placeholder={`L (0-${n-1})`}
                className="w-full sm:w-24 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors" disabled={isAnimating} />
              <input type="number" value={queryR} onChange={e => setQueryR(e.target.value)} placeholder={`R (0-${n-1})`}
                className="w-full sm:w-24 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors" disabled={isAnimating}
                onKeyDown={e => e.key === "Enter" && triggerQuery()} />
              <button onClick={triggerQuery} disabled={isAnimating}
                className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-xl transition-all shadow-md">
                Query Sum
              </button>
            </>
          ) : (
            <>
              <input type="number" value={updateIdx} onChange={e => setUpdateIdx(e.target.value)} placeholder={`Index (0-${n-1})`}
                className="w-full sm:w-28 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors" disabled={isAnimating} />
              <input type="number" value={updateVal} onChange={e => setUpdateVal(e.target.value)} placeholder="New value"
                className="w-full sm:w-28 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors" disabled={isAnimating}
                onKeyDown={e => e.key === "Enter" && triggerUpdate()} />
              <button onClick={triggerUpdate} disabled={isAnimating}
                className="px-4 py-2 text-xs font-bold bg-primary hover:bg-primary-dark disabled:bg-primary-dark/40 disabled:opacity-50 text-white rounded-xl transition-all shadow-md">
                Update
              </button>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button onClick={stepBackward} disabled={currentStepIdx <= 0 || steps.length === 0} className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={isAnimating ? pauseVisualizer : startVisualizer} disabled={steps.length === 0}
              className={`p-2 rounded-xl transition-all ${isAnimating ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/35 border border-amber-800/40" : "bg-purple-600 hover:bg-purple-500 text-white shadow-md disabled:opacity-30"}`}>
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button onClick={stepForward} disabled={steps.length > 0 && currentStepIdx >= steps.length - 1} className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
            <button onClick={resetPlayback} disabled={steps.length === 0} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg disabled:opacity-30"><RotateCcw className="w-4 h-4" /></button>
          </div>
          <button onClick={handleReset} className="px-3.5 py-2 text-xs font-bold text-rose-500 bg-rose-950/20 hover:bg-rose-950/40 rounded-xl transition-all border border-rose-900/30 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-36 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Speed</span>
          <input type="range" min="0.5" max="3" step="0.5" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer" />
          <span className="text-xs font-bold text-purple-400 w-8">{speed}x</span>
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-purple-400" /> Step Explanation</span>
          <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-900">Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}</span>
        </div>
        <div className="text-sm font-medium text-purple-200/90 leading-relaxed min-h-[40px] flex items-center gap-3">
          {message}
          {resultBox && <span className="ml-auto shrink-0 bg-emerald-500/20 border border-emerald-700/40 text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold">{resultBox}</span>}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-4 relative overflow-hidden min-h-[480px] flex flex-col gap-4">

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[{ color: "bg-purple-500", label: "Visiting" }, { color: "bg-emerald-500", label: "In Range / Updated" }, { color: "bg-rose-500", label: "Out of Range" }].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Source Array */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Source Array (0-indexed)</span>
          <div className="flex gap-1.5">
            {arr.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className={`w-12 h-10 flex items-center justify-center border-2 rounded-xl text-sm font-bold transition-all duration-300 ${getArrayColor(i)}`}>{val}</div>
                <span className="text-[10px] text-slate-500 font-mono">[{i}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tree SVG */}
        <div className="overflow-auto flex justify-center">
          <svg width="800" height={50 + Math.ceil(Math.log2(n + 1)) * 90 + 40} viewBox={`0 0 800 ${50 + Math.ceil(Math.log2(n + 1)) * 90 + 40}`} className="max-w-full h-auto">
            {/* Edges */}
            {edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={e.highlighted ? "#8b5cf6" : "#334155"} strokeWidth={e.highlighted ? "2.5" : "1.5"}
                className="transition-all duration-300" />
            ))}
            {/* Nodes */}
            {treeNodes.map(n => {
              const colors = getNodeColor(n.node);
              const isLeaf = n.start === n.end;
              const label = isLeaf ? `${n.value}` : `Σ${n.value}`;
              const sublabel = `[${n.start}..${n.end}]`;
              return (
                <g key={n.node} className="transition-all duration-300">
                  {colors.glow && <circle cx={n.x} cy={n.y} r="28" fill="none" stroke={colors.stroke} strokeWidth="1.5" strokeDasharray="4,2" className="opacity-60" />}
                  <rect x={n.x - 32} y={n.y - 20} width="64" height="40" rx="8"
                    fill={colors.fill} stroke={colors.stroke} strokeWidth="1.5" className="transition-all duration-300" />
                  <text x={n.x} y={n.y + 2} textAnchor="middle" fill={colors.text} fontSize="10" fontWeight="bold">{label}</text>
                  <text x={n.x} y={n.y + 14} textAnchor="middle" fill={colors.text === "#fff" ? "rgba(255,255,255,0.7)" : "#64748b"} fontSize="8">{sublabel}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
