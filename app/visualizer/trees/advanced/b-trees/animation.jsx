"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info,
  RefreshCw,
  Plus,
  Search
} from "lucide-react";

// === B-Tree Implementation (order t, min t-1 keys, max 2t-1 keys) ===
const T = 2; // Min degree (B-Tree of order 4: max 3 keys per node, max 4 children)

let nodeIdCounter = 0;
function makeNode(isLeaf = true) {
  return { id: `btn-${++nodeIdCounter}`, keys: [], children: [], isLeaf };
}

function cloneTree(node) {
  if (!node) return null;
  return {
    id: node.id,
    keys: [...node.keys],
    children: node.children.map(cloneTree),
    isLeaf: node.isLeaf
  };
}

class BTreeManager {
  constructor() {
    this.root = makeNode(true);
  }

  clone() {
    const mgr = new BTreeManager();
    mgr.root = cloneTree(this.root);
    return mgr;
  }

  // Returns array of steps [{tree, highlighted, explanation}]
  insert(key, steps = []) {
    steps.push({
      tree: cloneTree(this.root),
      highlighted: {},
      explanation: `Insert key ${key} into B-Tree (order ${2 * T}). Max keys per node: ${2 * T - 1}.`
    });

    if (this.root.keys.length === 2 * T - 1) {
      // Root is full: split
      const newRoot = makeNode(false);
      newRoot.children.push(this.root);
      this.root = newRoot;

      steps.push({
        tree: cloneTree(this.root),
        highlighted: { [newRoot.id]: "visiting" },
        explanation: `Root is full (${2 * T - 1} keys). Create a new root and split the old root.`
      });

      this._splitChild(this.root, 0, steps);

      steps.push({
        tree: cloneTree(this.root),
        highlighted: { [this.root.id]: "active" },
        explanation: `Old root split. New root created. Tree height increased by 1.`
      });
    }

    this._insertNonFull(this.root, key, steps);

    steps.push({
      tree: cloneTree(this.root),
      highlighted: {},
      explanation: `✅ Key ${key} successfully inserted into the B-Tree!`
    });

    return steps;
  }

  _insertNonFull(node, key, steps) {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      node.keys.push(0);
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;

      steps.push({
        tree: cloneTree(this.root),
        highlighted: { [node.id]: "matched" },
        explanation: `Reached leaf node. Insert key ${key} in sorted position. Node now has ${node.keys.length} keys.`
      });
    } else {
      while (i >= 0 && key < node.keys[i]) i--;
      i++;

      steps.push({
        tree: cloneTree(this.root),
        highlighted: { [node.id]: "visiting" },
        explanation: `Internal node: key ${key} goes into child[${i}] (between ${node.keys[i - 1] ?? "−∞"} and ${node.keys[i] ?? "+∞"}). Navigate down.`
      });

      if (node.children[i] && node.children[i].keys.length === 2 * T - 1) {
        steps.push({
          tree: cloneTree(this.root),
          highlighted: { [node.children[i].id]: "error" },
          explanation: `Child[${i}] is full (${2 * T - 1} keys). Must split child before descending.`
        });
        this._splitChild(node, i, steps);
        if (key > node.keys[i]) i++;
      }

      this._insertNonFull(node.children[i], key, steps);
    }
  }

  _splitChild(parent, i, steps) {
    const t = T;
    const y = parent.children[i];
    const z = makeNode(y.isLeaf);

    z.keys = y.keys.splice(t, t - 1);
    if (!y.isLeaf) z.children = y.children.splice(t, t);

    const medianKey = y.keys.pop();

    parent.keys.splice(i, 0, medianKey);
    parent.children.splice(i + 1, 0, z);

    steps.push({
      tree: cloneTree(this.root),
      highlighted: { [y.id]: "active", [z.id]: "active", [parent.id]: "visiting" },
      explanation: `Split child: median key ${medianKey} promoted to parent. Left child: [${y.keys}], Right child: [${z.keys}].`
    });
  }

  search(key, steps = []) {
    steps.push({
      tree: cloneTree(this.root),
      highlighted: {},
      explanation: `Search for key ${key} in B-Tree. Start at root.`
    });
    this._searchDFS(this.root, key, steps);
    return steps;
  }

  _searchDFS(node, key, steps) {
    if (!node) return;
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;

    if (i < node.keys.length && key === node.keys[i]) {
      steps.push({
        tree: cloneTree(this.root),
        highlighted: { [node.id]: "matched" },
        explanation: `✅ Found key ${key} in node [${node.keys.join(", ")}]!`
      });
      return;
    }

    if (node.isLeaf) {
      steps.push({
        tree: cloneTree(this.root),
        highlighted: { [node.id]: "error" },
        explanation: `Reached leaf node [${node.keys.join(", ")}]. Key ${key} not found in B-Tree.`
      });
      return;
    }

    steps.push({
      tree: cloneTree(this.root),
      highlighted: { [node.id]: "visiting" },
      explanation: `Key ${key} not in node [${node.keys.join(", ")}]. Descend into child[${i}].`
    });

    this._searchDFS(node.children[i], key, steps);
  }
}

// Layout: compute (x, y) positions for rendering
function layoutTree(root) {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [];
  const edges = [];
  let leafPos = 0;
  const NODE_W = 100;
  const HGAP = 20;
  const VERT_GAP = 100;

  const computeWidth = (node) => {
    if (node.isLeaf || node.children.length === 0) {
      return Math.max(NODE_W, node.keys.length * 28 + 16);
    }
    return node.children.reduce((sum, c) => sum + computeWidth(c) + HGAP, 0) - HGAP;
  };

  const dfs = (node, depth, xStart) => {
    const totalW = computeWidth(node);
    const nodeW = Math.max(NODE_W, node.keys.length * 28 + 16);
    const x = xStart + totalW / 2 - nodeW / 2;
    const y = 50 + depth * VERT_GAP;

    nodes.push({ id: node.id, keys: node.keys, isLeaf: node.isLeaf, x, y, w: nodeW });

    if (!node.isLeaf && node.children.length > 0) {
      let childX = xStart;
      node.children.forEach(child => {
        const cW = computeWidth(child);
        const childNodeW = Math.max(NODE_W, child.keys.length * 28 + 16);
        const childXCenter = childX + cW / 2 - childNodeW / 2;
        const childY = 50 + (depth + 1) * VERT_GAP;
        edges.push({ x1: x + nodeW / 2, y1: y + 24, x2: childXCenter + childNodeW / 2, y2: childY - 8, childId: child.id });
        dfs(child, depth + 1, childX);
        childX += cW + HGAP;
      });
    }
  };

  dfs(root, 0, 40);
  return { nodes, edges };
}

const INITIAL_KEYS = [10, 20, 5, 6, 12, 30, 7, 17];

export default function BTreeAnimation() {
  const managerRef = useRef(null);
  const [displayRoot, setDisplayRoot] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [mode, setMode] = useState("insert");
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState(`B-Tree pre-loaded (order ${2 * T}, max ${2 * T - 1} keys/node)! Insert or Search keys.`);
  const [highlighted, setHighlighted] = useState({});

  const timerRef = useRef(null);

  // Initialize tree
  useEffect(() => {
    const mgr = new BTreeManager();
    for (const key of INITIAL_KEYS) mgr.insert(key, []);
    managerRef.current = mgr;
    setDisplayRoot(cloneTree(mgr.root));
  }, []);

  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  useEffect(() => {
    if (currentStepIdx < 0 || currentStepIdx >= steps.length) return;
    const step = steps[currentStepIdx];
    setDisplayRoot(step.tree);
    setHighlighted(step.highlighted || {});
    setMessage(step.explanation || "");
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
    setHighlighted({});
    setDisplayRoot(managerRef.current ? cloneTree(managerRef.current.root) : null);
    setMessage("Playback reset.");
  };

  const handleReset = () => {
    setIsAnimating(false);
    const mgr = new BTreeManager();
    for (const key of INITIAL_KEYS) mgr.insert(key, []);
    managerRef.current = mgr;
    setDisplayRoot(cloneTree(mgr.root));
    setSteps([]);
    setCurrentStepIdx(-1);
    setHighlighted({});
    setInputValue(""); setSearchValue("");
    setMessage(`Tree reset to default (order ${2 * T}). Insert or search keys.`);
  };

  const triggerInsert = () => {
    const key = parseInt(inputValue);
    if (isNaN(key) || key < 1 || key > 999) { setMessage("⚠️ Enter a valid key (1-999)."); return; }
    setIsAnimating(false);
    setInputValue("");
    const newSteps = managerRef.current.insert(key);
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  const triggerSearch = () => {
    const key = parseInt(searchValue);
    if (isNaN(key) || key < 1 || key > 999) { setMessage("⚠️ Enter a valid key to search (1-999)."); return; }
    setIsAnimating(false);
    setSearchValue("");
    const newSteps = managerRef.current.search(key);
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // Layout
  const { nodes, edges } = layoutTree(displayRoot);
  const svgWidth = nodes.length > 0 ? Math.max(800, Math.max(...nodes.map(n => n.x + n.w)) + 60) : 800;
  const svgHeight = nodes.length > 0 ? Math.max(380, Math.max(...nodes.map(n => n.y)) + 80) : 380;

  const getNodeStyle = (nodeId) => {
    const state = highlighted[nodeId];
    if (state === "visiting") return { fill: "#8b5cf6", stroke: "#c084fc" };
    if (state === "active")   return { fill: "#10b981", stroke: "#34d399" };
    if (state === "matched")  return { fill: "#f59e0b", stroke: "#fbbf24" };
    if (state === "error")    return { fill: "#ef4444", stroke: "#f87171" };
    return { fill: "#1e293b", stroke: "#475569" };
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-7xl mx-auto selection:bg-purple-500/30 selection:text-purple-200">

      {/* Mode Tabs */}
      <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-800">
        {[["insert", "Insert"], ["search", "Search"]].map(([val, label]) => (
          <button key={val} onClick={() => { setMode(val); resetPlayback(); }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === val ? "bg-purple-600 text-white shadow-md shadow-purple-950" : "text-slate-400 hover:text-slate-200"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {mode === "insert" ? (
            <>
              <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Key (1-999)"
                className="w-full sm:w-32 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isAnimating} onKeyDown={e => e.key === "Enter" && triggerInsert()} />
              <button onClick={triggerInsert} disabled={isAnimating}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-xl transition-all shadow-md">
                <Plus className="w-3.5 h-3.5" /> Insert Key
              </button>
            </>
          ) : (
            <>
              <input type="number" value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Key to search"
                className="w-full sm:w-32 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isAnimating} onKeyDown={e => e.key === "Enter" && triggerSearch()} />
              <button onClick={triggerSearch} disabled={isAnimating}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-primary hover:bg-primary-dark disabled:bg-primary-dark/40 disabled:opacity-50 text-white rounded-xl transition-all shadow-md">
                <Search className="w-3.5 h-3.5" /> Search
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
          <span className="text-slate-400 font-semibold flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-purple-400" /> Operation Explanation</span>
          <div className="flex items-center gap-2">
            <span className="text-purple-400/60 text-xs">Order {2*T} B-Tree (max {2*T-1} keys/node)</span>
            <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-900">Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}</span>
          </div>
        </div>
        <div className="text-sm font-medium text-purple-200/90 leading-relaxed min-h-[40px] flex items-center">{message}</div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-4 relative overflow-hidden min-h-[380px] flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { color: "bg-purple-600", label: "Visiting" },
            { color: "bg-primary", label: "Split / Active" },
            { color: "bg-amber-500", label: "Found" },
            { color: "bg-rose-600", label: "Not Found" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        <div className="overflow-auto flex justify-center">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="max-w-full h-auto">
            {/* Edges */}
            {edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={highlighted[e.childId] ? "#8b5cf6" : "#334155"} strokeWidth={highlighted[e.childId] ? "2.5" : "1.5"}
                className="transition-all duration-300" />
            ))}

            {/* Nodes */}
            {nodes.map(node => {
              const style = getNodeStyle(node.id);
              const keyW = node.w / Math.max(node.keys.length, 1);
              return (
                <g key={node.id} className="transition-all duration-300">
                  {/* Glow */}
                  {highlighted[node.id] && <rect x={node.x - 4} y={node.y - 12} width={node.w + 8} height={36} rx="10" fill="none" stroke={style.stroke} strokeWidth="1.5" strokeDasharray="4,2" className="opacity-60 animate-pulse" />}

                  {/* Node background */}
                  <rect x={node.x} y={node.y - 8} width={node.w} height={28} rx="6" fill={style.fill} stroke={style.stroke} strokeWidth="1.5" className="transition-all duration-300" />

                  {/* Key dividers + text */}
                  {node.keys.map((key, ki) => (
                    <g key={ki}>
                      {ki > 0 && <line x1={node.x + ki * keyW} y1={node.y - 8} x2={node.x + ki * keyW} y2={node.y + 20} stroke={style.stroke} strokeWidth="1" opacity="0.5" />}
                      <text x={node.x + ki * keyW + keyW / 2} y={node.y + 7} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{key}</text>
                    </g>
                  ))}

                  {/* Empty node */}
                  {node.keys.length === 0 && <text x={node.x + node.w / 2} y={node.y + 7} textAnchor="middle" fill="#475569" fontSize="10">(empty)</text>}
                </g>
              );
            })}

            {/* Empty state */}
            {nodes.length === 0 && <text x="400" y="180" textAnchor="middle" fill="#475569" fontSize="14">Insert keys to build the B-Tree</text>}
          </svg>
        </div>

        {/* B-Tree properties */}
        <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs space-y-0.5 max-w-xs">
          <p className="text-slate-400 font-bold mb-1">B-Tree Properties (t={T}):</p>
          <p className="text-slate-500">Min keys: {T - 1} (root: 1)</p>
          <p className="text-slate-500">Max keys: {2 * T - 1}</p>
          <p className="text-slate-500">All leaves at same level</p>
        </div>
      </div>
    </div>
  );
}
