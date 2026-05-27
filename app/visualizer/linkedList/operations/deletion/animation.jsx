"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import { createLinkedListTempNode } from "@/app/visualizer/linkedList/utils/createTempNode";

const LinkedListVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const nodeRefs = useRef([]);
  const containerRef = useRef(null);

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

    const tempNode = createLinkedListTempNode({
      value: inputValue,
      nextText: "NULL",
    });
    containerRef.current.appendChild(tempNode);

    gsap.set(tempNode, {
      x: window.innerWidth / 2 - 100,
      y: -100,
      opacity: 0,
    });

    const finalX = 50 + list.length * 220;

    gsap.to(tempNode, {
      opacity: 1,
      y: 50,
      duration: 0.5,
      onComplete: () => {
        gsap.to(tempNode, {
          x: finalX,
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
      },
    });
  };

  const deleteNode = () => {
    if (list.length === 0 || isAnimating) return;
    setIsAnimating(true);

    const nodeToDelete = nodeRefs.current[list.length - 1];

    gsap.to(nodeToDelete, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      onComplete: () => {
        if (list.length > 1) {
          const updatedList = [...list];
          updatedList.pop();
          updatedList[updatedList.length - 1].next = "NULL";
          setList(updatedList);
        } else {
          setList([]);
        }
        setIsAnimating(false);
      },
    });
  };

  const resetList = () => {
    if (isAnimating) return;

    gsap.to(nodeRefs.current, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      stagger: 0.1,
      onComplete: () => {
        setList([]);
      },
    });
  };

  useEffect(() => {
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
        Visualize how deleting the tail node updates the final pointer in a linked list.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-lg border bg-white p-3 dark:bg-gray-700"
              placeholder="Enter value"
              disabled={isAnimating}
            />
            <button
              onClick={addNode}
              disabled={isAnimating || !inputValue}
              className="w-full rounded-lg bg-primary px-6 py-3 text-white disabled:bg-gray-400 sm:w-auto"
            >
              {isAnimating ? "Adding..." : "Add Node"}
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={deleteNode}
              disabled={isAnimating || list.length === 0}
              className="w-full rounded-lg border border-black px-6 py-3 text-black disabled:opacity-50 dark:border-white dark:text-white"
            >
              {isAnimating ? "Deleting..." : "Delete Last Node"}
            </button>
            <button
              onClick={resetList}
              disabled={isAnimating || list.length === 0}
              className="w-full rounded-lg border border-black px-6 py-3 text-black dark:border-white dark:text-white"
            >
              Reset
            </button>
          </div>
        </div>
      </VisualizerCard>

      <VisualizerCard>
        <div className="mb-6 flex justify-center gap-4 text-sm sm:gap-8 sm:text-base">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
            <span>Data</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-[#c27cf7] dark:bg-primary"></div>
            <span>Next Pointer</span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative flex w-full items-start justify-center overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818]"
        >
          {list.length === 0 ? (
            <div className="w-full py-16 text-center text-gray-500">
              No nodes added yet.
            </div>
          ) : (
            <div className="flex items-center space-x-8">
              {list.map((node, index) => (
                <div key={node.id} className="flex items-center">
                  <div
                    ref={(el) => (nodeRefs.current[index] = el)}
                    className="node flex"
                  >
                    <div className="data-part w-20 rounded-l-lg bg-primary p-4 text-center text-white">
                      {node.value}
                    </div>
                    <div className="next-part w-20 rounded-r-lg bg-[#c27cf7] p-4 text-center font-mono dark:bg-primary">
                      {node.next}
                    </div>
                  </div>
                  {index < list.length - 1 && (
                    <div className="mx-2 text-3xl">&rarr;</div>
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
