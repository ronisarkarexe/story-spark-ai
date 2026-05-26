"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import RandomArray from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
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

const createInsertionKeyQuestion = (arr, index) => {
  const correctLabel = `${arr[index]} (index ${index})`;
  const options = createOptions(correctLabel, [
    index > 0 ? `${arr[index - 1]} (index ${index - 1})` : null,
    index + 1 < arr.length ? `${arr[index + 1]} (index ${index + 1})` : null,
    "The first element",
  ]);

  return {
    prompt: "Which element will be inserted next?",
    options,
    correctOptionId: "correct",
    explanation: `Insertion Sort takes the element at index ${index}, ${arr[index]}, and inserts it into the sorted left side.`,
  };
};

const InsertionSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
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
  } = usePlayback(1);
  const [comparisons, setComparisons] = useState(0);
  const [shifts, setShifts] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentIndices, setCurrentIndices] = useState({ current: -1, comparing: -1, sortedUpTo: -1 });
  const animationRef = useRef(null);
  const barRefs = useRef([]);
  const isSortingRef = useRef(false);
  const resolveRef = useRef(null);
  const {
    activeQuestion,
    askChallenge,
    resetChallengeStats,
    stats: challengeStats,
    submitAnswer,
  } = useSortingChallenge(challengeEnabled);

  // Helper: cancellable delay
  const cancellableDelay = async () => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(resolve, 1000 / speedRef.current);
    });
    await checkPause();
  };

  const resetStats = () => {
    setComparisons(0);
    setShifts(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentIndices({ current: -1, comparing: -1, sortedUpTo: -1 });
    resetChallengeStats();
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const insertionSort = async () => {
    if (sorted || sorting || array.length === 0) return;
    isSortingRef.current = true;
    resolveRef.current = null;
    setSorting(true);
    let arr = [...array];
    const n = arr.length;
    setTotalSteps(Math.floor((n * (n - 1)) / 2));
    setCurrentStep(0);

    // reset bar positions
    barRefs.current.forEach((bar) => bar && gsap.set(bar, { x: 0, y: 0 }));

    setCurrentIndices({ current: 1, comparing: 0, sortedUpTo: 0 });
    await cancellableDelay();
    if (!isSortingRef.current) return;

    for (let i = 1; i < n; i++) {
      let current = arr[i];
      let j = i - 1;
      setCurrentIndices({ current: i, comparing: j, sortedUpTo: i - 1 });
      await askChallenge(createInsertionKeyQuestion(arr, i));
      if (!isSortingRef.current) return;
      await cancellableDelay();
      if (!isSortingRef.current) return;

      while (j >= 0 && arr[j] > current) {
        setComparisons((c) => c + 1);
        setCurrentStep((prev) => prev + 1);
        arr[j + 1] = arr[j];
        setShifts((s) => s + 1);
        setArray([...arr]);
        // animate shift
        const movingBar = barRefs.current[j + 1];
        if (movingBar) {
          await gsap.to(movingBar, { y: -20, duration: 0.2 });
          await gsap.to(movingBar, { x: "+=70", duration: 0.3, ease: "power2.inOut" });
          await gsap.to(movingBar, { y: 0, duration: 0.2 });
          gsap.set(movingBar, { clearProps: "transform" });
        }
        await cancellableDelay();
        if (!isSortingRef.current) return;
        j--;
        setCurrentIndices({ current: i, comparing: j, sortedUpTo: i - 1 });
      }

      // place the current element
      arr[j + 1] = current;
      setArray([...arr]);
      const insertBar = barRefs.current[i];
      if (insertBar) {
        const moveX = (j + 1 - i) * 70;
        await gsap.to(insertBar, { y: -20, duration: 0.2 });
        await gsap.to(insertBar, { x: moveX, duration: 0.3, ease: "power2.inOut" });
        await gsap.to(insertBar, { y: 0, duration: 0.2 });
        gsap.set(insertBar, { clearProps: "transform" });
      }
      await cancellableDelay();
      if (!isSortingRef.current) return;
    }

    setSorting(false);
    setSorted(true);
    isSortingRef.current = false;
    setCurrentIndices({ current: -1, comparing: -1, sortedUpTo: n - 1 });
  };

  const reset = () => {
    isSortingRef.current = false;
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
    if (animationRef.current) clearTimeout(animationRef.current);
    setArray([]);
    setSorting(false);
    setSorted(false);
    resetStats();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  // keyboard shortcuts
  useVisualizerKeyboard({
    onStart:       insertionSort,
    onReset:       reset,
    onSpeedChange: setSpeed,
    onTogglePlayPause: togglePlayPause,
    speed,
    sorting,
    sorted,
  });

  return (
    <main className="container mx-auto px-6 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how Insertion Sort builds the final sorted array.
      </p>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <RandomArray onGenerate={(newArray) => { setArray(newArray); setSorted(false); resetStats(); }} disabled={sorting} isPrimary={array.length === 0} />
              <CustomArrayInput onUseCustomArray={(newArray) => { setArray(newArray); setSorted(false); resetStats(); }} disabled={sorting} className="w-full" />
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <button onClick={insertionSort} disabled={!array.length || sorting || sorted} className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white">
                {sorting ? "Sorting..." : "Start Insertion Sort"}
              </button>
              <button onClick={reset} className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base">
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded"><div className="font-medium">Comparisons:</div><div className="text-2xl">{comparisons}</div></div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded"><div className="font-medium">Shifts:</div><div className="text-2xl">{shifts}</div></div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">{totalSteps > 0 ? `${currentStep} / ${totalSteps}` : '—'}</div>
            <div className="text-xs text-gray-500 mt-1">{currentStep > 0 && !sorted ? `Inserting element at index ${currentIndices.current}` : sorted ? 'Sorting complete!' : 'Start sorting to see steps'}</div>
          </div>
        </div>
        {/* Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Array Visualization</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {array.map((value, index) => {
                const isCurrent = index === currentIndices.current;
                const isComparing = index === currentIndices.comparing;
                const isSorted = sorted || index <= currentIndices.sortedUpTo;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      ref={(el) => (barRefs.current[index] = el)}
                      className={`bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isCurrent
                                ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 dark:text-gray-800"
                                : isComparing
                                ? "bg-red-400 dark:bg-red-400 border-red-600 dark:border-red-600 dark:text-gray-800"
                                : isSorted
                                ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 dark:text-gray-800"
                                : "bg-primary/80 dark:bg-primary/80 border-primary dark:border-primary dark:text-gray-800"
                            }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">{sorting ? "Sorting..." : "Generate or enter an array to begin"}</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default InsertionSortVisualizer;
