"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

function generatePrintNTo1Frames(n) {
  const frames = [];
  const stack = [];
  const printed = [];
  let frameIdCounter = 0;

  function run(i, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "printNTo1",
      i,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 1,
      description: `Calling printNTo1(i = ${i}). Pushing new stack frame.`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 2,
      description: `Checking base case condition: is i (${i}) < 1?`,
      activeFrameId: myId,
    });

    if (i < 1) {
      stack[stack.length - 1].status = "base_case";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Base case met! i (${i}) < 1. Stopping recursion.`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Returning from printNTo1(i = ${i}). Stack frame is ready to pop.`,
        activeFrameId: myId,
      });

      stack.pop();
      return;
    }

    // Print i
    printed.push(i);
    stack[stack.length - 1].status = "printing";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 3,
      description: `Printing value: ${i}. Output array is updated.`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "waiting";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 4,
      description: `Making recursive call for next number: printNTo1(i = ${i - 1}).`,
      activeFrameId: myId,
    });

    run(i - 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "returning";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      printed: [...printed],
      activeLine: 4,
      description: `Returning back to caller printNTo1(i = ${i}). Stack frame is ready to pop.`,
      activeFrameId: myId,
    });

    stack.pop();
  }

  run(n);
  frames.push({
    stack: [],
    printed: [...printed],
    activeLine: 0,
    description: `Recursion finished. All numbers from ${n} down to 1 have been printed.`,
    activeFrameId: null,
  });

  return frames;
}

const codeLines = [
  { line: 1, code: "function printNTo1(i) {" },
  { line: 2, code: "  if (i < 1) return;" },
  { line: 3, code: "  console.log(i);" },
  { line: 4, code: "  printNTo1(i - 1);" },
  { line: 5, code: "}" },
];

const PrintNTo1Animation = () => {
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
    return generatePrintNTo1Frames(n);
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
    if (n > 5) {
      setErrorMsg("Please select N <= 5 to keep stack height and layouts clear.");
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
    printed: [],
    activeLine: 0,
    description: "Enter N (between 1 and 5) and click Visualize Go!",
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
  const printedList = activeFrameData.printed || [];

  const stackColors = {
    calling: "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-200",
    checking_base: "bg-[#fef3c7] dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200",
    base_case: "bg-[#dcfce7] dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200",
    printing: "bg-[#fae8ff] dark:bg-purple-950/30 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-300",
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
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="nVal">
              Input Value (N)
            </label>
            <input
              type="number"
              id="nVal"
              min="1"
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
                      <span>printNTo1(i = {frame.i})</span>
                      <span className="capitalize text-[10px]">{frame.status.replace("_", " ")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Middle: Printed output */}
        <div className="md:col-span-4 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Terminal Output
          </h3>
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-zinc-950 text-emerald-400 font-mono text-lg rounded-xl min-h-64 shadow-inner border border-zinc-800">
            {printedList.length === 0 ? (
              <span className="text-zinc-600 text-xs">No output printed yet</span>
            ) : (
              <div className="flex flex-col gap-1 items-center">
                {printedList.map((val, idx) => (
                  <span key={idx} className="animate-fade-in">
                    &gt; {val}
                  </span>
                ))}
              </div>
            )}
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

export default PrintNTo1Animation;
