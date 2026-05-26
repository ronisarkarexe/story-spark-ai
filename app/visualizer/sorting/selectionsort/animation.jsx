"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
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

const createSelectionMinimumQuestion = (arr, minIndex, passIndex) => {
  const correctLabel = `${arr[minIndex]} (index ${minIndex})`;
  const options = createOptions(correctLabel, [
    passIndex !== minIndex ? `${arr[passIndex]} (index ${passIndex})` : null,
    minIndex + 1 < arr.length ? `${arr[minIndex + 1]} (index ${minIndex + 1})` : null,
    passIndex + 1 < arr.length ? `${arr[passIndex + 1]} (index ${passIndex + 1})` : null,
  ]);

  return {
    prompt: "Which element is currently minimum for this pass?",
    options,
    correctOptionId: "correct",
    explanation: `${arr[minIndex]} is the minimum from index ${passIndex} to the end, so it will be placed at index ${passIndex}.`,
  };
};

const SelectionSortVisualizer = () => {
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
    const [swaps, setSwaps] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);
    const [currentIndices, setCurrentIndices] = useState({ 
      i: -1,    // Current outer loop index
      j: -1,    // Current inner loop index
      min: -1   // Current minimum element index
    });
    const animationRef = useRef(null);
    const resolveRef = useRef(null);
    const isSortingRef = useRef(false);
    const {
      activeQuestion,
      askChallenge,
      resetChallengeStats,
      stats: challengeStats,
      submitAnswer,
    } = useSortingChallenge(challengeEnabled);

    const cancellableDelay = async () => {
      await new Promise((resolve) => {
        resolveRef.current = resolve;
        animationRef.current = setTimeout(resolve, 1000 / speedRef.current);
      });
      await checkPause();
    };
  
    // Generate random array
    const handleGenerateRandomArray = (newArray) => {
      setArray(newArray);
      setSorted(false);
      resetStats();
    };
  
    // Use custom array input
    const handleCustomArray = (newArray) => {
      setArray(newArray);
      setSorted(false);
      resetStats();
    };
  
    // Reset all stats and state
    const resetStats = () => {
      setComparisons(0);
      setSwaps(0);
      setCurrentStep(0);
      setTotalSteps(0);
      setCurrentIndices({ i: -1, j: -1, min: -1 });
      resetChallengeStats();
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      if (resolveRef.current) {
        resolveRef.current();
        resolveRef.current = null;
      }
      isSortingRef.current = false;
    };
  
    // Selection sort algorithm
    const selectionSort = async () => {
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
        let minIndex = i;
        setCurrentIndices({ i, j: i + 1, min: minIndex });
        
        for (let j = i + 1; j < n; j++) {
          setCurrentIndices(prev => ({ ...prev, j, min: minIndex }));
          tempComparisons++;
          setComparisons(tempComparisons);
          setCurrentStep((prev) => prev + 1);
  
          await cancellableDelay();
          if (!isSortingRef.current) return;
  
          if (arr[j] < arr[minIndex]) {
            minIndex = j;
            setCurrentIndices(prev => ({ ...prev, min: minIndex }));
            
            setCurrentIndices(prev => ({ ...prev, min: minIndex }));
            
            await cancellableDelay();
            if (!isSortingRef.current) return;
          }
        }

        await askChallenge(createSelectionMinimumQuestion(arr, minIndex, i));
        if (!isSortingRef.current) return;
        
        if (minIndex !== i) {
          [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
          tempSwaps++;
          setSwaps(tempSwaps);
          setArray([...arr]);
          
          const barI = document.querySelectorAll(".array-bar")[i];
          const barMin = document.querySelectorAll(".array-bar")[minIndex];
          if (barI && barMin) {
            gsap.to([barI, barMin], {
              opacity: 0,
              scale: 0.5,
              duration: 0.2,
              onComplete: () => {
                gsap.to([barI, barMin], {
                  opacity: 1,
                  scale: 1,
                  duration: 0.2
                });
              }
            });
          }
          
          await cancellableDelay();
          if (!isSortingRef.current) return;
        }
      }
      
      setArray([...arr]);
      
      const barI = document.querySelectorAll(".array-bar")[currentIndices.i];
      const barMin = document.querySelectorAll(".array-bar")[currentIndices.min];
      if (barI && barMin) {
        gsap.to([barI, barMin], {
          opacity: 0,
          scale: 0.5,
          duration: 0.2,
          onComplete: () => {
            gsap.to([barI, barMin], {
              opacity: 1,
              scale: 1,
              duration: 0.2
            });
          }
        });
      }
      
      isSortingRef.current = false;
      setSorting(false);
      setSorted(true);
      setCurrentIndices({ i: -1, j: -1, min: -1 });
    };
  
    // Reset everything
    const reset = () => {
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

    // keyboard shortcuts
    useVisualizerKeyboard({
      onStart:       selectionSort,
      onReset:       reset,
      onSpeedChange: setSpeed,
      onTogglePlayPause: togglePlayPause,
      speed,
      sorting,
      sorted,
    });
  
    return (
      <main className="container mx-auto px-6 py-6">
        <p className="text-lg max-w-4xl mx-auto text-center text-gray-600 dark:text-gray-400 mb-8">
            Visualize Selection Sort as it repeatedly selects the smallest
            element and swaps it to its correct position in the array.
          </p>

          <div className="max-w-4xl mx-auto">
            {/* Controls */}
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <ArrayGenerator
                    onGenerate={handleGenerateRandomArray}
                    disabled={sorting}
                    isPrimary={array.length === 0}
                    defaultSize={10}
                    minValue={5}
                    maxValue={100}
                  />
                  <CustomArrayInput
                    onUseCustomArray={handleCustomArray}
                    disabled={sorting}
                    placeholder="e.g. 5, 3, 8, 1, 2"
                  />
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={selectionSort}
                    disabled={!array.length || sorting || sorted}
                    className="w-full bg-[#a435f0] hover:bg-[#8f2cd6] text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
                  >
                    {sorting ? "Sorting..." : "Start Selection Sort"}
                  </button>
                  <button
                    onClick={reset}
                    className="w-full bg-transparent border border-[#a435f0] text-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 mt-4 px-4 py-2 rounded transition-colors"
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
              <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
                <div className="font-medium">Step:</div>
                <div className="text-xl font-bold">{totalSteps > 0 ? `${currentStep} / ${totalSteps}` : '—'}</div>
                <div className="text-xs text-gray-500 mt-1">{currentStep > 0 && !sorted ? `Finding minimum from index ${currentIndices.i}` : sorted ? 'Sorting complete!' : 'Start sorting to see steps'}</div>
              </div>
            </div>

            {/* Visualization */}
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">
                Array Visualization
              </h2>
              {array.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center">
                  {array.map((value, index) => {
                    const isCurrent = index === currentIndices.j;
                    const isMin = index === currentIndices.min;
                    const isSorted = sorted || index < currentIndices.i;

                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`array-bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isCurrent
                                ? "bg-yellow-400 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-400"
                                : isMin
                                ? "bg-pink-400 dark:bg-pink-600 border-pink-600 dark:border-pink-400"
                                : isSorted
                                ? "bg-green-400 dark:bg-green-600 border-green-600 dark:border-green-400"
                                : "bg-primary/80 dark:bg-primary border-primary dark:border-primary/80"
                            }`}
                        >
                          {value}
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {index === currentIndices.i && "i"}
                          {index === currentIndices.j && "j"}
                          {index === currentIndices.min && "min"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {sorting
                    ? "Sorting..."
                    : "Generate or enter an array to begin"}
                </div>
              )}
            </div>
          </div>
        </main>
    );
  };
  
  export default SelectionSortVisualizer;
