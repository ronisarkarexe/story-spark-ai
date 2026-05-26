"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Play, Pause } from "lucide-react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import { saveToStorage, loadFromStorage, removeFromStorage } from "@/utils/storage";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const BinarySearch = () => {
  const [arrayElements, setArrayElements] = useState(() =>
    loadFromStorage("binary-array-elements", "")
  );

  const [target, setTarget] = useState(() =>
    loadFromStorage("binary-target", "")
  );

  const [array, setArray] = useState([]);
  const [i, setI] = useState(-1);
  const [j, setJ] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const {
    isPaused,
    speed,
    speedRef,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
    checkPause,
  } = usePlayback(() => loadFromStorage("binary-speed", 1));

  const animationRef = useRef(null);
  const resolveRef = useRef(null);
  const isSearchingRef = useRef(false);

  const formRef = useRef(null);
  const elementRefs = useRef([]);

  // Persist state
  useEffect(() => {
    saveToStorage("binary-array-elements", arrayElements);
  }, [arrayElements]);

  useEffect(() => {
    saveToStorage("binary-target", target);
  }, [target]);

  useEffect(() => {
    saveToStorage("binary-speed", speed);
    speedRef.current = speed;
  }, [speed, speedRef]);

  const handleReset = () => {
    clearTimeout(animationRef.current);

    removeFromStorage("binary-array-elements");
    removeFromStorage("binary-target");
    removeFromStorage("binary-speed");

    setArray([]);
    setI(-1);
    setJ(-1);
    setMid(-1);
    setFoundIndex(-1);
    setMessage("");
    setMessageType("");
    setIsAnimating(false);
    isSearchingRef.current = false;
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }

    setArrayElements("");
    setTarget("");
    setSpeed(1);

    if (formRef.current) {
      formRef.current.reset();
    }

    elementRefs.current.forEach((ref) => {
      gsap.to(ref, {
        backgroundColor: "#E5E7EB",
        borderColor: "#D1D5DB",
        duration: 0,
      });
    });
  };

  const generateRandomArray = () => {
    if (isAnimating) return;

    const size = Math.floor(Math.random() * 4) + 2;

    const elements = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);

    setArrayElements(elements.join(", "));
  };

  const handleGo = (e) => {
    e.preventDefault();

    clearTimeout(animationRef.current);

    setArray([]);
    setI(-1);
    setJ(-1);
    setMid(-1);
    setFoundIndex(-1);
    setMessage("");
    setMessageType("");
    setIsAnimating(false);

    if (!arrayElements || !target) {
      setMessage("Please fill in all fields.");
      setMessageType("warning");
      return;
    }

    const rawElements = arrayElements
      .split(",")
      .map((el) => el.trim());

    const hasDecimals = rawElements.some((el) =>
      el.includes(".")
    );

    if (hasDecimals) {
      setMessage(
        "Only integers are supported. Please remove decimal values."
      );
      setMessageType("warning");
      return;
    }

    const elements = rawElements.map((el) =>
      parseInt(el)
    );

    const targetValue = parseInt(target);

    if (elements.some(isNaN) || isNaN(targetValue)) {
      setMessage("Invalid array elements or target.");
      setMessageType("warning");
      return;
    }

    const isSorted = elements.every(
      (el, idx) => idx === 0 || el >= elements[idx - 1]
    );

    if (!isSorted) {
      setMessage("Array must be sorted in ascending order.");
      setMessageType("warning");
      return;
    }

    setArray(elements);
    setI(0);
    setJ(elements.length - 1);
    setMid(-1);
    setFoundIndex(-1);
    setMessage("");
    setMessageType("");
    setIsAnimating(true);
    isSearchingRef.current = true;

    animateBinarySearch(elements, targetValue);
  };

  const cancellableDelay = async () => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(resolve, 1500 / speedRef.current);
    });
    await checkPause();
  };

  const animateBinarySearch = async (elements, targetValue) => {
    let l = 0;
    let h = elements.length - 1;

    while (l <= h) {
      if (!isSearchingRef.current) return;

      const m = Math.floor((l + h) / 2);
      setI(l);
      setJ(h);
      setMid(m);

      elementRefs.current.forEach((ref, index) => {
        if (!ref) return;
        if (index === m) {
          gsap.to(ref, { backgroundColor: "#EAB308", borderColor: "#A16207", duration: 0.3 });
        } else if (index >= l && index <= h) {
          gsap.to(ref, { backgroundColor: "#93C5FD", borderColor: "#3B82F6", duration: 0.3 });
        } else {
          gsap.to(ref, { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", duration: 0.3 });
        }
      });

      await cancellableDelay();
      if (!isSearchingRef.current) return;

      if (elements[m] === targetValue) {
        setFoundIndex(m);
        setMessage(`Element ${targetValue} found at index ${m}!`);
        setMessageType("success");
        setIsAnimating(false);
        isSearchingRef.current = false;
        gsap.to(elementRefs.current[m], { backgroundColor: "#22C55E", borderColor: "#15803D", duration: 0.3 });
        return;
      } else if (elements[m] < targetValue) {
        l = m + 1;
      } else {
        h = m - 1;
      }
    }

    if (!isSearchingRef.current) return;
    setMessage(`Element ${targetValue} not found in the array.`);
    setMessageType("error");
    setIsAnimating(false);
    isSearchingRef.current = false;
  };

  useVisualizerKeyboard({
    onStart: () => {}, // Handled by Go button
    onReset: handleReset,
    onSpeedChange: setSpeed,
    onTogglePlayPause: togglePlayPause,
    speed,
    sorting: isAnimating,
    sorted: foundIndex !== -1 || messageType === "error",
  });

  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how Binary Search efficiently finds an element in a sorted
        array.
      </p>

      <form
        ref={formRef}
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="arrayElements"
          >
            Sorted Array Elements (comma-separated)
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              id="arrayElements"
              value={arrayElements}
              onChange={(e) =>
                setArrayElements(e.target.value)
              }
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
              placeholder="e.g., 1, 3, 4, 6, 8"
              disabled={isAnimating}
            />

            <button
              type="button"
              onClick={generateRandomArray}
              className="px-4 py-2 font-bold bg-[#a435f0] text-white rounded-lg hover:bg-[#8f2cd6] transition-all duration-200"
              disabled={isAnimating}
            >
              Random
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="target"
          >
            Target Element
          </label>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input
              type="number"
              id="target"
              value={target}
              onChange={(e) =>
                setTarget(e.target.value)
              }
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
              placeholder="eg. 4"
              disabled={isAnimating}
            />

            <div className="flex gap-2 w-full">
              <GoButton
                onClick={handleGo}
                isAnimating={isAnimating}
                disabled={isAnimating}
              />

              <ResetButton
                onReset={handleReset}
                isAnimating={isAnimating}
              />
            </div>
          </div>
        </div>

        {isAnimating && (
          <PlaybackControls
            isPaused={isPaused}
            onTogglePlayPause={togglePlayPause}
            speed={speed}
            onIncreaseSpeed={increaseSpeed}
            onDecreaseSpeed={decreaseSpeed}
            onSpeedChange={setSpeed}
          />
        )}
      </form>

      {message && (
        <div
          className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${messageClass}`}
        >
          <p className="text-center font-medium">
            {message}
          </p>
        </div>
      )}

      {array.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Array Visualization
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {array.map((element, index) => {
              const labels = [];

              if (index === i) labels.push("i");
              if (index === mid) labels.push("Mid");
              if (index === j) labels.push("j");

              return (
                <div
                  key={index}
                  className="flex flex-col items-center"
                >
                  <div
                    ref={(el) => (elementRefs.current[index] = el)}
                    className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(element)} font-medium ${
                      index === foundIndex
                        ? "bg-green-500 dark:bg-green-600 border-green-700 dark:border-green-400 text-gray-800 dark:text-white"
                        : index === mid
                        ? "bg-yellow-500 dark:bg-yellow-600 border-yellow-700 dark:border-yellow-400 text-gray-800 dark:text-white"
                        : index >= i && index <= j
                        ? "bg-blue-300 dark:bg-blue-700 border-blue-500 dark:border-blue-400 text-gray-800 dark:text-white"
                        : "bg-gray-200 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                    }`}
                  >
                    {element}
                  </div>

                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">
                    {labels.map((label, idx) => (
                      <div key={idx}>{label}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
};

export default BinarySearch;
