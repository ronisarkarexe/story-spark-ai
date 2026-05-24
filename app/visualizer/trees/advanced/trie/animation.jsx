"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  AlertCircle,
  Plus,
  Search,
  CheckCircle,
  Times
} from "lucide-react";

// Internal Trie Node Class for coordinate mapping
class TrieNode {
  constructor(char = "", id = "root") {
    this.id = id;
    this.char = char;
    this.children = {}; // char -> TrieNode
    this.isEndOfWord = false;
    this.x = 400;
    this.y = 60;
  }
}

export default function TrieAnimation() {
  const [root, setRoot] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("Add some words to build your Prefix Tree! Click 'Insert' to start.");
  const [speed, setSpeed] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);

  // Setup initial words for a stunning first-time impression
  useEffect(() => {
    let counter = 0;
    const newRoot = new TrieNode("", "root");

    const addWord = (trieRoot, word) => {
      let node = trieRoot;
      for (let char of word) {
        if (!node.children[char]) {
          counter++;
          node.children[char] = new TrieNode(char, `node-${counter}`);
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    };

    addWord(newRoot, "cat");
    addWord(newRoot, "car");
    addWord(newRoot, "dog");

    setNodeIdCounter(counter);
    setRoot(newRoot);
  }, []);

  const timerRef = useRef(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 1. Recursive symmetric layout calculator (Reingold-Tilford style)
  const computeTreeLayout = (trieRoot) => {
    if (!trieRoot) return { nodesList: [], edgesList: [] };

    let leafCount = 0;
    const nodesList = [];
    const edgesList = [];

    const layoutDFS = (node, level = 0) => {
      const childrenKeys = Object.keys(node.children).sort();
      const childrenList = childrenKeys.map(k => node.children[k]);

      node.y = 80 + level * 90;

      if (childrenList.length === 0) {
        // Leaf node
        node.x = 60 + leafCount * 90;
        leafCount++;
      } else {
        // Compute layout for children recursively first
        childrenList.forEach(child => layoutDFS(child, level + 1));

        // Parent X is average of its first and last child X coordinates
        const firstX = childrenList[0].x;
        const lastX = childrenList[childrenList.length - 1].x;
        node.x = (firstX + lastX) / 2;
      }

      // Read visual highlight state
      const currentStep = steps[currentStepIdx];
      const state = currentStep?.highlightedNodes?.[node.id] || null;

      nodesList.push({
        id: node.id,
        char: node.char,
        x: node.x,
        y: node.y,
        isEndOfWord: node.isEndOfWord,
        state: state
      });

      // Map edges to children
      childrenList.forEach(child => {
        edgesList.push({
          x1: node.x,
          y1: node.y + 20,
          x2: child.x,
          y2: child.y - 20,
          char: child.char,
          isActive: currentStep?.highlightedEdges?.[`${node.id}->${child.id}`] || false
        });
      });
    };

    layoutDFS(trieRoot, 0);
    return { nodesList, edgesList };
  };

  // Render variables
  const { nodesList: renderNodes, edgesList: renderEdges } = computeTreeLayout(root);

  // Dynamic SVG dimensions for responsive scaling
  const getSvgDimensions = () => {
    if (renderNodes.length === 0) return { width: 800, height: 400, offset: 0 };
    const xCoords = renderNodes.map(n => n.x);
    const yCoords = renderNodes.map(n => n.y);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const maxY = Math.max(...yCoords);

    const padding = 60;
    const computedWidth = maxX - minX + padding * 2;
    const computedHeight = maxY + padding * 1.5;

    return {
      width: Math.max(800, computedWidth),
      height: Math.max(380, computedHeight),
      offset: minX - padding
    };
  };

  const svgDimensions = getSvgDimensions();

  // Animation logic play loop
  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;

    if (currentStepIdx >= steps.length) {
      setIsAnimating(false);
      return;
    }

    const currentStep = steps[currentStepIdx];
    setMessage(currentStep.explanation);

    timerRef.current = setTimeout(() => {
      if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setIsAnimating(false);
        const finalStep = steps[steps.length - 1];
        setMessage(finalStep.explanation);
      }
    }, 1800 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnimating, currentStepIdx, steps, speed]);

  // Actions
  const pauseVisualizer = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const startVisualizer = () => {
    if (steps.length === 0) return;
    setIsAnimating(true);
    let nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };

  const stepForward = () => {
    setIsAnimating(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    setIsAnimating(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const resetPlayback = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setMessage("Playback reset. Click play to begin.");
  };

  const handleClearTree = () => {
    setIsAnimating(false);
    setCurrentStepIdx(-1);
    setSteps([]);
    setRoot(new TrieNode("", "root"));
    setNodeIdCounter(0);
    setMessage("Trie cleared. Type a word and click Insert!");
  };

  // Pre-calculated animation generator for INSERT
  const triggerInsert = () => {
    const word = inputValue.trim().toLowerCase();
    if (!word || !/^[a-z]+$/.test(word)) {
      setMessage("⚠️ Please enter a valid lowercase word (a-z) without numbers or symbols.");
      return;
    }

    setIsAnimating(false);
    setInputValue("");

    const newSteps = [];
    let tempRoot = JSON.parse(JSON.stringify(root)); // Deep copy to simulate insertion coordinates

    // Step 0: Starting state
    newSteps.push({
      highlightedNodes: { root: "visiting" },
      highlightedEdges: {},
      explanation: `Begin insertion of word "${word}". Start at the Root node.`
    });

    let node = tempRoot;
    let originalNode = root; // pointer to follow real node IDs
    let counter = nodeIdCounter;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const visitedSoFar = word.slice(0, i + 1);
      const isLast = i === word.length - 1;

      const activeHighlights = {};
      const activeEdges = {};

      // Trace back the current path
      let traceNode = tempRoot;
      activeHighlights[traceNode.id] = "active";
      for (let j = 0; j < i; j++) {
        const nextNode = traceNode.children[word[j]];
        activeHighlights[nextNode.id] = "active";
        activeEdges[`${traceNode.id}->${nextNode.id}`] = true;
        traceNode = nextNode;
      }

      // Check if child node exists
      if (node.children[char]) {
        const childNode = node.children[char];
        activeHighlights[childNode.id] = "visiting";
        activeEdges[`${node.id}->${childNode.id}`] = true;

        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Character '${char}' already exists under node '${node.char || "root"}'. Follow edge to character node '${char}'.`
        });

        node = childNode;
      } else {
        // Node does not exist, create it!
        counter++;
        const newChild = new TrieNode(char, `node-${counter}`);
        node.children[char] = newChild;

        activeHighlights[newChild.id] = "visiting";
        activeEdges[`${node.id}->${newChild.id}`] = true;

        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Character '${char}' is missing under node '${node.char || "root"}'. Create a new node for '${char}' and link it.`
        });

        node = newChild;
      }

      if (isLast) {
        node.isEndOfWord = true;
        const finalHighlights = { ...activeHighlights };
        finalHighlights[node.id] = "matched";

        newSteps.push({
          highlightedNodes: finalHighlights,
          highlightedEdges: { ...activeEdges },
          explanation: `Word "${word}" insertion complete. Mark final character node '${char}' as End of Word (isEndOfWord = true).`
        });
      }
    }

    // Update real tree state
    const updateRealTree = () => {
      let rNode = root;
      let c = nodeIdCounter;
      for (let char of word) {
        if (!rNode.children[char]) {
          c++;
          rNode.children[char] = new TrieNode(char, `node-${c}`);
        }
        rNode = rNode.children[char];
      }
      rNode.isEndOfWord = true;
      setNodeIdCounter(c);
      setRoot(root);
    };

    updateRealTree();
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // Pre-calculated animation generator for SEARCH
  const triggerSearch = () => {
    const word = inputValue.trim().toLowerCase();
    if (!word || !/^[a-z]+$/.test(word)) {
      setMessage("⚠️ Please enter a lowercase string to search.");
      return;
    }

    setIsAnimating(false);
    setInputValue("");

    const newSteps = [];

    newSteps.push({
      highlightedNodes: { root: "visiting" },
      highlightedEdges: {},
      explanation: `Search for word "${word}". Start matching characters at the Root node.`
    });

    let node = root;
    let found = true;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isLast = i === word.length - 1;

      const activeHighlights = {};
      const activeEdges = {};

      // Trace highlighted active path
      let traceNode = root;
      activeHighlights[traceNode.id] = "active";
      for (let j = 0; j < i; j++) {
        const nextNode = traceNode.children[word[j]];
        activeHighlights[nextNode.id] = "active";
        activeEdges[`${traceNode.id}->${nextNode.id}`] = true;
        traceNode = nextNode;
      }

      if (node.children[char]) {
        const childNode = node.children[char];
        activeHighlights[childNode.id] = "visiting";
        activeEdges[`${node.id}->${childNode.id}`] = true;

        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Found letter '${char}' under node '${node.char || "root"}'. Matching prefix: "${word.slice(0, i + 1)}".`
        });

        node = childNode;
      } else {
        found = false;
        // Mark active node as error
        activeHighlights[node.id] = "error";
        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Letter '${char}' is missing under node '${node.char || "root"}'. Searching failed: "${word}" is not in the Trie.`
        });
        break;
      }

      if (isLast && found) {
        const finalHighlights = { ...activeHighlights };
        if (node.isEndOfWord) {
          finalHighlights[node.id] = "matched";
          newSteps.push({
            highlightedNodes: finalHighlights,
            highlightedEdges: { ...activeEdges },
            explanation: `Found letter '${char}' and isEndOfWord = true. Success: Word "${word}" exists in the Trie!`
          });
        } else {
          finalHighlights[node.id] = "error";
          newSteps.push({
            highlightedNodes: finalHighlights,
            highlightedEdges: { ...activeEdges },
            explanation: `Traversed all letters, but isEndOfWord = false. Word "${word}" is NOT in the Trie (Prefix match only).`
          });
        }
      }
    }

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // Pre-calculated animation generator for PREFIX SEARCH
  const triggerPrefixSearch = () => {
    const prefix = inputValue.trim().toLowerCase();
    if (!prefix || !/^[a-z]+$/.test(prefix)) {
      setMessage("⚠️ Please enter a lowercase prefix to search.");
      return;
    }

    setIsAnimating(false);
    setInputValue("");

    const newSteps = [];

    newSteps.push({
      highlightedNodes: { root: "visiting" },
      highlightedEdges: {},
      explanation: `Check startsWith prefix "${prefix}". Start at the Root node.`
    });

    let node = root;
    let found = true;

    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      const isLast = i === prefix.length - 1;

      const activeHighlights = {};
      const activeEdges = {};

      let traceNode = root;
      activeHighlights[traceNode.id] = "active";
      for (let j = 0; j < i; j++) {
        const nextNode = traceNode.children[prefix[j]];
        activeHighlights[nextNode.id] = "active";
        activeEdges[`${traceNode.id}->${nextNode.id}`] = true;
        traceNode = nextNode;
      }

      if (node.children[char]) {
        const childNode = node.children[char];
        activeHighlights[childNode.id] = "visiting";
        activeEdges[`${node.id}->${childNode.id}`] = true;

        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Letter '${char}' matches. Prefix path exists for: "${prefix.slice(0, i + 1)}".`
        });

        node = childNode;
      } else {
        found = false;
        activeHighlights[node.id] = "error";
        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Letter '${char}' missing under node '${node.char || "root"}'. Prefix check failed: "${prefix}" does not exist in the Trie.`
        });
        break;
      }

      if (isLast && found) {
        const finalHighlights = { ...activeHighlights };
        finalHighlights[node.id] = "matched";
        newSteps.push({
          highlightedNodes: finalHighlights,
          highlightedEdges: { ...activeEdges },
          explanation: `All letters in prefix "${prefix}" successfully traversed. Success: Prefix exists in the Trie!`
        });
      }
    }

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-7xl mx-auto selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Dynamic Workspace Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
        
        {/* User Operations */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter word (a-z)"
            className="w-full sm:w-44 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors uppercase"
            disabled={isAnimating}
            onKeyDown={(e) => e.key === "Enter" && triggerInsert()}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={triggerInsert}
              disabled={isAnimating}
              className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-xl transition-all font-semibold shadow-md shadow-purple-950/20"
            >
              <Plus className="w-3.5 h-3.5" /> Insert
            </button>
            <button
              onClick={triggerSearch}
              disabled={isAnimating}
              className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl transition-all font-semibold border border-slate-700/60"
            >
              <Search className="w-3.5 h-3.5 text-purple-400" /> Search
            </button>
            <button
              onClick={triggerPrefixSearch}
              disabled={isAnimating}
              className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl transition-all font-semibold border border-slate-700/60"
            >
              Prefix Match
            </button>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={stepBackward}
              disabled={currentStepIdx <= 0 || steps.length === 0}
              className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded-lg"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={isAnimating ? pauseVisualizer : startVisualizer}
              disabled={steps.length === 0}
              className={`p-2 rounded-xl transition-all ${
                isAnimating
                  ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/35 border border-amber-800/40"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950 disabled:opacity-30"
              }`}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={stepForward}
              disabled={steps.length > 0 && currentStepIdx >= steps.length - 1}
              className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded-lg"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetPlayback}
              disabled={steps.length === 0}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg disabled:opacity-30"
              title="Reset Playback"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleClearTree}
            className="px-3.5 py-2 text-xs font-bold text-rose-500 bg-rose-950/20 hover:bg-rose-950/40 rounded-xl transition-all border border-rose-900/30"
          >
            Clear Trie
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-3 w-full md:w-36 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Speed</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-bold text-purple-400 w-8">{speed}x</span>
        </div>

      </div>

      {/* Real-time Activity Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple-400" /> Current Action Explanation
          </span>
          <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-900">
            Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
          </span>
        </div>
        <div className="text-sm font-medium text-purple-200/90 leading-relaxed min-h-[40px] flex items-center">
          {message}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="bg-slate-900/30 border border-slate-850 rounded-3xl p-6 shadow-inner relative overflow-hidden flex flex-col justify-center min-h-[440px] items-center">
        
        {/* Glowing Legend Overlays */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-950"></span>
            <span className="text-slate-400">Current Node</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-md shadow-purple-950"></span>
            <span className="text-slate-400">Match Found</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-950"></span>
            <span className="text-slate-400">Error / Not Found</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-double border-purple-400"></span>
            <span className="text-slate-400">End of Word</span>
          </div>
        </div>

        {/* Dynamic Responsive SVG Tree */}
        {renderNodes.length > 0 ? (
          <div className="overflow-auto w-full flex justify-center py-6">
            <svg
              width={svgDimensions.width}
              height={svgDimensions.height}
              viewBox={`${svgDimensions.offset} 0 ${svgDimensions.width} ${svgDimensions.height}`}
              className="max-w-full h-auto transition-transform duration-300"
            >
              {/* Draw Edges */}
              {renderEdges.map((edge, idx) => {
                let strokeColor = "#334155";
                let strokeWidth = "2";
                if (edge.isActive) {
                  strokeColor = "#c084fc"; // purple-400
                  strokeWidth = "3.5";
                }

                return (
                  <g key={`edge-g-${idx}`}>
                    <line
                      x1={edge.x1}
                      y1={edge.y1}
                      x2={edge.x2}
                      y2={edge.y2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      className="transition-all duration-300"
                    />
                    {/* Edge Label character */}
                    <rect
                      x={(edge.x1 + edge.x2) / 2 - 8}
                      y={(edge.y1 + edge.y2) / 2 - 10}
                      width="16"
                      height="16"
                      rx="3"
                      fill="#0b0f19"
                      stroke={edge.isActive ? "#c084fc" : "#1e293b"}
                      strokeWidth="0.5"
                    />
                    <text
                      x={(edge.x1 + edge.x2) / 2}
                      y={(edge.y1 + edge.y2) / 2 + 2.5}
                      textAnchor="middle"
                      fill={edge.isActive ? "#c084fc" : "#94a3b8"}
                      fontSize="10"
                      fontWeight="bold"
                      className="uppercase"
                    >
                      {edge.char}
                    </text>
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {renderNodes.map((node, idx) => {
                const isCurr = node.state === "visiting";
                const isMatch = node.state === "matched";
                const isError = node.state === "error";
                const isActivePath = node.state === "active";

                let fillHex = "#0f172a";
                let strokeHex = "#334155";
                let strokeWidth = "2";

                if (isCurr) {
                  fillHex = "#10b981"; // emerald-500
                  strokeHex = "#34d399";
                } else if (isMatch) {
                  fillHex = "#8b5cf6"; // purple-600
                  strokeHex = "#c084fc";
                } else if (isError) {
                  fillHex = "#ef4444"; // red-500
                  strokeHex = "#f87171";
                } else if (isActivePath) {
                  fillHex = "#3b82f6"; // blue-500
                  strokeHex = "#60a5fa";
                }

                return (
                  <g key={`node-g-${idx}`} className="transition-all duration-300">
                    {/* Glowing outer rings for active/searching states */}
                    {(isCurr || isMatch || isError) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="25"
                        fill="none"
                        stroke={strokeHex}
                        strokeWidth="1.5"
                        strokeDasharray="4,2"
                        className="animate-spin-slow opacity-65"
                      />
                    )}

                    {/* Double stroke ring for end of word */}
                    {node.isEndOfWord && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="22"
                        fill="none"
                        stroke={isMatch ? "#c084fc" : "#c084fc"}
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                        className="opacity-80"
                      />
                    )}

                    {/* Node Core */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="18"
                      fill={fillHex}
                      stroke={strokeHex}
                      strokeWidth={node.isEndOfWord ? "3.5" : strokeWidth}
                      className="shadow-lg transition-all duration-300"
                    />

                    {/* Node Text character */}
                    <text
                      x={node.x}
                      y={node.y + 4.5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      className="uppercase"
                    >
                      {node.char || "Root"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-500 py-12">
            <AlertCircle className="w-10 h-10 text-slate-700 animate-bounce" />
            <span className="text-sm font-semibold">Workspace is Empty</span>
          </div>
        )}

      </div>

    </div>
  );
}
