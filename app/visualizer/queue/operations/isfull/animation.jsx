"use client";
import { useState, useEffect } from "react";
import usePlayback from "@/app/hooks/usePlayback";
import LinearMemoryControls from "@/app/components/ui/LinearMemoryControls";

const QueueVisualizer = () => {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [maxSize, setMaxSize] = useState(5);          // capacity
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Queue is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  const { speed, setSpeed } = usePlayback(1);

  const isFull = queue.length >= maxSize;

  /* ---------- helpers ---------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const showOp = async (txt, ms = 800) => {
    setOperation(txt);
    await sleep(ms / speed);
    setOperation(null);
  };

  /* ---------- enqueue ---------- */
  const enqueue = async () => {
    if (!inputValue.trim()) {
      setMessage("Please enter a value");
      return;
    }
    if (isFull) {
      setMessage("Queue is full!");
      return;
    }
    setIsAnimating(true);
    await showOp(`Enqueuing “${inputValue}” …`);
    setQueue((q) => [...q, inputValue]);
    setMessage(`“${inputValue}” added to rear`);
    setInputValue("");
    setIsAnimating(false);
  };

  /* ---------- dequeue ---------- */
  const dequeue = async () => {
    if (queue.length === 0) {
      setMessage("Queue is empty!");
      return;
    }
    setIsAnimating(true);
    const front = queue[0];
    await showOp(`Dequeuing “${front}” …`);
    setQueue((q) => q.slice(1));
    setMessage(`“${front}” removed from front`);
    setIsAnimating(false);
  };

  /* ---------- isFull ---------- */
  const checkFull = async () => {
    setIsAnimating(true);
    await showOp("Checking if queue is full …");
    setMessage(isFull ? "Queue is FULL" : "Queue is NOT full");
    setIsAnimating(false);
  };

  /* ---------- reset ---------- */
  const reset = () => {
    setQueue([]);
    setInputValue("");
    setOperation(null);
    setMessage("Queue cleared");
  };

  /* ---------- UI ---------- */
  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualise isFull operation in real-time
      </p>

      <div className="max-w-4xl mx-auto">
        {/* ----- Controls card ----- */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 w-full flex flex-col items-center">
          {/* Max-size input */}
          <div className="w-full flex justify-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-neutral-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="font-medium">Queue Capacity:</span>
              <input
                type="number"
                min="1"
                max="20"
                value={maxSize}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0) setMaxSize(val);
                }}
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
              { label: "Dequeue", onClick: dequeue, disabled: queue.length === 0, variant: "secondary" },
              { label: "IsFull", onClick: checkFull, variant: "secondary" },
              { label: "Reset", onClick: reset, variant: "outline" }
            ]}
          />
        </div>

        {/* ----- Visualisation card (hidden when empty) ----- */}
        {queue.length > 0 && (
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-center">Queue Visualisation</h2>

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
                {queue.map((item, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 ${
                      index === 0 && operation?.includes("Dequeuing")
                        ? "animate-pulse scale-110"
                        : index === queue.length - 1 && operation?.includes("Enqueuing")
                        ? "animate-bounce"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-24 h-24 rounded-lg shadow-md flex items-center justify-center text-lg font-medium border-2 ${
                        index === 0
                          ? "border-[#c27cf7] dark:border-primary-dark"
                          : index === queue.length - 1
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

export default QueueVisualizer;