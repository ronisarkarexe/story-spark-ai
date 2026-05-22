"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const LinearSearch = () => {
  const [arrayElements, setArrayElements] = useState("");
  const [target, setTarget] = useState("");
  const [array, setArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // FIX: "success" | "error" | "warning"
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1);
  const animationRef = useRef(null);
  const formRef = useRef(null);
  const elementRefs = useRef([]);

  useEffect(() => {
    return () => {
      clearTimeout(animationRef.current);
    };
  }, []);

  const handleReset = () => {
    clearTimeout(animationRef.current);
    setArray([]);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setMessage("");
    setMessageType(""); // FIX: reset message type
    setIsAnimating(false);
    setArrayElements("");
    setTarget("");
    if (formRef.current) formRef.current.reset();

    // Reset GSAP animations
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
    );
    setArrayElements(elements.join(", "));
  };

  const handleGo = (e) => {
    e.preventDefault();
    handleReset();

    if (!arrayElements || !target) {
      setMessage("Please fill in all fields.");
      setMessageType("warning"); // FIX: validation error → warning
      return;
    }

    const rawElements = arrayElements.split(",").map((el) => el.trim());

    // FIX: detect decimal/float inputs before parsing and warn the user
    const hasDecimals = rawElements.some((el) => el.includes("."));
    if (hasDecimals) {
      setMessage("Only integers are supported. Please remove decimal values.");
      setMessageType("warning");
      return;
    }

    const elements = rawElements.map((el) => parseInt(el));

    // FIX: also check target for decimal input
    if (target.includes(".")) {
    setMessage("Only integers are supported. Please remove decimal values.");
    setMessageType("warning");
    return;
    }

const targetValue = parseInt(target);

    if (elements.some(isNaN) || isNaN(targetValue)) {
      setMessage("Invalid array elements or target.");
      setMessageType("warning"); // FIX: validation error → warning
      return;
    }

    setArray(elements);
    setIsAnimating(true);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setMessage("");
    setMessageType("");

    // start animation
    animateLinearSearch(elements, targetValue);
  };

  const animateLinearSearch = (arr, targetValue) => {
    let index = 0;

    const step = () => {
      if (index >= arr.length) {
        setMessage(`Element ${targetValue} not found in the array.`);
        setMessageType("error"); // FIX: search result "not found" → red
        setIsAnimating(false);
        return;
      }

      setCurrentIndex(index);

      // highlight current
      elementRefs.current.forEach((ref, idx) => {
        if (!ref) return;
        if (idx === index) {
          gsap.to(ref, { backgroundColor: "#EAB308", borderColor: "#A16207", duration: 0.3 });
        } else if (idx < index) {
          gsap.to(ref, { backgroundColor: "#93C5FD", borderColor: "#3B82F6", duration: 0.3 });
        } else {
          gsap.to(ref, { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", duration: 0.3 });
        }
      });

      const delay = 1500 / speedRef.current;
      animationRef.current = setTimeout(() => {
        if (arr[index] === targetValue) {
          setFoundIndex(index);
          setMessage(`Element ${targetValue} found at index ${index}!`);
          setMessageType("success"); // FIX: found → green
          setIsAnimating(false);
          gsap.to(elementRefs.current[index], { backgroundColor: "#22C55E", borderColor: "#15803D", duration: 0.3 });
        } else {
          index++;
          step();
        }
      }, delay);
    };

    step();
  };

  const increaseSpeed = () => {
    setSpeed((prev) => {
      const next = Math.min(prev + 0.5, 5);
      speedRef.current = next;
      return next;
    });
  };

  const decreaseSpeed = () => {
    setSpeed((prev) => {
      const next = Math.max(prev - 0.5, 0.5);
      speedRef.current = next;
      return next;
    });
  };

  // FIX: derive message box classes from messageType instead of foundIndex
  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how Linear Search works by sequentially checking each element in an array.
      </p>

      <form
        ref={formRef}
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="arrayElements">
            Array Elements (comma-separated)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="arrayElements"
              value={arrayElements}
              onChange={(e) => setArrayElements(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 dark:focus:ring-[#a435f0]/30 transition duration-300"
              placeholder="eg. 3, 1, 4, 1, 5"
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
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="target">
            Target Element
          </label>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input
              type="number"
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 dark:focus:ring-[#a435f0]/30 transition duration-300"
              placeholder="eg. 4"
              disabled={isAnimating}
            />

            <div className="flex gap-2 w-full">
              <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
              <ResetButton onReset={handleReset} isAnimating={isAnimating} />
            </div>
          </div>
        </div>

        {isAnimating && (
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={decreaseSpeed}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              disabled={speed <= 0.5}
            >
              -
            </button>
            <span className="text-gray-700 dark:text-gray-300">Speed: {speed}x</span>
            <button
              type="button"
              onClick={increaseSpeed}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              disabled={speed >= 5}
            >
              +
            </button>
          </div>
        )}
      </form>

      {message && (
        <div className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${messageClass}`}>
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {array.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Array Visualization</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {array.map((element, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  ref={(el) => (elementRefs.current[index] = el)}
                  className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(element)} font-medium ${
                    foundIndex === index
                      ? "bg-green-500 dark:bg-green-600 border-green-700 dark:border-green-400 text-gray-800 dark:text-white"
                      : currentIndex === index && foundIndex === -1
                      ? "bg-yellow-500 dark:bg-yellow-600 border-yellow-700 dark:border-yellow-400 text-gray-800 dark:text-white"
                      : index < currentIndex
                      ? "bg-blue-300 dark:bg-blue-700 border-blue-500 dark:border-blue-400 text-gray-800 dark:text-white"
                      : "bg-gray-200 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                  }`}
                >
                  {element}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">[{index}]</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 dark:bg-yellow-600 rounded mr-2"></div>
              <span className="text-sm">Current Element</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded mr-2"></div>
              <span className="text-sm">Found Element</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-300 dark:bg-blue-700 rounded mr-2"></div>
              <span className="text-sm">Checked Elements</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-900 rounded mr-2"></div>
              <span className="text-sm">Unchecked Elements</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LinearSearch;