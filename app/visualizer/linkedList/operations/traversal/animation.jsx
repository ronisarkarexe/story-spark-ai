"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";

const LinkedListTraversal = () => {
  const [list, setList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const nodeRefs = useRef([]);
  const arrowRefs = useRef([]);
  const addressRefs = useRef([]);
  const containerRef = useRef(null);
  const animationTimeline = useRef(gsap.timeline());

  const generateRandomList = () => {
    if (isAnimating) return;
    handleReset();

    const values = [
      "\u{1F436}",
      "\u{1F431}",
      "\u{1F42D}",
      "\u{1F439}",
      "\u{1F430}",
      "\u{1F98A}",
      "\u{1F43B}",
      "\u{1F43C}",
    ];
    const size = Math.min(Math.floor(Math.random() * 3) + 3, values.length);
    const shuffledValues = [...values].sort(() => 0.5 - Math.random());

    // First generate stable addresses for each node.
    // This ensures the next pointer references the address of the actual next node.
    const addresses = Array.from({ length: size }, () =>
      `0x${Math.floor(Math.random() * 0x10000)
        .toString(16)
        .padStart(4, "0")}`
    );

    const newList = shuffledValues.slice(0, size).map((value, index) => ({
      value,
      id: Date.now() + index,
      address: addresses[index],
      next: index < size - 1 ? addresses[index + 1] : "NULL",
    }));

    setList(newList);
  };

  const animateTraversal = () => {
    if (isAnimating || list.length === 0) return;
    setIsAnimating(true);

    gsap.set(nodeRefs.current, {
      backgroundColor: "#3b82f6",
      scale: 1,
      y: 0,
    });

    gsap.set(arrowRefs.current, {
      opacity: 0.6,
      scale: 1,
    });

    gsap.set(addressRefs.current, {
      color: "#6b7280",
    });

    animationTimeline.current.clear();

    list.forEach((node, index) => {
      animationTimeline.current.to(
        nodeRefs.current[index],
        {
          duration: 0.5,
          backgroundColor: "#10b981",
          scale: 1.2,
          y: -20,
          ease: "elastic.out(1, 0.5)",
        },
        `+=${index * 0.3}`
      );

      animationTimeline.current.to(
        addressRefs.current[index],
        {
          duration: 0.3,
          color: "#3b82f6",
          fontWeight: "bold",
          ease: "power1.inOut",
        },
        "-=0.4"
      );

      if (index < list.length - 1) {
        animationTimeline.current.to(
          arrowRefs.current[index],
          {
            duration: 0.3,
            opacity: 1,
            scale: 1.3,
            ease: "power1.inOut",
          },
          "-=0.3"
        );
      }

      animationTimeline.current.to(
        nodeRefs.current[index],
        {
          duration: 0.5,
          backgroundColor: "#3b82f6",
          scale: 1,
          y: 0,
          ease: "back.out(1)",
        },
        "+=0.2"
      );

      if (index < list.length - 1) {
        animationTimeline.current.to(
          arrowRefs.current[index],
          {
            duration: 0.3,
            opacity: 0.6,
            scale: 1,
            ease: "power1.inOut",
          },
          "+=0.1"
        );
      }

      animationTimeline.current.to(
        addressRefs.current[index],
        {
          duration: 0.3,
          color: "#6b7280",
          fontWeight: "normal",
          ease: "power1.inOut",
        },
        "+=0.1"
      );
    });

    animationTimeline.current.eventCallback("onComplete", () => {
      setIsAnimating(false);
    });
  };

  const handleReset = () => {
    gsap.killTweensOf("*");
    animationTimeline.current.clear();
    setList([]);
    setIsAnimating(false);
    nodeRefs.current = [];
    arrowRefs.current = [];
    addressRefs.current = [];
  };

  useEffect(() => {
    nodeRefs.current = nodeRefs.current.slice(0, list.length);
    arrowRefs.current = arrowRefs.current.slice(0, Math.max(0, list.length - 1));
    addressRefs.current = addressRefs.current.slice(0, list.length);
  }, [list]);

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how traversal visits each node in a linked list from head to tail.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={generateRandomList}
            disabled={isAnimating}
            className="flex-1 rounded-lg bg-[#a435f0]/10 px-6 py-3 text-[#a435f0] transition hover:bg-[#a435f0]/20 border border-[#a435f0]/30 disabled:opacity-50"
          >
            Generate List
          </button>
          <button
            onClick={animateTraversal}
            disabled={isAnimating || list.length === 0}
            className="flex-1 rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400"
          >
            {isAnimating ? "Traversing..." : "Animate Traversal"}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </VisualizerCard>

      <VisualizerCard>
        <div className="mb-6 flex flex-wrap justify-center gap-3 text-sm sm:gap-6 sm:text-base">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
            <span>Node</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-emerald-500"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-[#c27cf7]"></div>
            <span>Address</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-gray-400"></div>
            <span>Pointer</span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative flex min-h-[220px] w-full items-center justify-center overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818]"
        >
          {list.length === 0 ? (
            <div className="w-full py-12 text-center text-gray-500 dark:text-gray-400">
              Click &quot;Generate List&quot; to create a linked list.
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
              {list.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      ref={(el) => {
                        addressRefs.current[index] = el;
                      }}
                      className="text-xs font-mono text-gray-500 dark:text-gray-400"
                    >
                      {node.address}
                    </div>
                    <div
                      ref={(el) => (nodeRefs.current[index] = el)}
                      className="node flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-full bg-primary text-3xl text-white shadow-md transition-all hover:shadow-lg"
                      onClick={animateTraversal}
                    >
                      {node.value}
                    </div>
                    <div className="rounded bg-blue-100 px-2 py-1 text-xs font-mono dark:bg-blue-900">
                      Next: {node.next}
                    </div>
                  </div>
                  {index < list.length - 1 && (
                    <svg
                      ref={(el) => (arrowRefs.current[index] = el)}
                      className="my-4 h-8 w-8 text-gray-600 opacity-60 dark:text-gray-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default LinkedListTraversal;
