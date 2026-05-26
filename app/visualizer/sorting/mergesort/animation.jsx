"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const MergeSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
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
  const [swaps, setSwaps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentIndices, setCurrentIndices] = useState({
    left: -1,
    right: -1,
    mergeStart: -1,
    mergeEnd: -1,
    comparing: [],
    levels: [],
    currentLevel: -1,
  });

  const animationRef = useRef(null);
  const isSortingRef = useRef(false);
  const resolveRef = useRef(null);

  const cancellableDelay = async (ms) => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(() => {
        resolveRef.current = null;
        resolve();
      }, ms / speedRef.current);
    });
    await checkPause();
  };
  

  // Reset all stats and state
  const resetStats = () => {
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentIndices({
      left: -1,
      right: -1,
      mergeStart: -1,
      mergeEnd: -1,
      comparing: [],
      levels: [],
      currentLevel: -1,
    });
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  // Merge function for Merge Sort
  const merge = async (arr, l, m, r) => {
    let n1 = m - l + 1;
    let n2 = r - m;

    // Create temp arrays
    let L = new Array(n1);
    let R = new Array(n2);

    // Copy data to temp arrays
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    // Merge the temp arrays back into arr[l..r]
    let i = 0,
      j = 0,
      k = l;

    while (i < n1 && j < n2) {
      setCurrentIndices((prev) => ({
        ...prev,
        comparing: [l + i, m + 1 + j],
        mergeStart: l,
        mergeEnd: r,
      }));

      setComparisons((prev) => prev + 1);
      setCurrentStep((prev) => prev + 1);
      await cancellableDelay(1000);
      if (!isSortingRef.current) return;

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      setSwaps((prev) => prev + 1);

      setArray([...arr]);
      // GSAP pop animation for the merged bar
      {
        const bars = document.querySelectorAll(".bar");
        const bar = bars[k];
        if (bar) {
          await gsap.to(bar, { scale: 1.2, duration: 0.2 });
          await gsap.to(bar, { scale: 1.0, duration: 0.2 });
        }
      }

      k++;
      await cancellableDelay(1000);
      if (!isSortingRef.current) return;
    }

    // Copy remaining elements of L[]
    while (i < n1) {
      arr[k] = L[i];
      i++;
      setArray([...arr]);
      // GSAP pop animation for the merged bar
      {
        const bars = document.querySelectorAll(".bar");
        const bar = bars[k];
        if (bar) {
          await gsap.to(bar, { scale: 1.2, duration: 0.2 });
          await gsap.to(bar, { scale: 1.0, duration: 0.2 });
        }
      }
      k++;
      await cancellableDelay(1000);
      if (!isSortingRef.current) return;
    }

    // Copy remaining elements of R[]
    while (j < n2) {
      arr[k] = R[j];
      j++;
      setArray([...arr]);
      // GSAP pop animation for the merged bar
      {
        const bars = document.querySelectorAll(".bar");
        const bar = bars[k];
        if (bar) {
          await gsap.to(bar, { scale: 1.2, duration: 0.2 });
          await gsap.to(bar, { scale: 1.0, duration: 0.2 });
        }
      }
      k++;
      await cancellableDelay(1000);
      if (!isSortingRef.current) return;
    }
  };

  // Recursive helper with cancellation checks
  const mergeSortHelper = async (arr, l, r, level = 0, path = []) => {
    if (!isSortingRef.current) return;
    if (l >= r) return;
    const currentPath = [...path, { l, r }];
    const m = l + Math.floor((r - l) / 2);
    setCurrentIndices((prev) => ({
      ...prev,
      currentLevel: level,
      recursionPath: currentPath,
      left: l,
      right: r,
      mid: m,
    }));
    await cancellableDelay(1000);
    if (!isSortingRef.current) return;
    await mergeSortHelper(arr, l, m, level + 1, currentPath);
    if (!isSortingRef.current) return;
    await mergeSortHelper(arr, m + 1, r, level + 1, currentPath);
    if (!isSortingRef.current) return;
    await merge(arr, l, m, r);
  };

  // Main sort trigger
  const mergeSort = async () => {
    if (sorted || sorting || array.length === 0) return;
    isSortingRef.current = true;
    setSorting(true);
    let arr = [...array];
    const n = arr.length;
    setTotalSteps(Math.floor(n * Math.ceil(Math.log2(n || 1))));
    setCurrentStep(0);
    await mergeSortHelper(arr, 0, arr.length - 1);
    if (!isSortingRef.current) return;
    setArray([...arr]);
    setSorting(false);
    setSorted(true);
    isSortingRef.current = false;
    setCurrentIndices({
      left: -1,
      right: -1,
      mergeStart: -1,
      mergeEnd: -1,
      comparing: [],
      levels: [],
      currentLevel: -1,
      recursionPath: [],
    });
  };

  // Reset all state and cancel pending delays
  const reset = () => {
    isSortingRef.current = false;
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
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
    onStart:       mergeSort,
    onReset:       reset,
    onSpeedChange: setSpeed,
    onTogglePlayPause: togglePlayPause,
    speed,
    sorting,
    sorted,
  });

  const isInCurrentRange = (index) => index >= currentIndices.left && index <= currentIndices.right;
  const isBeingMerged = (index) => index >= currentIndices.mergeStart && index <= currentIndices.mergeEnd;

  return (
    <main className="container mx-auto px-6 pt-2 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize the divide-and-conquer approach of Merge Sort with recursive splitting and merging.
      </p>
      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <ArrayGenerator
                onGenerate={(newArray) => {
                  setArray(newArray);
                  setSorted(false);
                  resetStats();
                }}
                disabled={sorting}
                isPrimary={array.length === 0}
              />
              <CustomArrayInput
                onUseCustomArray={(newArray) => {
                  setArray(newArray);
                  setSorted(false);
                  resetStats();
                }}
                disabled={sorting}
                className="mb-4"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={mergeSort}
                disabled={!array.length || sorting || sorted}
                className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white"
              >
                {sorting ? "Sorting..." : "Start Merge Sort"}
              </button>
              <button
                onClick={reset}
                className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Main Array Visualization */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Main Array</h2>
            {array.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {array.map((value, index) => {
                  const isComparing = currentIndices.comparing.includes(index);
                  const isInRange = isInCurrentRange(index);
                  const isMerging = isBeingMerged(index);
                  const isSorted = sorted;

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isComparing
                                ? "bg-red-400 dark:bg-red-400 border-red-600 dark:border-red-600 text-gray-800"
                                : isMerging
                                ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                                : isInRange
                                ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 text-gray-800"
                                : isSorted
                                ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                                : "bg-primary/80 dark:bg-primary border-primary dark:border-primary text-gray-800"
                            }`}
                      >
                        {value}
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {index}
                        {isComparing && " (comparing)"}
                        {isMerging && !isComparing && " (merging)"}
                        {isInRange &&
                          !isMerging &&
                          !isComparing &&
                          " (current)"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {sorting ? "Sorting..." : "Generate or enter an array to begin"}
              </div>
            )}
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

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Comparisons:</div>
              <div className="text-2xl">{comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Merges:</div>
              <div className="text-2xl">{swaps}</div>
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">
              {totalSteps > 0 ? `${currentStep} / ${totalSteps}` : '—'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentStep > 0 && !sorted
                ? `Merging elements at index ${currentIndices.mergeStart} to ${currentIndices.mergeEnd}`
                : sorted
                ? 'Sorting complete!'
                : 'Start sorting to see steps'}
            </div>
          </div>
        </div>
        {/* Main Array Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Main Array</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {array.map((value, index) => {
                const isComparing = currentIndices.comparing.includes(index);
                const isInRange = isInCurrentRange(index);
                const isMerging = isBeingMerged(index);
                const isSorted = sorted;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 text-lg font-medium
                        ${
                          isComparing
                            ? "bg-red-400 dark:bg-red-400 border-red-600 dark:border-red-600 text-gray-800"
                            : isMerging
                            ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                            : isInRange
                            ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 text-gray-800"
                            : isSorted
                            ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                            : "bg-primary/80 dark:bg-primary border-primary dark:border-primary text-gray-800"
                        }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {index}
                      {isComparing && " (comparing)"}
                      {isMerging && !isComparing && " (merging)"}
                      {isInRange && !isMerging && !isComparing && " (current)"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {sorting ? "Sorting..." : "Generate or enter an array to begin"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MergeSortVisualizer;
