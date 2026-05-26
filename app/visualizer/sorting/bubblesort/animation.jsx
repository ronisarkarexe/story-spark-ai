"use client";
import React, { useState, useRef, useEffect, useCallback } from "react"; // ← added useCallback
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import { saveToStorage, loadFromStorage, removeFromStorage } from "@/utils/storage";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ChallengeModePanel, {
  createOptions,
  useSortingChallenge,
} from "@/app/visualizer/sorting/components/ChallengeMode";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const createBubbleSwapQuestion = (arr, j) => {
  const correctLabel = `${arr[j]} and ${arr[j + 1]} (indices ${j} and ${j + 1})`;
  const options = createOptions(correctLabel, [
    j > 0 ? `${arr[j - 1]} and ${arr[j]} (indices ${j - 1} and ${j})` : null,
    j + 2 < arr.length ? `${arr[j + 1]} and ${arr[j + 2]} (indices ${j + 1} and ${j + 2})` : null,
    "No swap will happen",
  ]);

  return {
    prompt: "Which two elements will swap next?",
    options,
    correctOptionId: "correct",
    explanation: `${arr[j]} is greater than ${arr[j + 1]}, so Bubble Sort swaps adjacent indices ${j} and ${j + 1}.`,
  };
};

const BubbleSortVisualizer = () => {
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [array, setArray] = useState(() => loadFromStorage("bubble-array", []));
  const [challengeEnabled, setChallengeEnabled] = useState(false);
  const {
    isPaused,
    speed,
    speedRef,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
    checkPause,
  } = usePlayback(loadFromStorage("bubble-speed", 1));
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => { saveToStorage("bubble-array", array); }, [array]);
  useEffect(() => { saveToStorage("bubble-speed", speed); }, [speed]);

  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentIndices, setCurrentIndices] = useState({ i: -1, j: -1 });
  const animationRef = useRef(null);
  const isSortingRef = useRef(false);
  const resolveRef = useRef(null);
  const {
    activeQuestion,
    askChallenge,
    resetChallengeStats,
    stats: challengeStats,
    submitAnswer,
  } = useSortingChallenge(challengeEnabled);

  const handleArrayGenerated = (newArray) => {
    setArray(newArray);
    setSorted(false);
    resetStats();
  };

  const resetStats = () => {
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentIndices({ i: -1, j: -1 });
    resetChallengeStats();
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const cancellableDelay = async () => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(resolve, 1000 / speedRef.current);
    });
    await checkPause();
  };

  const bubbleSort = async () => {
    if (sorted || sorting || array.length === 0) return;

    isSortingRef.current = true;
    setSorting(true);
    let arr = [...array];
    let n = arr.length;
    let tempSwaps = 0;
    let tempComparisons = 0;
    setTotalSteps(Math.floor((n * (n - 1)) / 2));
    setCurrentStep(0);

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        if (!isSortingRef.current) return;
        setCurrentIndices({ i: j, j: j + 1 });
        tempComparisons++;
        setComparisons(tempComparisons);
        setCurrentStep((prev) => prev + 1);

        await cancellableDelay();
        if (!isSortingRef.current) return;

        if (arr[j] > arr[j + 1]) {
          await askChallenge(createBubbleSwapQuestion(arr, j));
          if (!isSortingRef.current) return;

          const bars = document.querySelectorAll(".bar");
          const bar1 = bars[j];
          const bar2 = bars[j + 1];
          if (bar1 && bar2) {
            await gsap.to(bar1, { x: "+=40", duration: 0.3, yoyo: true });
            await gsap.to(bar2, { x: "-=40", duration: 0.3, yoyo: true });
            await gsap.to([bar1, bar2], { x: "0", duration: 0 });
          }

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          tempSwaps++;
          setSwaps(tempSwaps);
          setArray([...arr]);

          await cancellableDelay();
          if (!isSortingRef.current) return;
        }
      }

      if (!swapped) break;
    }

    isSortingRef.current = false;
    setSorting(false);
    setSorted(true);
  };

  const reset = () => {
    isSortingRef.current = false;
    if (resolveRef.current) { resolveRef.current(); resolveRef.current = null; }
    if (animationRef.current) clearTimeout(animationRef.current);
    setArray([]);
    setSorting(false);
    setSorted(false);
    resetStats();
  };

  useEffect(() => {
    return () => { if (animationRef.current) clearTimeout(animationRef.current); };
  }, []);

  // ── Stable callbacks for the keyboard hook ──────────────────────────────
  // useCallback keeps the function reference stable so the hook's useEffect
  // doesn't re-subscribe on every render.
  const handleStart = useCallback(() => {
    bubbleSort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, sorted, array, speed]);

  const handleReset = useCallback(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpeedChange = useCallback((nextSpeed) => {
    setSpeed(nextSpeed);
  }, [setSpeed]);

  // keyboard shortcuts
  useVisualizerKeyboard({
    onStart:       handleStart,
    onReset:       handleReset,
    onSpeedChange: handleSpeedChange,
    onTogglePlayPause: togglePlayPause,
    speed,
    sorting,
    sorted,
  });

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Watch Bubble Sort in action as it repeatedly swaps adjacent elements to
        sort the array step by step.
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <ArrayGenerator onGenerate={handleArrayGenerated} disabled={sorting} isPrimary={array.length === 0} />
              <CustomArrayInput
                onUseCustomArray={(arr) => {
                  setArray(arr);
                  setSorted(false);
                  resetStats();
                }}
                disabled={sorting}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <button
                onClick={bubbleSort}
                disabled={!array.length || sorting || sorted}
                className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white"
              >
                {sorting ? "Sorting..." : "Start Bubble Sort"}
              </button>
              <button
                onClick={reset}
                className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Playback & Speed controls */}
          {sorting && (
            <PlaybackControls
              isPaused={isPaused}
              onTogglePlayPause={togglePlayPause}
              speed={speed}
              onIncreaseSpeed={increaseSpeed}
              onDecreaseSpeed={decreaseSpeed}
              onSpeedChange={setSpeed}
            />
          )}

          {!sorting && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 sm:w-32"
                disabled={sorting}
              />
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{speed}x</span>
            </div>
          )}

          <ChallengeModePanel
            activeQuestion={activeQuestion}
            disabled={sorting}
            enabled={challengeEnabled}
            onEnabledChange={setChallengeEnabled}
            onResetStats={resetChallengeStats}
            onSubmitAnswer={submitAnswer}
            stats={challengeStats}
          />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Comparisons:</div>
              <div className="text-xl sm:text-2xl">{comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Swaps:</div>
              <div className="text-xl sm:text-2xl">{swaps}</div>
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">
              {totalSteps > 0 ? `${currentStep} / ${totalSteps}` : "—"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {currentStep > 0 && !sorted
                ? `Comparing index ${currentIndices.i} and ${currentIndices.j}`
                : sorted
                ? "Sorting complete!"
                : "Start sorting to see steps"}
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Array Visualization</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {array.map((value, index) => {
                const isComparing = index === currentIndices.i || index === currentIndices.j;
                const isSorted = sorted;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`bar w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 shadow-md dark:shadow-blue-900 transition-all duration-300 ${getFontSize(value)} font-bold
                        ${isComparing
                          ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 dark:text-gray-900"
                          : isSorted
                          ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 dark:text-gray-900"
                          : "bg-primary/80 dark:bg-primary/80 border-primary dark:border-primary dark:text-gray-900"
                        }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-700 dark:text-[#c27cf7] font-semibold">
                      {index === currentIndices.i && "i"}
                      {index === currentIndices.j && "j"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
              {sorting ? "Sorting..." : "Generate or enter an array to begin"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default BubbleSortVisualizer;
