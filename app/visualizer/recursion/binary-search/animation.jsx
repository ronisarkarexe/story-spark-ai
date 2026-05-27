"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

function generateBinarySearchFrames(arr, target) {
  const frames = [];
  const stack = [];
  let frameIdCounter = 0;

  function run(low, high, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "binarySearch",
      low,
      high,
      mid: null,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid: null,
      activeLine: 1,
      description: `Calling binarySearch(low = ${low}, high = ${high}). Pushing new stack frame.`,
      activeFrameId: myId,
    });

    // Check base case: low > high
    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid: null,
      activeLine: 2,
      description: `Checking base case: low (${low}) > high (${high})?`,
      activeFrameId: myId,
    });

    if (low > high) {
      stack[stack.length - 1].status = "not_found";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid: null,
        activeLine: 2,
        description: `Base case met: low (${low}) > high (${high}). Target element ${target} not found!`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid: null,
        activeLine: 2,
        description: `Returning -1 from binarySearch(low = ${low}, high = ${high}).`,
        activeFrameId: myId,
      });

      stack.pop();
      return -1;
    }

    // Compute mid
    const mid = Math.floor((low + high) / 2);
    stack[stack.length - 1].mid = mid;
    stack[stack.length - 1].status = "computing_mid";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid,
      activeLine: 4,
      description: `Computing mid index: mid = Math.floor((${low} + ${high}) / 2) = ${mid}. Element at mid is ${arr[mid]}.`,
      activeFrameId: myId,
    });

    // Check if target found
    stack[stack.length - 1].status = "checking_match";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid,
      activeLine: 5,
      description: `Checking if arr[mid] (${arr[mid]}) === target (${target})?`,
      activeFrameId: myId,
    });

    if (arr[mid] === target) {
      stack[stack.length - 1].status = "found";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid,
        activeLine: 5,
        description: `Target element found at index ${mid}!`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid,
        activeLine: 5,
        description: `Returning index ${mid} from binarySearch(low = ${low}, high = ${high}).`,
        activeFrameId: myId,
      });

      stack.pop();
      return mid;
    }

    // Check if target is smaller
    stack[stack.length - 1].status = "checking_less";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid,
      activeLine: 7,
      description: `Checking if target (${target}) < arr[mid] (${arr[mid]})?`,
      activeFrameId: myId,
    });

    if (target < arr[mid]) {
      stack[stack.length - 1].status = "searching_left";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid,
        activeLine: 8,
        description: `Target ${target} is smaller than ${arr[mid]}. Searching left half: binarySearch(low = ${low}, high = ${mid - 1}).`,
        activeFrameId: myId,
      });

      const res = run(low, mid - 1, myId);

      const myFrameIndex = stack.findIndex((f) => f.id === myId);
      if (myFrameIndex !== -1) {
        stack[myFrameIndex].status = "returning";
        frames.push({
          stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
          low,
          high,
          mid,
          activeLine: 8,
          description: `Returning ${res} to caller from binarySearch(low = ${low}, high = ${high}).`,
          activeFrameId: myId,
        });
        stack.pop();
      }
      return res;
    } else {
      stack[stack.length - 1].status = "searching_right";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid,
        activeLine: 10,
        description: `Target ${target} is greater than ${arr[mid]}. Searching right half: binarySearch(low = ${mid + 1}, high = ${high}).`,
        activeFrameId: myId,
      });

      const res = run(mid + 1, high, myId);

      const myFrameIndex = stack.findIndex((f) => f.id === myId);
      if (myFrameIndex !== -1) {
        stack[myFrameIndex].status = "returning";
        frames.push({
          stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
          low,
          high,
          mid,
          activeLine: 10,
          description: `Returning ${res} to caller from binarySearch(low = ${low}, high = ${high}).`,
          activeFrameId: myId,
        });
        stack.pop();
      }
      return res;
    }
  }

  const result = run(0, arr.length - 1);
  frames.push({
    stack: [],
    low: null,
    high: null,
    mid: null,
    activeLine: 0,
    description: `Recursion finished. Binary Search result index is ${result}.`,
    activeFrameId: null,
  });

  return frames;
}

const codeLines = [
  { line: 1, code: "function binarySearch(arr, target, low, high) {" },
  { line: 2, code: "  if (low > high) return -1;" },
  { line: 3, code: "" },
  { line: 4, code: "  let mid = Math.floor((low + high) / 2);" },
  { line: 5, code: "  if (arr[mid] === target) return mid;" },
  { line: 6, code: "" },
  { line: 7, code: "  if (target < arr[mid]) {" },
  { line: 8, code: "    return binarySearch(arr, target, low, mid - 1);" },
  { line: 9, code: "  } else {" },
  { line: 10, code: "    return binarySearch(arr, target, mid + 1, high);" },
  { line: 11, code: "  }" },
  { line: 12, code: "}" },
];

export default function BinarySearchAnimation() {
  const [arrayVal, setArrayVal] = useState("10, 20, 30, 40, 50, 60, 70, 80");
  const [targetVal, setTargetVal] = useState("60");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(-1);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const parsedArray = useMemo(() => {
    return arrayVal
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x))
      .sort((a, b) => a - b);
  }, [arrayVal]);

  const frames = useMemo(() => {
    if (!isVisualizing) return [];
    const target = parseInt(targetVal, 10);
    if (isNaN(target)) return [];
    return generateBinarySearchFrames(parsedArray, target);
  }, [parsedArray, targetVal, isVisualizing]);

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
      setErrorMsg("Please enter at least one integer value.");
      return;
    }
    const target = parseInt(targetVal, 10);
    if (isNaN(target)) {
      setErrorMsg("Please enter a valid target integer.");
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
    low: null,
    high: null,
    mid: null,
    activeLine: 0,
    description: "Click Visualize Go! to watch recursive search state building.",
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
  const activeLow = activeFrameData.low;
  const activeHigh = activeFrameData.high;
  const activeMid = activeFrameData.mid;

  const stackColors = {
    calling: "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-200",
    checking_base: "bg-[#fef3c7] dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200",
    computing_mid: "bg-[#fae8ff] dark:bg-purple-950/30 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    checking_match: "bg-teal-50 dark:bg-teal-950/20 border-teal-400 dark:border-teal-800 text-teal-800 dark:text-teal-200",
    found: "bg-[#dcfce7] dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200",
    not_found: "bg-[#fee2e2] dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200",
    returning: "bg-gray-150 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-700 text-zinc-850 dark:text-zinc-300",
  };

  return (
    <main className="container mx-auto">
      {/* Configuration Header */}
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="grid gap-4 sm:grid-cols-12 items-end">
          <div className="sm:col-span-7">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="arrayInput">
              Sorted Array (Comma Separated)
            </label>
            <input
              type="text"
              id="arrayInput"
              value={arrayVal}
              onChange={(e) => {
                setArrayVal(e.target.value);
                handleReset();
              }}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 transition duration-300"
              placeholder="e.g. 10, 20, 30, 40, 50, 60, 70"
              disabled={isVisualizing}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="targetInput">
              Target
            </label>
            <input
              type="number"
              id="targetInput"
              value={targetVal}
              onChange={(e) => {
                setTargetVal(e.target.value);
                handleReset();
              }}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 transition duration-300"
              placeholder="e.g. 60"
              disabled={isVisualizing}
            />
          </div>

          <div className="sm:col-span-3 flex gap-2 justify-end">
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

      {/* Array Display Workspace */}
      {isVisualizing && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow mb-8 flex flex-col items-center">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">
            Array Search Space
          </h3>
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {parsedArray.map((val, idx) => {
              const isInRange = activeLow !== null && activeHigh !== null && idx >= activeLow && idx <= activeHigh;
              const isMid = idx === activeMid;
              
              let styleClass = "bg-gray-100 dark:bg-zinc-800 text-gray-400 border-gray-200 dark:border-zinc-700 opacity-40";
              if (isInRange) {
                styleClass = "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-800 text-sky-950 dark:text-sky-100";
              }
              if (isMid) {
                styleClass = "bg-[#a435f0] text-white border-[#a435f0] scale-105 font-bold shadow-lg shadow-[#a435f0]/30 animate-pulse";
              }

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center text-sm font-semibold transition-all duration-300 ${styleClass}`}>
                    {val}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                    {idx === activeLow && "L"}
                    {isMid && "M"}
                    {idx === activeHigh && "H"}
                    {(!isMid && idx !== activeLow && idx !== activeHigh) && `[${idx}]`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Workspace Grid */}
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-12 mb-8">
        {/* Left Side: Call Stack */}
        <div className="md:col-span-6 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Active Call Stack
          </h3>
          {activeStack.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
              <p className="text-gray-400 dark:text-zinc-500 text-sm">Call Stack is Empty</p>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-2 items-center justify-end h-72 overflow-y-auto p-4 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/20">
              {activeStack.map((frame, index) => {
                const isTop = index === activeStack.length - 1;
                const statusClass = stackColors[frame.status] || stackColors.returning;

                return (
                  <div
                    key={frame.id}
                    className={`w-full max-w-[340px] p-3 rounded-lg border flex flex-col transition-all duration-300 ${statusClass} ${
                      isTop ? "ring-2 ring-[#a435f0] ring-offset-2 dark:ring-offset-zinc-950 font-semibold" : ""
                    }`}
                  >
                    <div className="flex justify-between w-full font-mono text-xs">
                      <span>binarySearch(low={frame.low}, high={frame.high})</span>
                      <span className="capitalize text-[10px] tracking-wide font-bold">{frame.status.replace("_", " ")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Code Block Trace */}
        <div className="md:col-span-6 flex flex-col">
          <div className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 font-mono text-xs shadow-inner h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <span className="text-zinc-400 font-semibold">Active Code Trace</span>
            </div>
            <div className="p-4 text-zinc-300 leading-relaxed flex-1">
              {codeLines.map((ln) => {
                const isActive = ln.line === activeLine;
                return (
                  <div
                    key={ln.line}
                    className={`flex gap-4 px-2 py-0.5 rounded transition-colors duration-200 ${
                      isActive ? "bg-[#a435f0]/20 border-l-4 border-[#a435f0] text-white font-bold" : "border-l-4 border-transparent"
                    }`}
                  >
                    <span className="text-zinc-600 select-none w-4 text-right">{ln.line}</span>
                    <span className="whitespace-pre">{ln.code}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
