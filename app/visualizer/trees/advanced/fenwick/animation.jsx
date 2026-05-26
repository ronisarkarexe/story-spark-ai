"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  RefreshCw
} from "lucide-react";

const DEFAULT_ARRAY = [0, 5, 3, 7, 2, 6, 4, 8, 1]; // 1-indexed, index 0 unused

function buildBIT(arr) {
  const n = arr.length - 1;
  const bit = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    let j = i;
    while (j <= n) {
      bit[j] += arr[i];
      j += j & -j;
    }
  }
  return bit;
}

export default function FenwickAnimation() {
  const [baseArray, setBaseArray] = useState([...DEFAULT_ARRAY]);
  const [bit, setBit] = useState(() => buildBIT(DEFAULT_ARRAY));
  const [inputIndex, setInputIndex] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [queryL, setQueryL] = useState("");
  const [queryR, setQueryR] = useState("");
  const [mode, setMode] = useState("update"); // "update" | "query"
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState("Enter an index & value to perform a point update, or query a range prefix sum.");
  const [highlightedBIT, setHighlightedBIT] = useState({}); // {index: state}
  const [highlightedBase, setHighlightedBase] = useState({});
  const [resultBox, setResultBox] = useState(null);

  const timerRef = useRef(null);
  const n = baseArray.length - 1;

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Apply current step's highlight state
  useEffect(() => {
    if (currentStepIdx < 0 || currentStepIdx >= steps.length) return;
    const step = steps[currentStepIdx];
    setHighlightedBIT(step.highlightedBIT || {});
    setHighlightedBase(step.highlightedBase || {});
    setMessage(step.explanation || "");
    if (step.result !== undefined) setResultBox(step.result);
  }, [currentStepIdx, steps]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;
    if (currentStepIdx >= steps.length - 1) {
      setIsAnimating(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setCurrentStepIdx(prev => prev + 1);
    }, 1600 / speed);
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
    setHighlightedBIT({});
    setHighlightedBase({});
    setResultBox(null);
    setMessage("Playback reset. Click play to begin.");
  };

  const handleReset = () => {
    setIsAnimating(false);
    setBaseArray([...DEFAULT_ARRAY]);
    setBit(buildBIT(DEFAULT_ARRAY));
    setSteps([]);
    setCurrentStepIdx(-1);
    setHighlightedBIT({});
    setHighlightedBase({});
    setResultBox(null);
    setInputIndex(""); setInputValue(""); setQueryL(""); setQueryR("");
    setMessage("Tree reset to default. Enter values to start a new operation.");
  };

  // === POINT UPDATE ===
  const triggerUpdate = () => {
    const idx = parseInt(inputIndex);
    const delta = parseInt(inputValue);
    if (isNaN(idx) || idx < 1 || idx > n || isNaN(delta)) {
      setMessage(`⚠️ Please enter a valid index (1-${n}) and a numeric delta value.`);
      return;
    }

    setIsAnimating(false);
    setResultBox(null);

    const newBase = [...baseArray];
    newBase[idx] += delta;
    const newBit = buildBIT(newBase.slice(1).reduce((acc, v, i) => { acc[i + 1] = v; return acc; }, [0, ...newBase.slice(1)]));

    const newSteps = [];
    let i = idx;
    const tempBit = [...bit];

    newSteps.push({
      highlightedBIT: { [idx]: "visiting" },
      highlightedBase: { [idx]: "visiting" },
      explanation: `Point Update: Add delta=${delta} to index ${idx}. Binary: ${idx.toString(2).padStart(4, '0')}. Start updating BIT[${idx}].`,
      result: undefined
    });

    while (i <= n) {
      const lsb = i & -i;
      const prevVal = tempBit[i];
      tempBit[i] += delta;

      newSteps.push({
        highlightedBIT: { [i]: "active" },
        highlightedBase: { [idx]: "active" },
        explanation: `BIT[${i}] (binary: ${i.toString(2).padStart(4,'0')}) += ${delta}. LSB(${i}) = ${lsb}. New BIT[${i}] = ${tempBit[i]}. Next: i = ${i} + ${lsb} = ${i + lsb}.`,
        result: undefined
      });

      i += lsb;
      if (i <= n) {
        newSteps.push({
          highlightedBIT: { [i]: "visiting" },
          highlightedBase: { [idx]: "active" },
          explanation: `Move to BIT[${i}] (binary: ${i.toString(2).padStart(4, '0')}). LSB propagates up the implicit tree.`,
          result: undefined
        });
      }
    }

    newSteps.push({
      highlightedBIT: {},
      highlightedBase: { [idx]: "matched" },
      explanation: `✅ Point Update complete! Index ${idx} in the source array now has value ${newBase[idx]} (was ${baseArray[idx]}). All affected BIT nodes updated.`,
      result: `Updated index ${idx}: ${baseArray[idx]} → ${newBase[idx]}`
    });

    setBaseArray(newBase);
    setBit(newBit);
    setInputIndex(""); setInputValue("");
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // === PREFIX SUM QUERY ===
  const triggerQuery = () => {
    const l = parseInt(queryL);
    const r = parseInt(queryR);
    if (isNaN(l) || isNaN(r) || l < 1 || r > n || l > r) {
      setMessage(`⚠️ Please enter a valid range (1 ≤ L ≤ R ≤ ${n}).`);
      return;
    }

    setIsAnimating(false);
    setResultBox(null);

    const prefixSum = (endIdx) => {
      let sum = 0;
      let i = endIdx;
      const trace = [];
      while (i > 0) {
        trace.push({ i, val: bit[i], lsb: i & -i });
        sum += bit[i];
        i -= i & -i;
      }
      return { sum, trace };
    };

    const { sum: sumR, trace: traceR } = prefixSum(r);
    const { sum: sumL1, trace: traceL1 } = prefixSum(l - 1);
    const result = sumR - sumL1;

    const newSteps = [];

    newSteps.push({
      highlightedBIT: {},
      highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "visiting"])),
      explanation: `Range Sum Query [${l}, ${r}]: Compute prefix(${r}) - prefix(${l - 1}). Two prefix sums are needed.`,
      result: undefined
    });

    // Trace prefix(r)
    for (const { i, val, lsb } of traceR) {
      newSteps.push({
        highlightedBIT: { [i]: "active" },
        highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, k) => [l + k, "active"])),
        explanation: `prefix(${r}) step: BIT[${i}] = ${val}. LSB(${i}) = ${lsb}. Binary: ${i.toString(2).padStart(4, '0')}. Accumulate → next: i = ${i} - ${lsb} = ${i - lsb}.`,
        result: undefined
      });
    }

    newSteps.push({
      highlightedBIT: {},
      highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
      explanation: `prefix(${r}) = ${sumR}. Now compute prefix(${l - 1}) to subtract.`,
      result: undefined
    });

    if (l - 1 > 0) {
      for (const { i, val, lsb } of traceL1) {
        newSteps.push({
          highlightedBIT: { [i]: "visiting" },
          highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, k) => [l + k, "active"])),
          explanation: `prefix(${l - 1}) step: BIT[${i}] = ${val}. LSB(${i}) = ${lsb}. Binary: ${i.toString(2).padStart(4, '0')}. Accumulate → next: i = ${i} - ${lsb} = ${i - lsb}.`,
          result: undefined
        });
      }
    }

    newSteps.push({
      highlightedBIT: {},
      highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "matched"])),
      explanation: `✅ Range Sum [${l}, ${r}] = prefix(${r}) - prefix(${l - 1}) = ${sumR} - ${sumL1} = ${result}.`,
      result: `Sum[${l}..${r}] = ${result}`
    });

    setQueryL(""); setQueryR("");
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // Color helpers
  const getBITColor = (i) => {
    const state = highlightedBIT[i];
    if (state === "active") return { fill: "#10b981", stroke: "#34d399", text: "#fff" };
    if (state === "visiting") return { fill: "#8b5cf6", stroke: "#c084fc", text: "#fff" };
    if (state === "matched") return { fill: "#f59e0b", stroke: "#fbbf24", text: "#1a1a1a" };
    return { fill: "#1e293b", stroke: "#475569", text: "#e2e8f0" };
  };

  const getBaseColor = (i) => {
    const state = highlightedBase[i];
    if (state === "active") return "border-emerald-500 bg-emerald-900/50 text-emerald-100";
    if (state === "visiting") return "border-purple-500 bg-purple-900/50 text-purple-100";
    if (state === "matched") return "border-amber-500 bg-amber-900/50 text-amber-100";
    return "border-slate-700 bg-slate-900 text-slate-300";
  };

  const cellW = 72;
  const cellH = 46;
  const svgPaddingX = 30;
  const svgWidth = n * cellW + svgPaddingX * 2 + 20;

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-7xl mx-auto selection:bg-purple-500/30 selection:text-purple-200">

      {/* Mode Tabs */}
      <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-800">
        <button
          onClick={() => { setMode("update"); resetPlayback(); }}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === "update" ? "bg-purple-600 text-white shadow-md shadow-purple-950" : "text-slate-400 hover:text-slate-200"}`}
        >
          Point Update
        </button>
        <button
          onClick={() => { setMode("query"); resetPlayback(); }}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === "query" ? "bg-purple-600 text-white shadow-md shadow-purple-950" : "text-slate-400 hover:text-slate-200"}`}
        >
          Range Query
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {mode === "update" ? (
            <>
              <input
                type="number"
                value={inputIndex}
                onChange={(e) => setInputIndex(e.target.value)}
                placeholder={`Index (1-${n})`}
                className="w-full sm:w-28 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isAnimating}
              />
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Delta (e.g. +3)"
                className="w-full sm:w-28 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isAnimating}
                onKeyDown={(e) => e.key === "Enter" && triggerUpdate()}
              />
              <button
                onClick={triggerUpdate}
                disabled={isAnimating}
                className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-xl transition-all shadow-md shadow-purple-950/20"
              >
                Update
              </button>
            </>
          ) : (
            <>
              <input
                type="number"
                value={queryL}
                onChange={(e) => setQueryL(e.target.value)}
                placeholder={`L (1-${n})`}
                className="w-full sm:w-24 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isAnimating}
              />
              <input
                type="number"
                value={queryR}
                onChange={(e) => setQueryR(e.target.value)}
                placeholder={`R (1-${n})`}
                className="w-full sm:w-24 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isAnimating}
                onKeyDown={(e) => e.key === "Enter" && triggerQuery()}
              />
              <button
                onClick={triggerQuery}
                disabled={isAnimating}
                className="px-4 py-2 text-xs font-bold bg-primary hover:bg-primary-dark disabled:bg-primary-dark/40 disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
              >
                Query Sum
              </button>
            </>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button onClick={stepBackward} disabled={currentStepIdx <= 0 || steps.length === 0} className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded-lg" title="Previous Step">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={isAnimating ? pauseVisualizer : startVisualizer}
              disabled={steps.length === 0}
              className={`p-2 rounded-xl transition-all ${isAnimating ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/35 border border-amber-800/40" : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950 disabled:opacity-30"}`}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button onClick={stepForward} disabled={steps.length > 0 && currentStepIdx >= steps.length - 1} className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded-lg" title="Next Step">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={resetPlayback} disabled={steps.length === 0} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg disabled:opacity-30" title="Reset Playback">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button onClick={handleReset} className="px-3.5 py-2 text-xs font-bold text-rose-500 bg-rose-950/20 hover:bg-rose-950/40 rounded-xl transition-all border border-rose-900/30 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-3 w-full md:w-36 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Speed</span>
          <input type="range" min="0.5" max="3" step="0.5" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer" />
          <span className="text-xs font-bold text-purple-400 w-8">{speed}x</span>
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple-400" /> Step Explanation
          </span>
          <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-900">
            Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
          </span>
        </div>
        <div className="text-sm font-medium text-purple-200/90 leading-relaxed min-h-[40px] flex items-center gap-3">
          {message}
          {resultBox && (
            <span className="ml-auto shrink-0 bg-amber-500/20 border border-amber-700/40 text-amber-300 px-3 py-1 rounded-xl text-xs font-bold">
              {resultBox}
            </span>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-6 min-h-[420px]">

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs absolute top-4 left-4">
          {[
            { color: "bg-purple-500", label: "Visiting" },
            { color: "bg-emerald-500", label: "Processing" },
            { color: "bg-amber-500", label: "Matched" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-8 overflow-auto items-center">
          {/* Source Array Display */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Source Array (1-indexed)</span>
            <div className="flex gap-1.5">
              {baseArray.slice(1).map((val, i) => {
                const idx = i + 1;
                return (
                  <div key={idx} className="flex flex-col items-center gap-0.5">
                    <div className={`w-14 h-10 flex items-center justify-center border-2 rounded-xl text-sm font-bold transition-all duration-300 ${getBaseColor(idx)}`}>
                      {val}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">[{idx}]</span>
                    <span className="text-[9px] text-slate-600 font-mono">{idx.toString(2).padStart(4, '0')}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BIT Array Display as bars + labeled cells */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">BIT Array — Implicit Fenwick Structure</span>
            <div className="overflow-auto">
              <svg width={svgWidth} height={220} viewBox={`0 0 ${svgWidth} 220`} className="max-w-full h-auto">
                {bit.slice(1).map((val, i) => {
                  const idx = i + 1;
                  const lsb = idx & -idx;
                  const barMaxH = 100;
                  const barH = Math.max(12, Math.min(barMaxH, (val / Math.max(...bit.slice(1))) * barMaxH));
                  const x = svgPaddingX + i * cellW;
                  const y = 130 - barH;
                  const colors = getBITColor(idx);

                  return (
                    <g key={idx}>
                      {/* Bar */}
                      <rect
                        x={x + 8}
                        y={y}
                        width={cellW - 16}
                        height={barH}
                        rx="4"
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth="1.5"
                        className="transition-all duration-300"
                      />
                      {/* Value inside bar */}
                      <text x={x + cellW / 2} y={y + barH / 2 + 4} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="bold">{val}</text>
                      {/* Index label */}
                      <text x={x + cellW / 2} y="153" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">[{idx}]</text>
                      {/* Binary label */}
                      <text x={x + cellW / 2} y="170" textAnchor="middle" fill="#475569" fontSize="8.5">{idx.toString(2).padStart(4, '0')}</text>
                      {/* LSB label */}
                      <text x={x + cellW / 2} y="185" textAnchor="middle" fill="#6366f1" fontSize="8.5" fontWeight="bold">LSB:{lsb}</text>
                      {/* Range covered */}
                      <text x={x + cellW / 2} y="200" textAnchor="middle" fill="#334155" fontSize="7.5">[{idx - lsb + 1}..{idx}]</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* LSB formula reminder */}
        <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono">
          <span className="text-purple-400 font-bold">LSB(i)</span>
          <span className="text-slate-400"> = i & (-i)</span>
        </div>
      </div>
    </div>
  );
}
