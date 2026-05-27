"use client";
import React, { useState } from "react";
import { Search, RotateCcw, Info } from "lucide-react";

const NODES = [
  { id: "3", val: "3", x: 400, y: 60, parent: null },
  { id: "5", val: "5", x: 250, y: 150, parent: "3" },
  { id: "1", val: "1", x: 550, y: 150, parent: "3" },
  { id: "6", val: "6", x: 150, y: 240, parent: "5" },
  { id: "2", val: "2", x: 350, y: 240, parent: "5" },
  { id: "0", val: "0", x: 450, y: 240, parent: "1" },
  { id: "8", val: "8", x: 650, y: 240, parent: "1" },
  { id: "7", val: "7", x: 280, y: 330, parent: "2" },
  { id: "4", val: "4", x: 420, y: 330, parent: "2" },
];

const EDGES = NODES.filter(n => n.parent).map(n => {
  const p = NODES.find(parent => parent.id === n.parent);
  return { id: `${p.id}-${n.id}`, x1: p.x, y1: p.y + 20, x2: n.x, y2: n.y - 20, parent: p.id, child: n.id };
});

export default function LCAAnimation() {
  const [targetP, setTargetP] = useState("5");
  const [targetQ, setTargetQ] = useState("1");
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Select two nodes and click 'Find LCA' to trace the paths.");
  
  // Animation States
  const [activeNode, setActiveNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [foundNodes, setFoundNodes] = useState([]);
  const [backtrackingEdges, setBacktrackingEdges] = useState([]);
  const [lcaNode, setLcaNode] = useState(null);

  const generateDFSSequence = (rootId, p, q) => {
    const sequence = [];
    
    const dfs = (nodeId) => {
      if (!nodeId) return null;
      
      sequence.push({ type: "VISIT", node: nodeId });
      
      if (nodeId === p || nodeId === q) {
        sequence.push({ type: "FOUND_TARGET", node: nodeId });
        sequence.push({ type: "BACKTRACK", node: nodeId, returnValue: nodeId });
        return nodeId;
      }
      
      const children = EDGES.filter(e => e.parent === nodeId).map(e => e.child);
      const leftChild = children[0] || null;
      const rightChild = children[1] || null;
      
      let leftResult = null;
      let rightResult = null;
      
      if (leftChild) {
        leftResult = dfs(leftChild);
        sequence.push({ type: "RETURN_LEFT", node: nodeId, child: leftChild, val: leftResult });
      }
      
      if (rightChild) {
        rightResult = dfs(rightChild);
        sequence.push({ type: "RETURN_RIGHT", node: nodeId, child: rightChild, val: rightResult });
      }
      
      if (leftResult && rightResult) {
        sequence.push({ type: "LCA_FOUND", node: nodeId });
        sequence.push({ type: "BACKTRACK", node: nodeId, returnValue: nodeId });
        return nodeId;
      }
      
      const ret = leftResult || rightResult;
      sequence.push({ type: "BACKTRACK", node: nodeId, returnValue: ret });
      return ret;
    };
    
    dfs(rootId);
    sequence.push({ type: "FINISH" });
    return sequence;
  };

  const handleFindLca = () => {
    if (targetP === targetQ) {
      setMessage("Please select two distinct nodes.");
      return;
    }
    setAnimating(true);
    setVisitedNodes([]);
    setFoundNodes([]);
    setBacktrackingEdges([]);
    setLcaNode(null);
    setActiveNode(null);

    const sequence = generateDFSSequence("3", targetP, targetQ);
    let step = 0;
    let lcaResolved = false;

    const interval = setInterval(() => {
      if (step >= sequence.length) {
        clearInterval(interval);
        setAnimating(false);
        return;
      }

      const event = sequence[step];
      
      switch (event.type) {
        case "VISIT":
          if (!lcaResolved) {
            setActiveNode(event.node);
            setVisitedNodes(prev => [...new Set([...prev, event.node])]);
            setMessage(`Exploring node ${event.node}...`);
          }
          break;
        case "FOUND_TARGET":
          setFoundNodes(prev => [...new Set([...prev, event.node])]);
          if (!lcaResolved) {
            setMessage(`Node ${event.node} matches target!`);
          }
          break;
        case "RETURN_LEFT":
        case "RETURN_RIGHT":
          if (!lcaResolved) {
            setActiveNode(event.node);
            if (event.val) {
              setBacktrackingEdges(prev => [...new Set([...prev, `${event.node}-${event.child}`])]);
              setMessage(`Subtree returned ${event.val}. Propagating up to ${event.node}.`);
            } else {
              setMessage(`Subtree returned null.`);
            }
          } else if (event.val) {
            // Still animate edge glow, but freeze the text message
            setBacktrackingEdges(prev => [...new Set([...prev, `${event.node}-${event.child}`])]);
          }
          break;
        case "LCA_FOUND":
          lcaResolved = true;
          setLcaNode(event.node);
          setActiveNode(null); // Clear active node glow so LCA glow takes over
          setMessage(`Lowest Common Ancestor = ${event.node}`);
          break;
        case "BACKTRACK":
          if (!lcaResolved && event.node !== "3") { // Hide backtrack out of root
            if (event.returnValue) {
              setMessage(`Returning ${event.returnValue} up to parent.`);
            } else {
              setMessage(`Returning null up to parent.`);
            }
          }
          break;
        case "FINISH":
          setActiveNode(null);
          if (!lcaResolved) {
              const actualLca = sequence.find(s => s.type === "BACKTRACK" && s.returnValue && s.node === s.returnValue)?.node;
              setLcaNode(actualLca);
              setMessage(`Lowest Common Ancestor = ${actualLca}`);
          }
          break;
      }
      
      step++;
    }, 1200);
  };

  const handleReset = () => {
    setAnimating(false);
    setActiveNode(null);
    setVisitedNodes([]);
    setFoundNodes([]);
    setBacktrackingEdges([]);
    setLcaNode(null);
    setMessage("Select two nodes and click 'Find LCA' to trace the paths.");
  };

  // SVG Helper functions
  const getNodeFill = (nodeId) => {
      if (lcaNode === nodeId) return "#581c87"; // Final LCA
      if (foundNodes.includes(nodeId)) return "#3b0764"; // Target found
      if (activeNode === nodeId) return "#2e1065"; // Currently exploring
      return "#0f172a"; // Default or visited
  };

  const getNodeStroke = (nodeId) => {
      if (lcaNode === nodeId) return "#d8b4fe"; // Final LCA
      if (foundNodes.includes(nodeId)) return "#a855f7"; // Target found
      if (activeNode === nodeId) return "#d8b4fe"; // Currently exploring
      if (visitedNodes.includes(nodeId)) return "#64748b"; // Visited
      return "#475569"; // Default
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-5xl mx-auto selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-wrap gap-4 justify-between items-center shadow-lg shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-400">Node p:</label>
            <select 
              value={targetP} 
              onChange={e => setTargetP(e.target.value)}
              disabled={animating}
              className="bg-slate-800 text-purple-300 font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none focus:border-purple-500"
            >
              {NODES.map(n => <option key={`p-${n.id}`} value={n.id}>{n.val}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-400">Node q:</label>
            <select 
              value={targetQ} 
              onChange={e => setTargetQ(e.target.value)}
              disabled={animating}
              className="bg-slate-800 text-purple-300 font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none focus:border-purple-500"
            >
              {NODES.map(n => <option key={`q-${n.id}`} value={n.id}>{n.val}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleFindLca} 
            disabled={animating}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 text-white rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <Search className="w-4 h-4" /> Find LCA
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

      {/* SVG Canvas */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-4 min-h-[500px]">
        <div className="overflow-auto flex justify-center mt-6">
          <svg width="800" height="420" viewBox="0 0 800 420" className="max-w-full h-auto drop-shadow-xl">
            {/* Edges */}
            {EDGES.map(e => {
              const edgeId = `${e.parent}-${e.child}`;
              const isBacktracking = backtrackingEdges.includes(edgeId);
              
              return (
                <line 
                  key={e.id} 
                  x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
                  stroke={isBacktracking ? "#a855f7" : "#334155"} 
                  strokeWidth={isBacktracking ? "4" : "2"}
                  strokeDasharray={isBacktracking ? "6,4" : "0"}
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const isP = node.id === targetP;
              const isQ = node.id === targetQ;
              const isLCA = node.id === lcaNode;
              const isActive = node.id === activeNode;
              
              let r = isLCA ? "30" : "24";

              return (
                <g key={node.id} className="transition-all duration-500">
                  {/* Active node glow */}
                  {isActive && !isLCA && <circle cx={node.x} cy={node.y} r="32" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  
                  {/* LCA ultimate glow */}
                  {isLCA && <circle cx={node.x} cy={node.y} r="38" fill="none" stroke="#d8b4fe" strokeWidth="2" className="opacity-80 animate-ping" />}
                  {isLCA && <circle cx={node.x} cy={node.y} r="45" fill="none" stroke="#a855f7" strokeWidth="1" className="opacity-40 animate-pulse" />}
                  
                  <circle 
                    cx={node.x} cy={node.y} r={r} 
                    fill={getNodeFill(node.id)} 
                    stroke={getNodeStroke(node.id)} 
                    strokeWidth="2.5" 
                    className="shadow-xl transition-all duration-500" 
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">{node.val}</text>
                  
                  {isP && !isLCA && <text x={node.x + 35} y={node.y + 5} fill="#d8b4fe" fontSize="14" fontWeight="bold">p</text>}
                  {isQ && !isLCA && <text x={node.x + 35} y={node.y + 5} fill="#d8b4fe" fontSize="14" fontWeight="bold">q</text>}
                  {isLCA && <text x={node.x + 45} y={node.y + 5} fill="#d8b4fe" fontSize="16" fontWeight="black">LCA</text>}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
