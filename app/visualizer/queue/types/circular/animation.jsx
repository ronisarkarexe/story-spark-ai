"use client";
import React, { useState } from "react";
import usePlayback from "@/app/hooks/usePlayback";
import LinearMemoryControls from "@/app/components/ui/LinearMemoryControls";

const CircularQueueVisualizer = () => {
  const [maxSize, setMaxSize] = useState(5); // capacity
  const [queue, setQueue] = useState(Array(5).fill(null));
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(-1);
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Circular queue is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  const { speed, setSpeed } = usePlayback(1);

  const isEmpty = count === 0;
  const isFull = count === maxSize;

  /* ---------- helpers ---------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const showOp = async (txt, ms = 800) => {
    setOperation(txt);
    await sleep(ms / speed);
    setOperation(null);
  };
  const wrap = (idx) => (idx + maxSize) % maxSize;

  /* ---------- enqueue rear ---------- */
  const enqueue = async () => {
    if (!inputValue.trim()) {
      setMessage("Please enter a value");
      return;
    }
    if (isFull) {
      setMessage("Circular queue is full!");
      return;
    }
    setIsAnimating(true);
    await showOp(`Enqueuing "${inputValue}" at rear …`);
    const newRear = wrap(rear + 1);
    const newQ = [...queue];
    newQ[newRear] = inputValue;
    setQueue(newQ);
    setRear(newRear);
    setCount(count + 1);
    setMessage(`"${inputValue}" added`);
    setInputValue("");
    setIsAnimating(false);
  };

  /* ---------- dequeue front ---------- */
  const dequeue = async () => {
    if (isEmpty) {
      setMessage("Circular queue is empty!");
      return;
    }
    setIsAnimating(true);
    const item = queue[front];
    await showOp(`Dequeuing "${item}" from front …`);
    const newQ = [...queue];
    newQ[front] = null;
    setQueue(newQ);
    setFront(wrap(front + 1));
    setCount(count - 1);
    setMessage(`"${item}" removed`);
    setIsAnimating(false);
  };

  /* ---------- isEmpty ---------- */
  const checkEmpty = async () => {
    setIsAnimating(true);
    await showOp("Checking if empty …");
    setMessage(
      isEmpty ? "Circular queue is EMPTY" : "Circular queue is NOT empty"
    );
    setIsAnimating(false);
  };

  /* ---------- isFull ---------- */
  const checkFull = async () => {
    setIsAnimating(true);
    await showOp("Checking if full …");
    setMessage(
      isFull ? "Circular queue is FULL" : "Circular queue is NOT full"
    );
    setIsAnimating(false);
  };

  /* ---------- reset ---------- */
  const reset = () => {
    setQueue(Array(maxSize).fill(null));
    setFront(0);
    setRear(-1);
    setCount(0);
    setInputValue("");
    setOperation(null);
    setMessage("Circular queue cleared");
  };

  /* ---------- change capacity ---------- */
  const resize = (newCap) => {
    if (newCap < 1) return;
    const newQ = Array(newCap).fill(null);
    let idx = 0;
    for (let i = 0; i < Math.min(count, newCap); i++) {
      newQ[idx++] = queue[wrap(front + i)];
    }
    setQueue(newQ);
    setMaxSize(newCap);
    setFront(0);
    setRear(idx - 1);
    setCount(idx);
    setMessage(`Capacity set to ${newCap}`);
  };

  /* ---------- UI ---------- */
  return (
    <main className="container mx-auto px-6 pt-4 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Circular Queue Visualiser (Fixed Capacity)
      </p>

      <div className="max-w-4xl mx-auto">
        {/* ----- Controls card ----- */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 w-full flex flex-col items-center">
          {/* Capacity Input */}
          <div className="w-full flex justify-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-neutral-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="font-medium">Capacity:</span>
              <input
                type="number"
                min="1"
                max="15"
                value={maxSize}
                onChange={(e) => resize(Number(e.target.value))}
                className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                disabled={isAnimating}
              />
            </label>
          </div>

          <LinearMemoryControls
            inputValue={inputValue}
            setInputValue={setInputValue}
            isAnimating={isAnimating}
            operation={operation}
            message={message}
            speed={speed}
            onSpeedChange={setSpeed}
            actions={[
              { label: "Enqueue", onClick: enqueue, variant: "primary", needsInput: true, disabled: isFull },
              { label: "Dequeue", onClick: dequeue, disabled: isEmpty, variant: "secondary" },
              { label: "IsEmpty", onClick: checkEmpty, variant: "secondary" },
              { label: "IsFull", onClick: checkFull, variant: "secondary" },
              { label: "Reset", onClick: reset, variant: "outline" }
            ]}
          />
        </div>

        {/* ----- Visualisation card (hidden when empty) ----- */}
        {!isEmpty && (
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 w-full justify-center">
              {/* Front pointer */}
              <div className="text-primary dark:text-[#c27cf7] font-medium flex flex-col items-center">
                <span>Front</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Elements (circular order) */}
              <div className="flex items-center gap-4">
                {Array.from({ length: maxSize }).map((_, idx) => {
                  const itemIdx = wrap(front + idx);
                  const item = queue[itemIdx];
                  const isFront = itemIdx === front;
                  const isRear = itemIdx === rear;
                  return (
                    <div key={itemIdx} className="flex flex-col items-center">
                      <div
                        className={`w-20 h-20 rounded-lg shadow-md flex items-center justify-center text-lg font-medium border-2 ${
                          item === null
                            ? "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/30 text-gray-400"
                            : isFront
                            ? "border-[#c27cf7] dark:border-primary-dark bg-blue-50 dark:bg-blue-900/30 text-primary-dark dark:text-blue-200"
                            : isRear
                            ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-neutral-900"
                        } transition-all`}
                      >
                        {item ?? "·"}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        #{itemIdx}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Rear pointer */}
              <div className="text-green-600 dark:text-green-400 font-medium flex flex-col items-center">
                <span>Rear</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CircularQueueVisualizer;
