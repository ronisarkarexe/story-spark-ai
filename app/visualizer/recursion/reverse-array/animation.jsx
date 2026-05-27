"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

function generateReverseFrames(initialArr) {
  const frames = [];
  const stack = [];
  let arr = [...initialArr];
  let frameIdCounter = 0;

  function run(l, r, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "reverse",
      l,
      r,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 1,
      lIndex: l,
      rIndex: r,
      isSwapping: false,
      description: `Calling reverse(l = ${l}, r = ${r}). Pushing stack frame.`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 2,
      lIndex: l,
      rIndex: r,
      isSwapping: false,
      description: `Checking base case condition: is l (${l}) >= r (${r})?`,
      activeFrameId: myId,
    });

    if (l >= r) {
      stack[stack.length - 1].status = "base_case";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        arr: [...arr],
        activeLine: 2,
        lIndex: l,
        rIndex: r,
        isSwapping: false,
        description: `Base case met! l (${l}) >= r (${r}). Stopping recursion.`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        arr: [...arr],
        activeLine: 2,
        lIndex: l,
        rIndex: r,
        isSwapping: false,
        description: `Returning from reverse(l = ${l}, r = ${r}). Ready to pop.`,
        activeFrameId: myId,
      });

      stack.pop();
      return;
    }

    // Swap
    stack[stack.length - 1].status = "swapping";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 3,
      lIndex: l,
      rIndex: r,
      isSwapping: true,
      description: `Swapping elements at index ${l} (${arr[l]}) and index ${r} (${arr[r]}).`,
      activeFrameId: myId,
    });

    const temp = arr[l];
    arr[l] = arr[r];
    arr[r] = temp;

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 3,
      lIndex: l,
      rIndex: r,
      isSwapping: false,
      description: `Swap complete. Array is now: [${arr.join(", ")}].`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "waiting";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 4,
      lIndex: l,
      rIndex: r,
      isSwapping: false,
      description: `Calling recursively for inner indices: reverse(l = ${l + 1}, r = ${r - 1}).`,
      activeFrameId: myId,
    });

    run(l + 1, r - 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "returning";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      arr: [...arr],
      activeLine: 4,
      lIndex: l,
      rIndex: r,
      isSwapping: false,
      description: `Returning back to caller reverse(l = ${l}, r = ${r}). Stack frame is ready to pop.`,
      activeFrameId: myId,
    });

    stack.pop();
  }

  run(0, arr.length - 1);
  frames.push({
    stack: [],
    arr: [...arr],
    activeLine: 0,
    lIndex: -1,
    rIndex: -1,
    isSwapping: false,
    description: `Recursion complete! Final reversed array is: [${arr.join(", ")}].`,
    activeFrameId: null,
  });

  return frames;
}

const codeLines = [
  { line: 1, code: "function reverse(l, r, arr) {" },
  { line: 2, code: "  if (l >= r) return;" },
  { line: 3, code: "  swap(arr, l, r);" },
  { line: 4, code: "  reverse(l + 1, r - 1, arr);" },
  { line: 5, code: "}" },
];

const ReverseArrayAnimation = () => {
  const [arrayInput, setArrayInput] = useState("10, 20, 30, 40, 50");
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
    return generateReverseFrames(parsedArray);
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
    if (parsedArray.length > 7) {
      setErrorMsg("Please keep array size <= 7 for clear visualization.");
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

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 4) + 4; // 4 to 7
    const elements = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArrayInput(elements.join(", "));
    handleReset();
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
    arr: parsedArray,
    activeLine: 0,
    lIndex: -1,
    rIndex: -1,
    isSwapping: false,
    description: "Provide an array and click Visualize Go!",
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
  const currentArray = activeFrameData.arr || [];
  const lPointer = activeFrameData.lIndex;
  const rPointer = activeFrameData.rIndex;
  const isSwapping = activeFrameData.isSwapping;

  const stackColors = {
    calling: "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-200",
    checking_base: "bg-[#fef3c7] dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200",
    base_case: "bg-[#dcfce7] dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200",
    swapping: "bg-[#fae8ff] dark:bg-purple-950/30 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
    waiting: "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-400",
    returning: "bg-[#fee2e2] dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200",
  };

  return (
    <main className="container mx-auto">
      {/* Configuration Header */}
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="arrayInput">
              Array Elements (comma-separated)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="arrayInput"
                value={arrayInput}
                onChange={(e) => {
                  setArrayInput(e.target.value);
                  handleReset();
                }}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 transition duration-300"
                placeholder="e.g. 1, 2, 3, 4"
                disabled={isVisualizing}
              />
              <button
                type="button"
                onClick={generateRandomArray}
                className="px-4 py-2 font-bold bg-[#0d9488] text-white rounded-lg hover:bg-[#0b766e] transition-all duration-200"
                disabled={isVisualizing}
              >
                Random
              </button>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto justify-end">
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
                      <span>reverse(l = {frame.l}, r = {frame.r})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Middle: Array Blocks representation */}
        <div className="md:col-span-4 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Array Visualization
          </h3>
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 min-h-64">
            <div className="flex gap-2.5 justify-center items-end">
              {currentArray.map((val, idx) => {
                const isLeft = idx === lPointer;
                const isRight = idx === rPointer;
                const active = isLeft || isRight;

                let borderStyle = "border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800";
                if (active) {
                  borderStyle = isSwapping
                    ? "border-purple-500 dark:border-purple-400 bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-100 animate-pulse stroke-2"
                    : "border-teal-500 dark:border-teal-400 bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-100 font-bold stroke-2";
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all duration-300 ${borderStyle}`}
                    >
                      {val}
                    </div>
                    <span className="text-[10px] text-gray-400 select-none">
                      {isLeft && "L"}
                      {isRight && "R"}
                      {!isLeft && !isRight && `[${idx}]`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Code Block Trace */}
        <div className="md:col-span-4 flex flex-col">
          <div className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <span className="text-zinc-400 font-semibold">Active Code Trace</span>
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

export default ReverseArrayAnimation;
