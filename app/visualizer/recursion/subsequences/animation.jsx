"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

function generateSubsequencesFrames(arr) {
  const frames = [];
  const stack = [];
  const completed = [];
  const treeNodesMap = {};

  function prebuildTree(idx, currentPath = "root") {
    treeNodesMap[currentPath] = {
      id: currentPath,
      label: `idx=${idx}`,
      status: "pending",
      sub: [],
      parentId: currentPath.includes("-") ? currentPath.substring(0, currentPath.lastIndexOf("-")) : null,
    };
    if (idx === arr.length) return;
    prebuildTree(idx + 1, currentPath + "-L"); // Take
    prebuildTree(idx + 1, currentPath + "-R"); // Not Take
  }

  prebuildTree(0);

  function run(idx, current, path = "root", parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "solve",
      index: idx,
      current: [...current],
      status: "calling",
      parentId,
      path,
    };
    stack.push(currentFrame);
    treeNodesMap[path].status = "active";
    treeNodesMap[path].sub = [...current];

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 1,
      description: `Calling solve(index = ${idx}, current = [${current.join(", ")}]).`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 2,
      description: `Checking base case: is index (${idx}) == array length (${arr.length})?`,
      activeFrameId: myId,
    });

    if (idx === arr.length) {
      stack[stack.length - 1].status = "base_case";
      treeNodesMap[path].status = "base";
      completed.push([...current]);
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        completed: [...completed],
        activeLine: 3,
        description: `Base case met! Adding [${current.join(", ")}] to list of subsequences.`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        completed: [...completed],
        activeLine: 3,
        description: `Returning from base case call. Ready to pop stack frame.`,
        activeFrameId: myId,
      });

      stack.pop();
      return;
    }

    // Choice 1: Take element
    stack[stack.length - 1].status = "taking";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 5,
      description: `Choice 1: TAKE element arr[${idx}] (${arr[idx]}). Adding to current.`,
      activeFrameId: myId,
    });

    const taken = [...current, arr[idx]];
    
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 6,
      description: `Calling solve(index = ${idx + 1}, current = [${taken.join(", ")}]).`,
      activeFrameId: myId,
    });

    run(idx + 1, taken, path + "-L", myId);

    // Choice 2: Don't take element
    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "not_taking";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 8,
      description: `Choice 2: BACKTRACK (remove arr[${idx}] = ${arr[idx]}) and DO NOT TAKE it.`,
      activeFrameId: myId,
    });

    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 9,
      description: `Calling solve(index = ${idx + 1}, current = [${current.join(", ")}]).`,
      activeFrameId: myId,
    });

    run(idx + 1, current, path + "-R", myId);

    const myFrameIndex2 = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex2].status = "returning";
    treeNodesMap[path].status = "returned";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex2 + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 9,
      description: `Both choices explored for index ${idx}. Returning.`,
      activeFrameId: myId,
    });

    stack.pop();
  }

  let frameIdCounter = 0;
  run(0, []);
  frames.push({
    stack: [],
    treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
    completed: [...completed],
    activeLine: 0,
    description: `Subsequences generation completed! Total subsequences: ${completed.length}.`,
    activeFrameId: null,
  });

  return frames;
}

const getCoords = (path, n) => {
  const coordsMap = {
    2: {
      root: { x: 200, y: 35 },
      "root-L": { x: 100, y: 100 },
      "root-L-L": { x: 50, y: 170 },
      "root-L-R": { x: 150, y: 170 },
      "root-R": { x: 300, y: 100 },
      "root-R-L": { x: 250, y: 170 },
      "root-R-R": { x: 350, y: 170 },
    },
    3: {
      root: { x: 200, y: 30 },
      "root-L": { x: 105, y: 80 },
      "root-L-L": { x: 55, y: 140 },
      "root-L-L-L": { x: 30, y: 200 },
      "root-L-L-R": { x: 80, y: 200 },
      "root-L-R": { x: 155, y: 140 },
      "root-L-R-L": { x: 130, y: 200 },
      "root-L-R-R": { x: 180, y: 200 },
      "root-R": { x: 295, y: 80 },
      "root-R-L": { x: 245, y: 140 },
      "root-R-L-L": { x: 220, y: 200 },
      "root-R-L-R": { x: 270, y: 200 },
      "root-R-R": { x: 345, y: 140 },
      "root-R-R-L": { x: 320, y: 200 },
      "root-R-R-R": { x: 370, y: 200 },
    },
  };
  return coordsMap[n]?.[path] || { x: 200, y: 30 };
};

const codeLines = [
  { line: 1, code: "function solve(index, current, arr) {" },
  { line: 2, code: "  if (index === arr.length) {" },
  { line: 3, code: "    print(current); return;" },
  { line: 4, code: "  }" },
  { line: 5, code: "  current.push(arr[index]);" },
  { line: 6, code: "  solve(index + 1, current, arr);" },
  { line: 7, code: "  current.pop();" },
  { line: 8, code: "  solve(index + 1, current, arr);" },
  { line: 9, code: "}" },
];

const SubsequencesAnimation = () => {
  const [arrayInput, setArrayInput] = useState("1, 2, 3");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(-1);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const parsedArray = useMemo(() => {
    return arrayInput
      .split(",")
      .map((el) => el.trim())
      .filter((el) => el !== "")
      .map((el) => parseInt(el, 10))
      .filter((el) => !isNaN(el));
  }, [arrayInput]);

  const frames = useMemo(() => {
    if (!isVisualizing || parsedArray.length === 0) return [];
    return generateSubsequencesFrames(parsedArray);
  }, [parsedArray, isVisualizing]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentFrame < frames.length - 1) {
      timer = setTimeout(() => {
        setCurrentFrame((prev) => prev + 1);
      }, 1500 / speed);
    } else if (currentFrame === frames.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrame, frames.length, speed]);

  const handleGo = (e) => {
    e.preventDefault();
    if (parsedArray.length === 0) {
      setErrorMsg("Please enter a valid comma-separated array of integers.");
      return;
    }
    if (parsedArray.length < 2 || parsedArray.length > 3) {
      setErrorMsg("Please input an array of size 2 or 3 elements for the visualization.");
      return;
    }
    setErrorMsg("");
    setCurrentFrame(0);
    setIsVisualizing(true);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsVisualizing(false);
    setCurrentFrame(-1);
    setErrorMsg("");
  };

  const togglePlay = () => {
    if (currentFrame === frames.length - 1) {
      setCurrentFrame(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const stepForward = () => {
    if (currentFrame < frames.length - 1) {
      setCurrentFrame((prev) => prev + 1);
      setIsPlaying(false);
    }
  };

  const stepBackward = () => {
    if (currentFrame > 0) {
      setCurrentFrame((prev) => prev - 1);
      setIsPlaying(false);
    }
  };

  const activeFrameData = frames[currentFrame] || {
    stack: [],
    treeNodes: [],
    completed: [],
    activeLine: 0,
    description: "Provide an array of 2 or 3 elements and click Visualize Go!",
  };

  useVisualizerKeyboard({
    onStart: togglePlay,
    onTogglePlayPause: togglePlay,
    sorting: isPlaying,
    onReset: handleReset,
    speed: speed,
    onSpeedChange: setSpeed,
  });

  const activeStack = activeFrameData.stack || [];
  const activeLine = activeFrameData.activeLine;
  const activeTreeNodes = activeFrameData.treeNodes || [];
  const completedSubsets = activeFrameData.completed || [];

  const stackColors = {
    calling: "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-200",
    checking_base: "bg-[#fef3c7] dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200",
    base_case: "bg-[#dcfce7] dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200",
    taking: "bg-[#fae8ff] dark:bg-purple-950/30 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    not_taking: "bg-[#ffedd5] dark:bg-orange-950/40 border-orange-400 dark:border-orange-700 text-orange-800 dark:text-orange-200",
    returning: "bg-[#fee2e2] dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200",
  };

  const treeNodeColors = {
    pending: "fill-gray-100 stroke-gray-300 dark:fill-zinc-800 dark:stroke-zinc-700 text-gray-400 dark:text-zinc-500",
    active: "fill-sky-100 stroke-sky-500 dark:fill-sky-950 dark:stroke-sky-400 text-sky-800 dark:text-sky-200 font-bold stroke-2",
    base: "fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950 dark:stroke-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold stroke-2",
    returned: "fill-teal-150 stroke-teal-500 dark:fill-teal-950 dark:stroke-teal-400 text-teal-800 dark:text-teal-200 font-bold",
  };

  return (
    <main className="container mx-auto">
      {/* Configuration Header */}
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="arrayInput">
              Array Elements (comma-separated, size 2 or 3)
            </label>
            <input
              type="text"
              id="arrayInput"
              value={arrayInput}
              onChange={(e) => {
                setArrayInput(e.target.value);
                handleReset();
              }}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 transition duration-300"
              placeholder="e.g. 1, 2, 3"
              disabled={isVisualizing}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <GoButton onClick={handleGo} isAnimating={isVisualizing} disabled={isVisualizing} />
            <ResetButton onReset={handleReset} isAnimating={isVisualizing} />
          </div>
        </div>

        {errorMsg && <p className="text-red-500 dark:text-red-400 text-xs font-semibold mt-2">{errorMsg}</p>}

        {isVisualizing && (
          <div className="mt-4">
            <PlaybackControls
              isPaused={!isPlaying}
              onTogglePlayPause={togglePlay}
              speed={speed}
              onSpeedChange={setSpeed}
              onIncreaseSpeed={() => setSpeed((s) => Math.min(s + 0.5, 5))}
              onDecreaseSpeed={() => setSpeed((s) => Math.max(s - 0.5, 0.5))}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onReset={handleReset}
              progressText={`${currentFrame + 1} / ${frames.length || 1}`}
              disabled={frames.length === 0}
            />
          </div>
        )}
      </form>

      {/* Narrative Explanation Block */}
      <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl border border-teal-100 bg-teal-50/40 dark:border-teal-900/30 dark:bg-teal-950/10 text-teal-800 dark:text-teal-200">
        <p className="text-center font-medium text-sm leading-relaxed">
          {activeFrameData.description}
        </p>
      </div>

      {/* Visual Workspace */}
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-12 mb-8">
        {/* Left Side: Call Stack */}
        <div className="md:col-span-3 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Call Stack
          </h3>
          {activeStack.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
              <p className="text-gray-400 dark:text-zinc-500 text-sm">Empty</p>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-2 items-center justify-end h-[340px] overflow-y-auto p-3 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/20">
              {activeStack.map((frame, index) => {
                const isTop = index === activeStack.length - 1;
                const statusClass = stackColors[frame.status] || stackColors.waiting;

                return (
                  <div
                    key={frame.id}
                    className={`w-full p-2 rounded-lg border flex flex-col items-center transition-all duration-300 ${statusClass} ${
                      isTop ? "ring-2 ring-primary dark:ring-primary-light ring-offset-2 dark:ring-offset-zinc-950" : ""
                    }`}
                  >
                    <div className="flex justify-between w-full font-mono text-[9px] font-semibold">
                      <span>solve(idx = {frame.index})</span>
                    </div>
                    <span className="text-[8px] text-zinc-500 dark:text-zinc-400 mt-1 block">
                      curr = [{frame.current.join(",")}]
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Middle: Recursion Decision Tree */}
        <div className="md:col-span-6 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Decision Tree
          </h3>
          <svg viewBox="0 0 400 250" className="w-full max-w-[400px] h-[220px]">
            {activeTreeNodes.map((node) => {
              if (!node.parentId) return null;
              const parent = activeTreeNodes.find((n) => n.id === node.parentId);
              if (!parent) return null;
              const childCoords = getCoords(node.id, parsedArray.length);
              const parentCoords = getCoords(node.parentId, parsedArray.length);

              let edgeColor = "#e4e4e7";
              let strokeWidth = 1.5;
              if (node.status === "active" || node.status === "returned" || node.status === "base") {
                edgeColor = "#0d9488";
                strokeWidth = 2;
              }

              return (
                <g key={`edge-g-${node.id}`}>
                  <line
                    x1={parentCoords.x}
                    y1={parentCoords.y}
                    x2={childCoords.x}
                    y2={childCoords.y}
                    stroke={edgeColor}
                    strokeWidth={strokeWidth}
                    className="transition-colors duration-300"
                  />
                  {/* Draw decision labels */}
                  <text
                    x={(parentCoords.x + childCoords.x) / 2}
                    y={(parentCoords.y + childCoords.y) / 2 - 4}
                    textAnchor="middle"
                    className="text-[7px] font-bold fill-zinc-400 dark:fill-zinc-500 select-none"
                  >
                    {node.id.endsWith("-L") ? "TAKE" : "SKIP"}
                  </text>
                </g>
              );
            })}

            {activeTreeNodes.map((node) => {
              const coords = getCoords(node.id, parsedArray.length);
              const nodeClass = treeNodeColors[node.status] || treeNodeColors.pending;

              return (
                <g key={`node-${node.id}`}>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="14"
                    className={`${nodeClass} transition-colors duration-300`}
                  />
                  <text
                    x={coords.x}
                    y={coords.y + 3}
                    textAnchor="middle"
                    className="text-[7px] font-mono font-bold select-none fill-current"
                  >
                    {node.label}
                  </text>
                  {node.status !== "pending" && (
                    <g>
                      <rect
                        x={coords.x - 20}
                        y={coords.y + 16}
                        width="40"
                        height="10"
                        rx="2"
                        className="fill-teal-500/10 stroke-teal-500/20 text-teal-600 dark:text-teal-400 stroke"
                      />
                      <text
                        x={coords.x}
                        y={coords.y + 23}
                        textAnchor="middle"
                        className="text-[6px] font-bold fill-current"
                      >
                        [{node.sub.join(",")}]
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Side: Generated Subsets & Code Trace */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {/* Subsets list */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-zinc-950 p-4 font-mono text-[10px] text-emerald-400 min-h-36 shadow-inner flex flex-col">
            <span className="text-zinc-500 font-semibold mb-2 uppercase tracking-wider text-center block text-[9px]">
              Subsets Generated
            </span>
            <div className="flex-1 overflow-y-auto max-h-32 flex flex-wrap gap-1.5 justify-center content-start">
              {completedSubsets.map((sub, idx) => (
                <span key={idx} className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 animate-fade-in">
                  [{sub.join(", ")}]
                </span>
              ))}
            </div>
          </div>

          {/* Code block trace */}
          <div className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 font-mono text-[10px] shadow-inner">
            <div className="p-3 text-zinc-300 leading-relaxed">
              {codeLines.map((ln) => {
                const isActive = ln.line === activeLine;
                return (
                  <div
                    key={ln.line}
                    className={`flex gap-3 px-1 py-0.5 rounded transition-colors duration-200 ${
                      isActive ? "bg-[#0d9488]/20 border-l-3 border-[#0d9488] text-white font-bold" : "border-l-3 border-transparent"
                    }`}
                  >
                    <span className="text-zinc-600 select-none w-3 text-right">{ln.line}</span>
                    <span>{ln.code}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubsequencesAnimation;
