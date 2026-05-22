"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const QuickSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentIndices, setCurrentIndices] = useState({
    pivot: -1,
    left: -1,
    right: -1,
    partitionIndex: -1,
    stack: [],
    partitions: [],
  });
  const animationRef = useRef(null);
  const isSortingRef = useRef(false);
  const resolveRef = useRef(null);

  // Reset all stats and state
  const resetStats = () => {
    setComparisons(0);
    setSwaps(0);
    setCurrentIndices({
      pivot: -1,
      left: -1,
      right: -1,
      partitionIndex: -1,
      stack: [],
      partitions: [],
    });
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  // Helper: cancellable delay
  const cancellableDelay = (ms) =>
    new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(resolve, ms);
    });

  // Partition function for Quick Sort
  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;

    setCurrentIndices((prev) => ({
      ...prev,
      pivot: high,
      left: low,
      right: high - 1,
    }));

    for (let j = low; j < high; j++) {
      setCurrentIndices((prev) => ({
        ...prev,
        left: j,
        right: i,
      }));

      setComparisons((prev) => prev + 1);
      await cancellableDelay(1000 / speed);
      if (!isSortingRef.current) return -1;

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setSwaps((prev) => prev + 1);
        setArray([...arr]);
        // GSAP animation after swap/visual update
        const bars = document.querySelectorAll(".array-bar");
        if (bars.length > 0) {
          gsap.fromTo(
            bars,
            { scale: 1, opacity: 0.5 },
            { scale: 1.1, opacity: 1, duration: 0.3, stagger: 0.05 }
          );
        }
        await cancellableDelay(1000 / speed);
        if (!isSortingRef.current) return -1;
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setSwaps((prev) => prev + 1);
    setArray([...arr]);
    // GSAP animation after swap/visual update
    const bars2 = document.querySelectorAll(".array-bar");
    if (bars2.length > 0) {
      gsap.fromTo(
        bars2,
        { scale: 1, opacity: 0.5 },
        { scale: 1.1, opacity: 1, duration: 0.3, stagger: 0.05 }
      );
    }
    await cancellableDelay(1000 / speed);
    if (!isSortingRef.current) return -1;

    return i + 1;
  };

  // Quick Sort algorithm
  const quickSort = async () => {
    if (sorted || sorting || array.length === 0) return;

    isSortingRef.current = true;
    setSorting(true);
    let arr = [...array];
    let stack = [];
    let low = 0;
    let high = arr.length - 1;

    stack.push({ low, high });

    while (stack.length > 0) {
      const { low, high } = stack.pop();

      if (low < high) {
        // Show current partition being processed
        setCurrentIndices((prev) => ({
          ...prev,
          partitions: [...prev.partitions, { low, high }],
        }));

        const pi = await partition(arr, low, high);
        if (!isSortingRef.current) return;

        setCurrentIndices((prev) => ({
          ...prev,
          partitionIndex: pi,
          stack: [...stack],
          pivot: -1,
          left: -1,
          right: -1,
        }));

        // Push right subarray first so left is processed first
        stack.push({ low: pi + 1, high });
        stack.push({ low, high: pi - 1 });

        await cancellableDelay(1000 / speed);
        if (!isSortingRef.current) return;

        // Remove completed partition
        setCurrentIndices((prev) => ({
          ...prev,
          partitions: prev.partitions.filter(
            (p) => !(p.low === low && p.high === high)
          ),
        }));
      }
    }

    setArray([...arr]);
    isSortingRef.current = false;
    setSorting(false);
    setSorted(true);
    setCurrentIndices({
      pivot: -1,
      left: -1,
      right: -1,
      partitionIndex: -1,
      stack: [],
      partitions: [],
    });
  };

  // Reset everything
  const reset = () => {
    // Unblock any suspended async loop immediately
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  // Function to render partition visualization
  const renderPartitions = () => {
    if (currentIndices.partitions.length === 0) return null;

    return (
      <div className="mt-8">
        <div className="space-y-6">
          {currentIndices.partitions.map((partition, idx) => {
            const subArray = array.slice(partition.low, partition.high + 1);
            return (
              <div
                key={idx}
                className="bg-gray-100 dark:bg-neutral-900 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Partition {idx + 1}: Indexes {partition.low} to{" "}
                    {partition.high}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {subArray.length} elements
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {subArray.map((value, subIdx) => {
                    const originalIndex = partition.low + subIdx;
                    const isPivot = originalIndex === currentIndices.pivot;
                    const isLeft = originalIndex === currentIndices.left;
                    const isRight = originalIndex === currentIndices.right;

                    return (
                      <div
                        key={originalIndex}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-all duration-300 text-sm font-medium
                              ${
                                isPivot
                                  ? "bg-red-400 dark:bg-red-600 border-red-600 dark:border-red-400"
                                  : isLeft
                                  ? "bg-yellow-400 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-400"
                                  : isRight
                                  ? "bg-blue-400 dark:bg-blue-600 border-blue-600 dark:border-blue-400"
                                  : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                              }`}
                        >
                          {value}
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          [{originalIndex}]
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-6 pt-4 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Quick Sort's divide-and-conquer approach with interactive
        partitions
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
              />
              <CustomArrayInput
                onUseCustomArray={(newArray) => {
                  setArray(newArray);
                  setSorted(false);
                  resetStats();
                }}
                disabled={sorting}
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={quickSort}
                disabled={!array.length || sorting || sorted}
                className="w-full disabled:opacity-75 bg-none bg-green-500 px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-black"
              >
                {sorting ? "Sorting..." : "Start Quick Sort"}
              </button>
              <button
                onClick={reset}
                className="w-full bg-none text-white bg-red-500 px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Speed controls */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-700 dark:text-gray-300">Speed:</span>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-32"
              disabled={sorting}
            />
            <span className="text-gray-700 dark:text-gray-300">{speed}x</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Comparisons:</div>
              <div className="text-2xl">{comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Swaps:</div>
              <div className="text-2xl">{swaps}</div>
            </div>
          </div>
        </div>

        {/* Main Array Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Array Visualization</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {array.map((value, index) => {
                const isPivot = index === currentIndices.pivot;
                const isLeft = index === currentIndices.left;
                const isRight = index === currentIndices.right;
                const isPartition = index === currentIndices.partitionIndex;
                const isInPartition = currentIndices.partitions.some(
                  (p) => index >= p.low && index <= p.high
                );

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`array-bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isPivot
                                ? "bg-red-400 dark:bg-red-600 border-red-600 dark:border-red-400"
                                : isLeft
                                ? "bg-yellow-400 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-400"
                                : isRight
                                ? "bg-blue-400 dark:bg-blue-600 border-blue-600 dark:border-blue-400"
                                : isPartition
                                ? "bg-green-400 dark:bg-green-600 border-green-600 dark:border-green-400"
                                : isInPartition
                                ? "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700"
                                : sorted
                                ? "bg-green-400 dark:bg-green-600 border-green-600 dark:border-green-400"
                                : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {index}
                      {isPivot && " (pivot)"}
                      {isLeft && " (left)"}
                      {isRight && " (right)"}
                      {isPartition && " (partition)"}
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

        {/* Partition Visualization */}
        <div className="bg-white mt-8 dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Partion Array</h2>
          {renderPartitions()}
        </div>
      </div>
    </main>
  );
};

export default QuickSortVisualizer;