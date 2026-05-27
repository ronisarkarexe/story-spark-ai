"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Settings2,
  BarChart3,
  Info
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import GraphCanvas from "@/app/components/models/GraphCanvas";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { 
  bfsFrames, 
  dfsFrames, 
  dijkstraFrames, 
  primFrames, 
  kruskalFrames, 
  topologicalSortFrames,
  adjacencyListFrames,
  adjacencyMatrixFrames
} from "../utils/algorithms";

const defaultGraphs = {
  bfs: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "1", to: "4", weight: 1, directed: false },
      { from: "2", to: "5", weight: 1, directed: false },
    ]
  },
  dfs: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "3", to: "4", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "2", to: "5", weight: 1, directed: false },
    ]
  },
  dijkstra: {
    nodes: [
      { id: "0", x: 100, y: 250, label: "A" },
      { id: "1", x: 300, y: 100, label: "B" },
      { id: "2", x: 300, y: 400, label: "C" },
      { id: "3", x: 500, y: 100, label: "D" },
      { id: "4", x: 500, y: 400, label: "E" },
      { id: "5", x: 700, y: 250, label: "F" },
    ],
    edges: [
      { from: "0", to: "1", weight: 4, directed: true },
      { from: "0", to: "2", weight: 2, directed: true },
      { from: "1", to: "3", weight: 5, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "1", weight: 8, directed: true },
      { from: "2", to: "3", weight: 10, directed: true },
      { from: "2", to: "4", weight: 3, directed: true },
      { from: "3", to: "5", weight: 2, directed: true },
      { from: "4", to: "3", weight: 4, directed: true },
      { from: "4", to: "5", weight: 6, directed: true },
    ]
  },
  prim: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 2, directed: false },
      { from: "0", to: "2", weight: 3, directed: false },
      { from: "1", to: "3", weight: 5, directed: false },
      { from: "1", to: "4", weight: 1, directed: false },
      { from: "2", to: "5", weight: 4, directed: false },
      { from: "4", to: "5", weight: 2, directed: false },
    ]
  },
  kruskal: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 2, directed: false },
      { from: "0", to: "2", weight: 3, directed: false },
      { from: "1", to: "3", weight: 5, directed: false },
      { from: "1", to: "4", weight: 1, directed: false },
      { from: "2", to: "5", weight: 4, directed: false },
      { from: "4", to: "5", weight: 2, directed: false },
    ]
  },
  "topological-sort": {
    nodes: [
      { id: "0", x: 100, y: 100, label: "A" },
      { id: "1", x: 300, y: 100, label: "B" },
      { id: "2", x: 500, y: 100, label: "C" },
      { id: "3", x: 100, y: 400, label: "D" },
      { id: "4", x: 300, y: 400, label: "E" },
      { id: "5", x: 500, y: 400, label: "F" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "3", to: "1", weight: 1, directed: true },
      { from: "3", to: "4", weight: 1, directed: true },
      { from: "4", to: "5", weight: 1, directed: true },
      { from: "2", to: "5", weight: 1, directed: true },
    ]
  },
  "adjacency-list": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "0" },
      { id: "1", x: 300, y: 100, label: "1" },
      { id: "2", x: 300, y: 400, label: "2" },
      { id: "3", x: 500, y: 250, label: "3" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "2", to: "3", weight: 1, directed: false },
    ]
  },
  "adjacency-matrix": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "0" },
      { id: "1", x: 300, y: 100, label: "1" },
      { id: "2", x: 300, y: 400, label: "2" },
      { id: "3", x: 500, y: 250, label: "3" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "2", to: "3", weight: 1, directed: false },
    ]
  }
};

const complexityData = {
  bfs: [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  dfs: [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  dijkstra: [
    { name: 'Time', value: 95, label: 'O((V+E)logV)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  prim: [
    { name: 'Time', value: 90, label: 'O(ElogV)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  kruskal: [
    { name: 'Time', value: 90, label: 'O(ElogE)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "topological-sort": [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "adjacency-list": [
    { name: 'Space', value: 60, label: 'O(V+E)', full: 'Space Complexity' },
    { name: 'Add Node', value: 10, label: 'O(1)', full: 'Time Complexity' },
  ],
  "adjacency-matrix": [
    { name: 'Space', value: 90, label: 'O(V^2)', full: 'Space Complexity' },
    { name: 'Edge Check', value: 10, label: 'O(1)', full: 'Time Complexity' },
  ],
};

const comparisonData = [
  { name: 'BFS', time: 80, space: 60 },
  { name: 'DFS', time: 80, space: 60 },
  { name: 'Dijkstra', time: 95, space: 65 },
  { name: 'MST', time: 90, space: 60 },
];

export default function GraphVisualizer({ algorithm = "bfs", startNode: initialStartNode }) {
  const [nodes, setNodes] = useState(defaultGraphs[algorithm]?.nodes || []);
  const [edges, setEdges] = useState(defaultGraphs[algorithm]?.edges || []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isEditing, setIsEditing] = useState(true);

  const frames = useMemo(() => {
    // Convert edges to adjacency list
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      if (algorithm === "dijkstra" || algorithm === "prim") {
        adj[e.from].push({ node: e.to, weight: e.weight });
        if (!e.directed) adj[e.to].push({ node: e.from, weight: e.weight });
      } else {
        adj[e.from].push(e.to);
        if (!e.directed) adj[e.to].push(e.from);
      }
    });

    const startNodeId = initialStartNode || (nodes.length > 0 ? nodes[0].id : null);
    if (algorithm === "bfs") return bfsFrames(adj, startNodeId);
    if (algorithm === "dfs") return dfsFrames(adj, startNodeId);
    if (algorithm === "dijkstra") return dijkstraFrames(adj, startNodeId);
    if (algorithm === "prim") return primFrames(adj, startNodeId);
    if (algorithm === "kruskal") return kruskalFrames(nodes.map(n => n.id), edges);
    if (algorithm === "topological-sort") return topologicalSortFrames(adj, nodes.map(n => n.id));
    if (algorithm === "adjacency-list") return adjacencyListFrames(nodes, edges);
    if (algorithm === "adjacency-matrix") return adjacencyMatrixFrames(nodes, edges);
    return [];
  }, [nodes, edges, algorithm, initialStartNode]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentFrame < frames.length - 1) {
      timer = setTimeout(() => {
        setCurrentFrame(prev => prev + 1);
      }, 1000 / speed);
    } else if (currentFrame === frames.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrame, frames.length, speed]);

  const togglePlay = () => {
    if (currentFrame === frames.length - 1) setCurrentFrame(0);
    setIsPlaying(prev => !prev);
    setIsEditing(false); // If they press play/pause, it shouldn't be in edit mode
  };

  const reset = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
    setIsEditing(true);
  };

  useVisualizerKeyboard({
    onStart: togglePlay,
    onTogglePlayPause: togglePlay,
    sorting: isPlaying,
    onReset: reset,
    speed: speed,
    onSpeedChange: setSpeed,
  });

  const stepForward = () => {
    if (currentFrame < frames.length - 1) {
      setCurrentFrame(prev => prev + 1);
      setIsEditing(false);
    }
  };

  const stepBackward = () => {
    if (currentFrame > 0) {
      setCurrentFrame(prev => prev - 1);
      setIsEditing(false);
    }
  };

  const currentFrameData = frames[currentFrame] || {};

  return (
    <div className="mt-8 space-y-6">
      {/* Main Visualizer Area */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isEditing 
                  ? "bg-primary text-white" 
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300"
              }`}
            >
              <Settings2 className="h-4 w-4" />
              {isEditing ? "Editing Mode" : "Visualization Mode"}
            </button>
            {!isEditing && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                  <Info className="h-4 w-4 text-primary" />
                  {currentFrameData.description || "Ready to start"}
                </div>
                {currentFrameData.queue && currentFrameData.queue.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-primary dark:bg-blue-900/20 dark:text-[#c27cf7]">
                    Queue: [{currentFrameData.queue.join(", ")}]
                  </div>
                )}
                {currentFrameData.stack && currentFrameData.stack.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-600 dark:bg-purple-900/20 dark:text-[#c27cf7]">
                    Stack: [{currentFrameData.stack.join(", ")}]
                  </div>
                )}
                {currentFrameData.result && currentFrameData.result.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
                    Order: {currentFrameData.result.join(" → ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onUpdateNodes={setNodes}
          onUpdateEdges={setEdges}
          animationState={!isEditing ? currentFrameData : {}}
          interactive={isEditing}
          isWeighted={algorithm === "dijkstra" || algorithm === "prim" || algorithm === "kruskal"}
          isDirected={algorithm === "dijkstra" || algorithm === "topological-sort"}
          className="w-full"
        />

        {/* Controls Bar */}
        <PlaybackControls
          isPaused={!isPlaying}
          onTogglePlayPause={togglePlay}
          speed={speed}
          onSpeedChange={setSpeed}
          onIncreaseSpeed={() => setSpeed(s => Math.min(s + 0.5, 3))}
          onDecreaseSpeed={() => setSpeed(s => Math.max(s - 0.5, 0.5))}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onReset={reset}
          progressText={`${currentFrame + 1} / ${frames.length || 1}`}
          disabled={frames.length === 0}
        />
      </div>

      {/* Info & Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Complexity Card */}
          <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <BarChart3 className="h-5 w-5" />
              <h3 className="font-bold">Complexity Analysis</h3>
            </div>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complexityData[algorithm]} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="currentColor" className="text-[10px] text-surface-500" />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-surface-200 bg-white p-2 text-xs shadow-lg dark:border-surface-800 dark:bg-surface-950">
                            <p className="font-bold text-primary">{payload[0].payload.full}</p>
                            <p className="font-mono font-bold text-surface-900 dark:text-white">{payload[0].payload.label}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {complexityData[algorithm].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "var(--color-primary)" : "var(--color-success)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500">Worst Case Time</span>
                <span className="font-mono font-bold text-primary">{complexityData[algorithm][0].label}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500">Worst Case Space</span>
                <span className="font-mono font-bold text-success">{complexityData[algorithm][1].label}</span>
              </div>
            </div>
          </div>

          {/* Algorithm Comparison */}
          <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <h3 className="mb-4 text-sm font-bold text-surface-900 dark:text-white">Algorithm Comparison</h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-200)" />
                  <XAxis dataKey="name" stroke="currentColor" className="text-[10px] text-surface-500" />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-950)', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Bar dataKey="time" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Time Complexity Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[10px] text-surface-500 leading-tight">
              Higher score indicates more operations or complex data structures involved in the worst case.
            </p>
          </div>
        </div>

        {/* Adjacency Representations */}
        <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
          <h3 className="mb-4 text-sm font-bold text-surface-900 dark:text-white">Adjacency Representation</h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-surface-500">Adjacency List</h4>
              <div className="max-h-64 overflow-auto rounded-lg bg-surface-50 p-3 font-mono text-[11px] dark:bg-surface-950">
                {nodes.map(node => {
                  const neighbors = edges
                    .filter(e => e.from === node.id || (!e.directed && e.to === node.id))
                    .map(e => e.from === node.id ? e.to : e.from);
                  return (
                    <div key={node.id} className="mb-1">
                      <span className="text-primary font-bold">{node.label}</span>: [{neighbors.join(", ")}]
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-surface-500">Adjacency Matrix</h4>
              <div className="overflow-auto rounded-lg bg-surface-50 p-3 font-mono text-[11px] dark:bg-surface-950">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr>
                      <th className="p-1"></th>
                      {nodes.map(n => <th key={n.id} className="p-1 text-primary">{n.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map(row => (
                      <tr key={row.id}>
                        <td className="p-1 font-bold text-primary">{row.label}</td>
                        {nodes.map(col => {
                          const edge = edges.find(e => 
                            (e.from === row.id && e.to === col.id) || 
                            (!e.directed && ((e.from === row.id && e.to === col.id) || (e.from === col.id && e.to === row.id)))
                          );
                          return (
                            <td key={col.id} className="border border-surface-200 p-1 dark:border-surface-800">
                              {edge ? (algorithm === "dijkstra" || algorithm === "prim" || algorithm === "kruskal" ? edge.weight : 1) : 0}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
