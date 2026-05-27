"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";

const LinkedListComparison = () => {
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPointers, setCurrentPointers] = useState({ list1: 0, list2: 0 });
  const [comparisonResult, setComparisonResult] = useState(null);
  const list1Refs = useRef([]);
  const list2Refs = useRef([]);
  const animationTimeline = useRef(gsap.timeline());

  const generateRandomList = (setList) => {
    const size = Math.floor(Math.random() * 3) + 3;
    const values = Array.from({ length: size }, (_, i) => {
      const base = Math.floor(Math.random() * 20) + 1;
      return base + i * 5;
    }).sort((a, b) => a - b);

    const newList = values.map((value, index) => ({
      value,
      id: Date.now() + index + Math.random(),
      next:
        index < size - 1
          ? `0x${(1000 + index).toString(16).padStart(4, "0")}`
          : "NULL",
    }));

    setList(newList);
  };

  const handleReset = () => {
    gsap.killTweensOf("*");
    animationTimeline.current.clear();
    setList1([]);
    setList2([]);
    setIsAnimating(false);
    setCurrentPointers({ list1: 0, list2: 0 });
    setComparisonResult(null);
    list1Refs.current = [];
    list2Refs.current = [];
  };

  const animateComparison = async () => {
    if (isAnimating || list1.length === 0 || list2.length === 0) return;

    setIsAnimating(true);
    animationTimeline.current.clear();
    setCurrentPointers({ list1: 0, list2: 0 });
    setComparisonResult(null);

    const maxLength = Math.max(list1.length, list2.length);
    let areSame = true;

    for (let i = 0; i < maxLength; i++) {
      setCurrentPointers({ list1: i, list2: i });

      const node1 = list1[i];
      const node2 = list2[i];

      const highlightNodes = [list1Refs.current[i], list2Refs.current[i]].filter(Boolean);

      animationTimeline.current.to(highlightNodes, {
        scale: 1.3,
        duration: 0.4,
        ease: "power1.inOut",
      });

      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!node1 || !node2 || node1.value !== node2.value) {
        areSame = false;
        setComparisonResult({
          match: false,
          index: i,
          value1: node1?.value,
          value2: node2?.value,
        });
        break;
      }

      animationTimeline.current.to(highlightNodes, {
        scale: 1,
        duration: 0.3,
      });
    }

    if (areSame) {
      setComparisonResult({ match: true });
    }

    animationTimeline.current.call(() => {
      setIsAnimating(false);
    });
  };

  useEffect(() => {
    list1Refs.current = list1Refs.current.slice(0, list1.length);
    list2Refs.current = list2Refs.current.slice(0, list2.length);
  }, [list1, list2]);

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how two linked lists are compared node by node from left to right.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => generateRandomList(setList1)}
            disabled={isAnimating}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-3 text-white transition hover:bg-emerald-700 disabled:bg-gray-400 sm:px-6"
          >
            Generate List 1
          </button>
          <button
            onClick={() => generateRandomList(setList2)}
            disabled={isAnimating}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-3 text-white transition hover:bg-emerald-700 disabled:bg-gray-400 sm:px-6"
          >
            Generate List 2
          </button>
          <button
            onClick={animateComparison}
            disabled={isAnimating || list1.length === 0 || list2.length === 0}
            className="flex-1 rounded-lg bg-primary px-4 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400 sm:px-6"
          >
            {isAnimating ? "Comparing..." : "Compare Lists"}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg border border-black px-4 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700 sm:px-6"
          >
            Reset All
          </button>
        </div>
      </VisualizerCard>

      {comparisonResult && (
        <VisualizerCard
          className={
            comparisonResult.match
              ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
              : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
          }
        >
          <p
            className={`text-center text-lg font-semibold ${
              comparisonResult.match
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {comparisonResult.match
              ? "Both linked lists are the same."
              : `Lists differ at node ${comparisonResult.index + 1}: List 1 has ${comparisonResult.value1 ?? "NULL"} and List 2 has ${comparisonResult.value2 ?? "NULL"}.`}
          </p>
        </VisualizerCard>
      )}

      <VisualizerCard className="space-y-10">
        <div className="flex flex-wrap justify-center gap-3 text-sm sm:gap-6 sm:text-base">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-md bg-emerald-600"></div>
            <span>List 1</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-md bg-emerald-600"></div>
            <span>List 2</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-md bg-gray-400"></div>
            <span>Pointer</span>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex flex-col items-center">
            <h3 className="mb-3 text-lg font-medium text-emerald-600">
              List 1 {currentPointers.list1 < list1.length && `(Current: ${currentPointers.list1 + 1})`}
            </h3>
            <div className="relative w-full overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818]">
              {list1.length === 0 ? (
                <div className="w-full py-8 text-center text-gray-500 dark:text-gray-400">
                  Generate List 1 to begin.
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {list1.map((node, index) => (
                    <React.Fragment key={`list1-${node.id}`}>
                      <div
                        ref={(el) => (list1Refs.current[index] = el)}
                        className={`node flex h-16 w-20 flex-col items-center justify-center rounded-md bg-emerald-600 text-lg text-white shadow-md transition-all ${
                          index === currentPointers.list1 && isAnimating ? "scale-110 ring-4 ring-emerald-300" : ""
                        }`}
                      >
                        {node.value}
                        <div className="mt-1 text-xs opacity-80">{node.next}</div>
                      </div>
                      {index < list1.length - 1 && (
                        <svg
                          className="h-8 w-8 text-gray-600 opacity-70 dark:text-gray-300"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="mb-3 text-lg font-medium text-emerald-600">
              List 2 {currentPointers.list2 < list2.length && `(Current: ${currentPointers.list2 + 1})`}
            </h3>
            <div className="relative w-full overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818]">
              {list2.length === 0 ? (
                <div className="w-full py-8 text-center text-gray-500 dark:text-gray-400">
                  Generate List 2 to continue.
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {list2.map((node, index) => (
                    <React.Fragment key={`list2-${node.id}`}>
                      <div
                        ref={(el) => (list2Refs.current[index] = el)}
                        className={`node flex h-16 w-20 flex-col items-center justify-center rounded-md bg-emerald-600 text-lg text-white shadow-md transition-all ${
                          index === currentPointers.list2 && isAnimating ? "scale-110 ring-4 ring-emerald-300" : ""
                        }`}
                      >
                        {node.value}
                        <div className="mt-1 text-xs opacity-80">{node.next}</div>
                      </div>
                      {index < list2.length - 1 && (
                        <svg
                          className="h-8 w-8 text-gray-600 opacity-70 dark:text-gray-300"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default LinkedListComparison;
