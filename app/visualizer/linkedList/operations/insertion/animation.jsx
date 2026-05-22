"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";

const LinkedListVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const nodeRefs = useRef([]);
  const containerRef = useRef(null);
  const animationTimeline = useRef(gsap.timeline());

  const generateAddress = () =>
    `0x${Math.floor(Math.random() * 0x10000)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0")}`;

  const addNode = () => {
    if (!inputValue || isAnimating) return;
    setIsAnimating(true);

    const newNode = {
      value: inputValue,
      id: Date.now(),
      address: generateAddress(),
      next: "NULL",
    };

    const tempNode = document.createElement("div");
    tempNode.className = "node absolute flex border border-gray-300";
    tempNode.innerHTML = `
      <div class="data-part rounded-l-lg bg-blue-500 p-4 text-white">${inputValue}</div>
      <div class="next-part rounded-r-lg bg-blue-300 p-4">NULL</div>
    `;
    containerRef.current.appendChild(tempNode);

    gsap.set(tempNode, {
      x: "50%",
      xPercent: -50,
      y: -100,
      opacity: 0,
    });

    const finalX = list.length * 220;

    animationTimeline.current.clear();
    animationTimeline.current
      .to(tempNode, {
        opacity: 1,
        y: 50,
        duration: 0.5,
      })
      .to(tempNode, {
        x: finalX,
        xPercent: 0,
        duration: 1,
        onComplete: () => {
          if (list.length > 0) {
            const updatedList = [...list];
            updatedList[updatedList.length - 1].next = newNode.address;
            setList([...updatedList, newNode]);
          } else {
            setList([newNode]);
          }
          setIsAnimating(false);
          tempNode.remove();
        },
      });
  };

  const handleReset = () => {
    gsap.killTweensOf("*");
    animationTimeline.current.clear();

    if (containerRef.current) {
      const tempNodes = containerRef.current.querySelectorAll(".node");
      tempNodes.forEach((node) => node.remove());
    }

    setInputValue("");
    setList([]);
    nodeRefs.current = [];
    setIsAnimating(false);
  };

  useEffect(() => {
    nodeRefs.current = nodeRefs.current.slice(0, list.length);

    if (list.length > 0 && nodeRefs.current.length === list.length) {
      gsap.from(nodeRefs.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
      });
    }
  }, [list]);

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how a new node is appended and linked to the end of a linked list.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 rounded-lg border border-gray-400 bg-white p-3 dark:bg-gray-800"
            placeholder="Enter value"
            disabled={isAnimating}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={addNode}
              disabled={isAnimating || !inputValue}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:bg-gray-400"
            >
              {isAnimating ? "Adding..." : "Add Node"}
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      </VisualizerCard>

      <VisualizerCard>
        <div className="mb-6 flex justify-center gap-4 text-sm sm:gap-8 sm:text-base">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-blue-500"></div>
            <span>Data</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-blue-300 dark:bg-blue-600"></div>
            <span>Next Pointer</span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative flex w-full items-start justify-center overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818]"
        >
          {list.length === 0 ? (
            <div className="w-full py-12 text-center text-base text-gray-500 sm:py-16 sm:text-lg">
              No nodes added yet.
            </div>
          ) : (
            <div className="flex items-center space-x-4 sm:space-x-8">
              {list.map((node, index) => (
                <div key={node.id} className="flex items-center">
                  <div
                    ref={(el) => (nodeRefs.current[index] = el)}
                    className="node flex"
                  >
                    <div className="data-part w-16 rounded-l-lg bg-blue-500 p-3 text-center text-base text-white sm:w-20 sm:p-4 sm:text-lg">
                      {node.value}
                    </div>
                    <div className="next-part w-16 rounded-r-lg bg-blue-300 p-3 text-center font-mono text-xs dark:bg-blue-600 sm:w-20 sm:p-4 sm:text-base">
                      {node.next}
                    </div>
                  </div>
                  {index < list.length - 1 && (
                    <div className="mx-1 text-2xl sm:mx-2 sm:text-3xl">&rarr;</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default LinkedListVisualizer;
