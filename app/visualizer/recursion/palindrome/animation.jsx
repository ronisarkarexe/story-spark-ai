"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

function generatePalindromeFrames(str) {
  const frames = [];
  const stack = [];
  const len = str.length;
  let frameIdCounter = 0;

  function run(i, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "isPalindrome",
      i,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 1,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: "normal",
      description: `Calling isPalindrome(i = ${i}). Compares characters from outer bounds inwards.`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 2,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: "normal",
      description: `Checking base case: is pointer i (${i}) >= middle (${Math.floor(len / 2)})?`,
      activeFrameId: myId,
    });

    if (i >= Math.floor(len / 2)) {
      stack[stack.length - 1].status = "base_case";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 2,
        iIndex: i,
        oppIndex: len - 1 - i,
        statusType: "success",
        description: `Base case met! i (${i}) >= middle. Pointers crossed; all checked indices match. Returning true.`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = "true";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 2,
        iIndex: i,
        oppIndex: len - 1 - i,
        statusType: "success",
        description: `Returning true from isPalindrome(i = ${i}).`,
        activeFrameId: myId,
      });

      stack.pop();
      return true;
    }

    // Compare characters
    const charL = str[i].toLowerCase();
    const charR = str[len - 1 - i].toLowerCase();

    stack[stack.length - 1].status = "comparing";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 3,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: charL === charR ? "success" : "error",
      description: `Comparing str[${i}] ('${str[i]}') and str[${len - 1 - i}] ('${str[len - 1 - i]}').`,
      activeFrameId: myId,
    });

    if (charL !== charR) {
      stack[stack.length - 1].status = "mismatch";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        iIndex: i,
        oppIndex: len - 1 - i,
        statusType: "error",
        description: `Mismatch! '${str[i]}' !== '${str[len - 1 - i]}'. Returning false immediately.`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = "false";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        iIndex: i,
        oppIndex: len - 1 - i,
        statusType: "error",
        description: `Returning false from isPalindrome(i = ${i}).`,
        activeFrameId: myId,
      });

      stack.pop();
      return false;
    }

    stack[stack.length - 1].status = "waiting";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 4,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: "success",
      description: `Characters match. Making recursive call: isPalindrome(i = ${i + 1}).`,
      activeFrameId: myId,
    });

    const subResult = run(i + 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "returning";
    stack[myFrameIndex].retVal = String(subResult);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      activeLine: 4,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: subResult ? "success" : "error",
      description: `Inner call returned ${subResult}. Returning ${subResult} from isPalindrome(i = ${i}).`,
      activeFrameId: myId,
    });

    stack.pop();
    return subResult;
  }

  const finalResult = run(0);
  frames.push({
    stack: [],
    activeLine: 0,
    iIndex: -1,
    oppIndex: -1,
    statusType: finalResult ? "success" : "error",
    description: `Recursion finished. String is${finalResult ? "" : " NOT"} a palindrome. Returns ${finalResult}.`,
    activeFrameId: null,
  });

  return frames;
}

const codeLines = [
  { line: 1, code: "function isPalindrome(i, str) {" },
  { line: 2, code: "  if (i >= str.length / 2) return true;" },
  { line: 3, code: "  if (str[i] !== str[str.length - 1 - i]) return false;" },
  { line: 4, code: "  return isPalindrome(i + 1, str);" },
  { line: 5, code: "}" },
];

const PalindromeAnimation = () => {
  const [stringInput, setStringInput] = useState("radar");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(-1);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const frames = useMemo(() => {
    if (!isVisualizing || !stringInput.trim()) return [];
    return generatePalindromeFrames(stringInput.trim());
  }, [stringInput, isVisualizing]);

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
    const str = stringInput.trim();
    if (!str) {
      setErrorMsg("Please enter a valid string.");
      return;
    }
    if (str.length > 8) {
      setErrorMsg("Please keep string length <= 8 for layout readability.");
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

  const generateRandomString = () => {
    const list = ["radar", "racecar", "hello", "level", "madam", "kayak", "coding"];
    const str = list[Math.floor(Math.random() * list.length)];
    setStringInput(str);
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
    activeLine: 0,
    iIndex: -1,
    oppIndex: -1,
    statusType: "normal",
    description: "Enter a word and click Visualize Go!",
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
  const iPtr = activeFrameData.iIndex;
  const oppPtr = activeFrameData.oppIndex;
  const statusType = activeFrameData.statusType;

  const stackColors = {
    calling: "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-200",
    checking_base: "bg-[#fef3c7] dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200",
    base_case: "bg-[#dcfce7] dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200",
    comparing: "bg-[#fae8ff] dark:bg-purple-950/30 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    mismatch: "bg-red-100 dark:bg-red-950/20 border-red-400 dark:border-red-800 text-red-800 dark:text-red-200",
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
          <div className="flex-1 w-full">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="stringInput">
              Input String
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="stringInput"
                value={stringInput}
                onChange={(e) => {
                  setStringInput(e.target.value.replace(/[^a-zA-Z]/g, ""));
                  handleReset();
                }}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 transition duration-300"
                placeholder="e.g. radar"
                disabled={isVisualizing}
              />
              <button
                type="button"
                onClick={generateRandomString}
                className="px-4 py-2 font-bold bg-[#0d9488] text-white rounded-lg hover:bg-[#0b766e] transition-all duration-200"
                disabled={isVisualizing}
              >
                Random
              </button>
            </div>
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
                      <span>isPalindrome(i = {frame.i})</span>
                    </div>
                    {frame.retVal !== undefined && (
                      <span className="font-bold text-[11px] text-zinc-600 dark:text-zinc-300 mt-1 block">
                        returns {frame.retVal}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Middle: String Blocks representation */}
        <div className="md:col-span-4 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            String Visualization
          </h3>
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 min-h-64">
            <div className="flex gap-2 justify-center items-end">
              {stringInput.split("").map((char, idx) => {
                const isLeft = idx === iPtr;
                const isRight = idx === oppPtr;
                const active = isLeft || isRight;

                let borderStyle = "border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800";
                if (active) {
                  if (statusType === "success") {
                    borderStyle = "border-emerald-500 dark:border-emerald-400 bg-emerald-150 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 font-bold stroke-2";
                  } else if (statusType === "error") {
                    borderStyle = "border-red-500 dark:border-red-400 bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100 font-bold stroke-2 animate-bounce";
                  } else {
                    borderStyle = "border-purple-500 dark:border-purple-400 bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-100 font-bold stroke-2";
                  }
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 text-sm font-semibold uppercase transition-all duration-300 ${borderStyle}`}
                    >
                      {char}
                    </div>
                    <span className="text-[10px] text-gray-400 select-none">
                      {isLeft && "i"}
                      {isRight && "opp"}
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

export default PalindromeAnimation;
