"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

function generateSumFrames(n) {
  const frames = [];
  const stack = [];
  let frameIdCounter = 0;

  function sum(val, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "sum",
      n: val,
      status: "calling",
      retVal: null,
      parentId,
    };
    stack.push(currentFrame);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 1,
      description: `Calling sum(${val}). Pushing a new stack frame onto the Call Stack.`,
      phase: "call",
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 2,
      description: `Checking if base case condition is met: is n (${val}) <= 0?`,
      phase: "call",
      activeFrameId: myId,
    });

    if (val <= 0) {
      stack[stack.length - 1].status = "base_case";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        description: `Base case met! n (${val}) <= 0. Returning 0.`,
        phase: "basecase",
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = 0;
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        description: `Returning 0 from sum(${val}). Stack frame is ready to pop.`,
        phase: "return",
        activeFrameId: myId,
      });

      stack.pop();
      return 0;
    }

    stack[stack.length - 1].status = "waiting";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 4,
      description: `Base case not met. We need to evaluate sum(${val - 1}) first. Calling sum(${val - 1}).`,
      phase: "call",
      activeFrameId: myId,
    });

    const subResult = sum(val - 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "calculating";
    stack[myFrameIndex].subResult = subResult;
    stack[myFrameIndex].retVal = val + subResult;

    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      activeLine: 4,
      description: `Received return value ${subResult} from sum(${val - 1}). Calculating sum(${val}) = ${val} + sum(${val - 1}) = ${val} + ${subResult} = ${val + subResult}.`,
      phase: "return",
      activeFrameId: myId,
    });

    stack[myFrameIndex].status = "returning";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      activeLine: 4,
      description: `Returning ${val + subResult} from sum(${val}). Stack frame is ready to pop.`,
      phase: "return",
      activeFrameId: myId,
    });

    stack.pop();
    return val + subResult;
  }

  const finalResult = sum(n);
  frames.push({
    stack: [],
    activeLine: 0,
    description: `Recursion finished! Final returned value is ${finalResult}.`,
    phase: "completed",
    activeFrameId: null,
  });

  return frames;
}

const codeLines = [
  { line: 1, code: "function sum(n) {" },
  { line: 2, code: "  if (n <= 0)" },
  { line: 3, code: "    return 0;" },
  { line: 4, code: "  return n + sum(n - 1);" },
  { line: 5, code: "}" },
];

const SumAnimation = () => {
  const [nVal, setNVal] = useState("3");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(-1);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const frames = useMemo(() => {
    if (!isVisualizing) return [];
    const n = parseInt(nVal, 10);
    if (isNaN(n) || n < 0) return [];
    return generateSumFrames(n);
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
    if (isNaN(n) || n < 0) {
      setErrorMsg("Please enter a non-negative integer.");
      return;
    }
    if (n > 5) {
      setErrorMsg("Please select N <= 5 to keep the call stack visualization fit for the screen.");
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
    activeLine: 0,
    description: "Enter N (between 0 and 5) and click Visualize Go!",
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

  const stackColors = {
    calling: "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-200",
    checking_base: "bg-[#fef3c7] dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200",
    base_case: "bg-[#dcfce7] dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    waiting: "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-400",
    calculating: "bg-[#ffedd5] dark:bg-orange-950/40 border-orange-400 dark:border-orange-700 text-orange-800 dark:text-orange-200",
    returning: "bg-[#fee2e2] dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
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
              min="0"
              max="5"
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
        <div className="md:col-span-6 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Active Call Stack
          </h3>
          {activeStack.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
              <p className="text-gray-400 dark:text-zinc-500 text-sm">Call Stack is Empty</p>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-2 items-center justify-end h-80 overflow-y-auto p-4 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/20">
              {activeStack.map((frame, index) => {
                const isTop = index === activeStack.length - 1;
                const statusClass = stackColors[frame.status] || stackColors.waiting;

                return (
                  <div
                    key={frame.id}
                    className={`w-full max-w-[280px] p-3 rounded-lg border flex flex-col items-center transition-all duration-300 ${statusClass} ${
                      isTop ? "ring-2 ring-primary dark:ring-primary-light ring-offset-2 dark:ring-offset-zinc-950" : ""
                    }`}
                  >
                    <div className="flex justify-between w-full font-mono text-xs font-semibold">
                      <span>sum(n = {frame.n})</span>
                      <span className="capitalize">{frame.status.replace("_", " ")}</span>
                    </div>
                    <div className="mt-2 text-xs">
                      {frame.subResult !== undefined && (
                        <span className="block text-[10px] text-gray-500 dark:text-zinc-400">
                          subResult = {frame.subResult}
                        </span>
                      )}
                      {frame.retVal !== null && (
                        <span className="font-bold text-[#10b981] dark:text-[#34d399] mt-1 block">
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

        {/* Right Side: Code Block Trace */}
        <div className="md:col-span-6 flex flex-col">
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

export default SumAnimation;
