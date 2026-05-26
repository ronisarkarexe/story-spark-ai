"use client";
import React, { useState } from "react";
import usePlayback from "@/app/hooks/usePlayback";
import LinearMemoryControls from "@/app/components/ui/LinearMemoryControls";

const DequeVisualizer = () => {
  const [deque, setDeque] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Deque is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  const { speed, setSpeed } = usePlayback(1);

  /* ---------- helpers ---------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const showOp = async (txt, ms = 800) => {
    setOperation(txt);
    await sleep(ms / speed);
    setOperation(null);
  };

  /* ---------- enqueue front ---------- */
  const enqueueFront = async () => {
    if (!inputValue.trim()) {
      setMessage("Please enter a value");
      return;
    }
    setIsAnimating(true);
    await showOp(`Enqueuing "${inputValue}" at front …`);
    setDeque((d) => [inputValue, ...d]);
    setMessage(`"${inputValue}" added to front`);
    setInputValue("");
    setIsAnimating(false);
  };

  /* ---------- enqueue rear ---------- */
  const enqueueRear = async () => {
    if (!inputValue.trim()) {
      setMessage("Please enter a value");
      return;
    }
    setIsAnimating(true);
    await showOp(`Enqueuing "${inputValue}" at rear …`);
    setDeque((d) => [...d, inputValue]);
    setMessage(`"${inputValue}" added to rear`);
    setInputValue("");
    setIsAnimating(false);
  };

  /* ---------- dequeue front ---------- */
  const dequeueFront = async () => {
    if (deque.length === 0) {
      setMessage("Deque is empty!");
      return;
    }
    setIsAnimating(true);
    const front = deque[0];
    await showOp(`Dequeuing "${front}" from front …`);
    setDeque((d) => d.slice(1));
    setMessage(`"${front}" removed from front`);
    setIsAnimating(false);
  };

  /* ---------- dequeue rear ---------- */
  const dequeueRear = async () => {
    if (deque.length === 0) {
      setMessage("Deque is empty!");
      return;
    }
    setIsAnimating(true);
    const rear = deque[deque.length - 1];
    await showOp(`Dequeuing "${rear}" from rear …`);
    setDeque((d) => d.slice(0, -1));
    setMessage(`"${rear}" removed from rear`);
    setIsAnimating(false);
  };

  /* ---------- peek front ---------- */
  const peekFront = async () => {
    if (deque.length === 0) {
      setMessage("Deque is empty!");
      return;
    }
    setIsAnimating(true);
    setMessage(`Front element: "${deque[0]}"`);
    await sleep(1500 / speed);
    setIsAnimating(false);
  };

  /* ---------- peek rear ---------- */
  const peekRear = async () => {
    if (deque.length === 0) {
      setMessage("Deque is empty!");
      return;
    }
    setIsAnimating(true);
    setMessage(`Rear element: "${deque[deque.length - 1]}"`);
    await sleep(1500 / speed);
    setIsAnimating(false);
  };

  /* ---------- reset ---------- */
  const reset = () => {
    setDeque([]);
    setInputValue("");
    setOperation(null);
    setMessage("Deque cleared");
  };

  /* ---------- UI ---------- */
  return (
    <main className="container mx-auto px-6 pt-4 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Double-Ended Queue Visualiser
      </p>

      <div className="max-w-4xl mx-auto">
        {/* ----- Controls card ----- */}
        <LinearMemoryControls
          inputValue={inputValue}
          setInputValue={setInputValue}
          isAnimating={isAnimating}
          operation={operation}
          message={message}
          speed={speed}
          onSpeedChange={setSpeed}
          actions={[
            { label: "Enqueue Front", onClick: enqueueFront, variant: "primary", needsInput: true },
            { label: "Enqueue Rear", onClick: enqueueRear, variant: "primary", needsInput: true },
            { label: "Dequeue Front", onClick: dequeueFront, disabled: deque.length === 0, variant: "secondary" },
            { label: "Dequeue Rear", onClick: dequeueRear, disabled: deque.length === 0, variant: "secondary" },
            { label: "Peek Front", onClick: peekFront, disabled: deque.length === 0, variant: "secondary" },
            { label: "Peek Rear", onClick: peekRear, disabled: deque.length === 0, variant: "secondary" },
            { label: "Reset", onClick: reset, variant: "outline" }
          ]}
        />

        {/* ----- Visualisation card (hidden when empty) ----- */}
        {deque.length > 0 && (
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-center">Deque Visualisation</h2>

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

              {/* Elements */}
              <div className="flex items-center gap-4">
                {deque.map((item, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 ${
                      index === 0 && operation?.includes("Dequeuing") && operation?.includes("front")
                        ? "animate-pulse scale-110"
                        : index === deque.length - 1 && operation?.includes("Dequeuing") && operation?.includes("rear")
                        ? "animate-pulse scale-110"
                        : index === 0 && operation?.includes("Enqueuing") && operation?.includes("front")
                        ? "animate-bounce"
                        : index === deque.length - 1 && operation?.includes("Enqueuing") && operation?.includes("rear")
                        ? "animate-bounce"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-24 h-24 rounded-lg shadow-md flex items-center justify-center text-lg font-medium border-2 ${
                        index === 0
                          ? "border-[#c27cf7] dark:border-primary-dark"
                          : index === deque.length - 1
                          ? "border-green-300 dark:border-green-700"
                          : "border-gray-200 dark:border-gray-600"
                      } bg-white dark:bg-neutral-900`}
                    >
                      {item}
                    </div>
                  </div>
                ))}
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

export default DequeVisualizer;