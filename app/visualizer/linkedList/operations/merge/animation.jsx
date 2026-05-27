"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";

const LinkedListMerge = () => {
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [mergedList, setMergedList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPointers, setCurrentPointers] = useState({ list1: 0, list2: 0 });
  const list1Refs = useRef([]);
  const list2Refs = useRef([]);
  const mergedRefs = useRef([]);
  const arrowRefs = useRef([]);
  const containerRef = useRef(null);
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
    setMergedList([]);
    setIsAnimating(false);
    setCurrentPointers({ list1: 0, list2: 0 });
    list1Refs.current = [];
    list2Refs.current = [];
    mergedRefs.current = [];
    arrowRefs.current = [];
  };

  const animateMerge = async () => {
    if (isAnimating || list1.length === 0 || list2.length === 0) return;

    setIsAnimating(true);
    animationTimeline.current.clear();

    const sortedList1 = [...list1].sort((a, b) => a.value - b.value);
    const sortedList2 = [...list2].sort((a, b) => a.value - b.value);

    let i = 0;
    let j = 0;
    const result = [];

    gsap.set([...list1Refs.current, ...list2Refs.current], {
      opacity: 1,
      scale: 1,
      backgroundColor: () => "#10b981",
    });

    gsap.set(arrowRefs.current, { opacity: 0.7 });
    setMergedList([]);
    setCurrentPointers({ list1: 0, list2: 0 });

    const mergeStep = async () => {
      if (i >= sortedList1.length && j >= sortedList2.length) {
        setIsAnimating(false);
        return;
      }

      animationTimeline.current.to(
        [
          i < sortedList1.length ? list1Refs.current[i] : null,
          j < sortedList2.length ? list2Refs.current[j] : null,
        ].filter(Boolean),
        {
          scale: 1.3,
          duration: 0.3,
          ease: "power1.inOut",
        },
        "<"
      );

      await new Promise((resolve) => {
        animationTimeline.current.call(() => {
          setCurrentPointers({ list1: i, list2: j });
          resolve();
        }, null, "+=0.3");
      });

      let nextNode;
      if (
        j >= sortedList2.length ||
        (i < sortedList1.length && sortedList1[i].value <= sortedList2[j].value)
      ) {
        nextNode = { ...sortedList1[i], source: "list1" };
        i++;
      } else {
        nextNode = { ...sortedList2[j], source: "list2" };
        j++;
      }

      const tempNode = document.createElement("div");
      tempNode.className =
        "node absolute flex h-16 w-20 items-center justify-center rounded-md bg-emerald-600 font-bold text-white shadow-md";
      tempNode.textContent = nextNode.value;
      containerRef.current.appendChild(tempNode);

      const fromRect =
        nextNode.source === "list1"
          ? list1Refs.current[i - 1]?.getBoundingClientRect()
          : list2Refs.current[j - 1]?.getBoundingClientRect();
      const toPos = mergedList.length * 80 + 40;

      gsap.set(tempNode, {
        x: fromRect?.left - containerRef.current.getBoundingClientRect().left || 0,
        y: fromRect?.top - containerRef.current.getBoundingClientRect().top || 0,
        opacity: 0,
        scale: 0.5,
      });

      animationTimeline.current.to(
        tempNode,
        {
          opacity: 1,
          scale: 1.1,
          duration: 0.4,
          ease: "power2.out",
        },
        "<"
      );

      animationTimeline.current.to(tempNode, {
        x: toPos,
        y: 20,
        scale: 1,
        backgroundColor: "#2563eb",
        duration: 0.8,
        ease: "power3.inOut",
      });

      animationTimeline.current.call(() => {
        result.push(nextNode);
        setMergedList([...result]);
        tempNode.remove();
      }, null, "+=0.2");

      await new Promise((resolve) => {
        animationTimeline.current.call(() => {
          setCurrentPointers({ list1: i, list2: j });
          resolve();
        }, null, "+=0.1");
      });

      await new Promise((resolve) => {
        animationTimeline.current.call(() => {
          mergeStep().then(resolve);
        }, null, "+=0.3");
      });
    };

    await mergeStep();
  };

  useEffect(() => {
    list1Refs.current = list1Refs.current.slice(0, list1.length);
    list2Refs.current = list2Refs.current.slice(0, list2.length);
    mergedRefs.current = mergedRefs.current.slice(0, mergedList.length);
    arrowRefs.current = arrowRefs.current.slice(0, Math.max(0, mergedList.length - 1));
  }, [list1, list2, mergedList]);

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how two sorted linked lists are merged into one ordered result.
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
            onClick={animateMerge}
            disabled={isAnimating || list1.length === 0 || list2.length === 0}
            className="flex-1 rounded-lg bg-primary px-4 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400 sm:px-6"
          >
            {isAnimating ? "Merging..." : "Merge Lists"}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg border border-black px-4 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700 sm:px-6"
          >
            Reset All
          </button>
        </div>
      </VisualizerCard>

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
            <div className="mr-2 h-4 w-4 rounded-md bg-primary"></div>
            <span>Merged</span>
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

          <div className="flex flex-col items-center">
            <h3 className="mb-3 text-lg font-medium text-primary">Merged List</h3>
            <div
              ref={containerRef}
              className="relative w-full overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818]"
            >
              {mergedList.length === 0 ? (
                <div className="w-full py-8 text-center text-gray-500 dark:text-gray-400">
                  {list1.length > 0 && list2.length > 0
                    ? "Click 'Merge Lists' to visualize."
                    : "Generate both lists and merge them."}
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {mergedList.map((node, index) => (
                    <React.Fragment key={`merged-${node.id}`}>
                      <div
                        ref={(el) => (mergedRefs.current[index] = el)}
                        className={`node flex h-16 w-20 flex-col items-center justify-center rounded-md bg-primary text-lg text-white shadow-md ${
                          index === mergedList.length - 1 && isAnimating ? "animate-pulse" : ""
                        }`}
                      >
                        {node.value}
                      </div>
                      {index < mergedList.length - 1 && (
                        <svg
                          ref={(el) => (arrowRefs.current[index] = el)}
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

export default LinkedListMerge;
