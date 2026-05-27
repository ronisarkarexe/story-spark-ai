"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

function generateFibonacciFrames(n) {
  const frames = [];
  const stack = [];
  let frameIdCounter = 0;
  const treeNodesMap = {};

  function prebuildTree(val, path = "root") {
    treeNodesMap[path] = {
      id: path,
      label: `fib(${val})`,
      val,
      status: "pending",
      result: null,
      parentId: path.includes("-") ? path.substring(0, path.lastIndexOf("-")) : null,
    };
    if (val <= 1) return;
    prebuildTree(val - 1, path + "-L");
    prebuildTree(val - 2, path + "-R");
  }

  prebuildTree(n);

  function fib(val, path = "root", parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "fib",
      n: val,
      status: "calling",
      retVal: null,
      parentId,
      path,
    };
    stack.push(currentFrame);
    treeNodesMap[path].status = "active";

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 1,
      description: `Calling fib(${val}). Pushing onto the call stack and activating tree node.`,
      phase: "call",
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 2,
      description: `Checking base case condition for fib(${val}): is n <= 1?`,
      phase: "call",
      activeFrameId: myId,
    });

    if (val <= 1) {
      stack[stack.length - 1].status = "base_case";
      treeNodesMap[path].status = "base";
      treeNodesMap[path].result = val;
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        activeLine: 2,
        description: `Base case met! fib(${val}) returns ${val}.`,
        phase: "basecase",
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = val;
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        activeLine: 2,
        description: `Returning ${val} from fib(${val}). Stack frame is ready to pop.`,
        phase: "return",
        activeFrameId: myId,
      });

      stack.pop();
      return val;
    }

    stack[stack.length - 1].status = "waiting_L";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `fib(${val}) requires left term fib(${val - 1}). Calling fib(${val - 1}).`,
      phase: "call",
      activeFrameId: myId,
    });

    const leftVal = fib(val - 1, path + "-L", myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "waiting_R";
    stack[myFrameIndex].leftVal = leftVal;
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `Left child returned ${leftVal}. Now fib(${val}) requires right term fib(${val - 2}). Calling fib(${val - 2}).`,
      phase: "call",
      activeFrameId: myId,
    });

    const rightVal = fib(val - 2, path + "-R", myId);

    const myFrameIndex2 = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex2].status = "calculating";
    stack[myFrameIndex2].rightVal = rightVal;
    stack[myFrameIndex2].retVal = leftVal + rightVal;
    treeNodesMap[path].status = "returned";
    treeNodesMap[path].result = leftVal + rightVal;

    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex2 + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `Right child returned ${rightVal}. Calculating fib(${val}) = left (${leftVal}) + right (${rightVal}) = ${leftVal + rightVal}.`,
      phase: "return",
      activeFrameId: myId,
    });

    stack[myFrameIndex2].status = "returning";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex2 + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `Returning ${leftVal + rightVal} from fib(${val}). Stack frame is ready to pop.`,
      phase: "return",
      activeFrameId: myId,
    });

    stack.pop();
    return leftVal + rightVal;
  }

  const finalResult = fib(n);
  frames.push({
    stack: [],
    treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
    activeLine: 0,
    description: `Recursion finished! Final returned value is ${finalResult}.`,
    phase: "completed",
    activeFrameId: null,
  });

  return frames;
}

const getCoords = (path, n) => {
  const coordsMap = {
    1: {
      root: { x: 200, y: 40 },
    },
    2: {
      root: { x: 200, y: 40 },
      "root-L": { x: 100, y: 120 },
      "root-R": { x: 300, y: 120 },
    },
    3: {
      root: { x: 200, y: 40 },
      "root-L": { x: 110, y: 110 },
      "root-L-L": { x: 60, y: 180 },
      "root-L-R": { x: 160, y: 180 },
      "root-R": { x: 290, y: 110 },
    },
    4: {
      root: { x: 200, y: 35 },
      "root-L": { x: 110, y: 95 },
      "root-L-L": { x: 60, y: 155 },
      "root-L-L-L": { x: 30, y: 215 },
      "root-L-L-R": { x: 90, y: 215 },
      "root-L-R": { x: 160, y: 155 },
      "root-R": { x: 290, y: 95 },
      "root-R-L": { x: 240, y: 155 },
      "root-R-R": { x: 340, y: 155 },
    },
  };
  return coordsMap[n]?.[path] || { x: 200, y: 35 };
};

const codeLines = [
  { line: 1, code: "function fib(n) {" },
  { line: 2, code: "  if (n <= 1) return n;" },
  { line: 3, code: "  return fib(n - 1) + fib(n - 2);" },
  { line: 4, code: "}" },
];

const FibonacciAnimation = () => {
  const [nVal, setNVal] = useState("3");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(-1);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const frames = useMemo(() => {
    if (!isVisualizing) return [];
    const n = parseInt(nVal, 10);
    if (isNaN(n) || n < 1) return [];
    return generateFibonacciFrames(n);
  }, [nVal, isVisualizing]);

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
    const n = parseInt(nVal, 10);
    if (isNaN(n) || n < 1) {
      setErrorMsg("Please enter an integer >= 1.");
      return;
    }
    if (n > 4) {
      setErrorMsg("Please select N <= 4 to keep the recursion tree legible on the canvas.");
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
    activeLine: 0,
    description: "Enter N (between 1 and 4) and click Visualize Go!",
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
  const activeTreeNodes = activeFrameData.treeNodes || [];
  const activeLine = activeFrameData.activeLine;

  const stackColors = {
    calling: "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-200",
    checking_base: "bg-[#fef3c7] dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200",
    base_case: "bg-[#dcfce7] dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    waiting: "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-400",
    waiting_L: "bg-[#fae8ff] dark:bg-purple-950/30 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    waiting_R: "bg-[#f5e0ff] dark:bg-fuchsia-950/30 border-fuchsia-400 dark:border-fuchsia-800 text-fuchsia-700 dark:text-fuchsia-300",
    calculating: "bg-[#ffedd5] dark:bg-orange-950/40 border-orange-400 dark:border-orange-700 text-orange-800 dark:text-orange-200",
    returning: "bg-[#fee2e2] dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  };

  const treeNodeColors = {
    pending: "fill-gray-100 stroke-gray-300 dark:fill-zinc-800 dark:stroke-zinc-700 text-gray-400 dark:text-zinc-500",
    active: "fill-sky-100 stroke-sky-500 dark:fill-sky-950 dark:stroke-sky-400 text-sky-800 dark:text-sky-200 font-bold stroke-2",
    base: "fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950 dark:stroke-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold stroke-2 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    returned: "fill-teal-100 stroke-teal-500 dark:fill-teal-950 dark:stroke-teal-400 text-teal-800 dark:text-teal-200 font-bold",
  };

  return (
    <main className="container mx-auto">
      {/* Configuration Header */}
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="nVal">
              Input Value (N)
            </label>
            <input
              type="number"
              id="nVal"
              min="1"
              max="4"
              value={nVal}
              onChange={(e) => {
                setNVal(e.target.value);
                handleReset();
              }}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 transition duration-300"
              placeholder="e.g. 3"
              disabled={isVisualizing}
            />
          </div>

          <div className="flex gap-2">
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
        <div className="md:col-span-4 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Active Call Stack
          </h3>
          {activeStack.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
              <p className="text-gray-400 dark:text-zinc-500 text-sm">Call Stack is Empty</p>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-2 items-center justify-end h-[340px] overflow-y-auto p-4 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/20">
              {activeStack.map((frame, index) => {
                const isTop = index === activeStack.length - 1;
                const statusClass = stackColors[frame.status] || stackColors.waiting;

                return (
                  <div
                    key={frame.id}
                    className={`w-full max-w-[280px] p-2.5 rounded-lg border flex flex-col items-center transition-all duration-300 ${statusClass} ${
                      isTop ? "ring-2 ring-primary dark:ring-primary-light ring-offset-2 dark:ring-offset-zinc-950" : ""
                    }`}
                  >
                    <div className="flex justify-between w-full font-mono text-[10px] font-semibold">
                      <span>fib(n = {frame.n})</span>
                      <span className="capitalize text-[9px]">{frame.status.replace("_", " ")}</span>
                    </div>
                    <div className="mt-1.5 text-[10px] w-full text-center">
                      {frame.leftVal !== undefined && (
                        <span className="block text-[9px] text-gray-500 dark:text-zinc-400">
                          leftVal = {frame.leftVal}
                        </span>
                      )}
                      {frame.rightVal !== undefined && (
                        <span className="block text-[9px] text-gray-500 dark:text-zinc-400">
                          rightVal = {frame.rightVal}
                        </span>
                      )}
                      {frame.retVal !== null && (
                        <span className="font-bold text-[#10b981] dark:text-[#34d399] block">
                          returns {frame.retVal}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Tree and Code Trace */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Tree panel */}
          <div className="w-full border border-gray-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow flex flex-col items-center">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-2 uppercase tracking-wider text-center">
              Recursion Tree
            </h3>
            <svg viewBox="0 0 400 250" className="w-full max-w-[400px] h-[220px]">
              {activeTreeNodes.map((node) => {
                if (!node.parentId) return null;
                const parent = activeTreeNodes.find((n) => n.id === node.parentId);
                if (!parent) return null;
                const childCoords = getCoords(node.id, parseInt(nVal, 10));
                const parentCoords = getCoords(node.parentId, parseInt(nVal, 10));

                let edgeColor = "#e4e4e7";
                let strokeWidth = 1.5;
                if (node.status === "active" || node.status === "returned" || node.status === "base") {
                  edgeColor = "#0d9488";
                  strokeWidth = 2;
                }

                return (
                  <line
                    key={`edge-${node.id}`}
                    x1={parentCoords.x}
                    y1={parentCoords.y}
                    x2={childCoords.x}
                    y2={childCoords.y}
                    stroke={edgeColor}
                    strokeWidth={strokeWidth}
                    className="transition-colors duration-300"
                  />
                );
              })}

              {activeTreeNodes.map((node) => {
                const coords = getCoords(node.id, parseInt(nVal, 10));
                const nodeClass = treeNodeColors[node.status] || treeNodeColors.pending;

                return (
                  <g key={`node-${node.id}`}>
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="15"
                      className={`${nodeClass} transition-colors duration-300`}
                    />
                    <text
                      x={coords.x}
                      y={coords.y + 3}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold select-none fill-current"
                    >
                      {node.val}
                    </text>
                    {node.result !== null && (
                      <g>
                        <rect
                          x={coords.x + 8}
                          y={coords.y - 18}
                          width="16"
                          height="12"
                          rx="3"
                          className="fill-teal-500 text-white"
                        />
                        <text
                          x={coords.x + 16}
                          y={coords.y - 10}
                          textAnchor="middle"
                          className="text-[8px] font-bold fill-white"
                        >
                          {node.result}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Code Trace panel */}
          <div className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <span className="text-zinc-400 font-semibold">Active Code Trace</span>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
            </div>
            <div className="p-4 text-zinc-300 leading-relaxed">
              {codeLines.map((ln) => {
                const isActive = ln.line === activeLine;
                return (
                  <div
                    key={ln.line}
                    className={`flex gap-4 px-2 py-0.5 rounded transition-colors duration-200 ${
                      isActive ? "bg-[#0d9488]/20 border-l-4 border-[#0d9488] text-white font-bold" : "border-l-4 border-transparent"
                    }`}
                  >
                    <span className="text-zinc-600 select-none w-4 text-right">{ln.line}</span>
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

export default FibonacciAnimation;
