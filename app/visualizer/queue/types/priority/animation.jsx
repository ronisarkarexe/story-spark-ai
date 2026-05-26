"use client";
import React, { useState } from "react";
import usePlayback from "@/app/hooks/usePlayback";
import LinearMemoryControls from "@/app/components/ui/LinearMemoryControls";

const PriorityQueueVisualizer = () => {
  /* ---------- state ---------- */
  const [pq, setPq] = useState([]);          // sorted: [0] = highest priority (min-val)
  const [inputValue, setInputValue] = useState("");
  const [inputPriority, setInputPriority] = useState("");
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Priority queue is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  const { speed, setSpeed } = usePlayback(1);

  /* ---------- helpers ---------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const showOp = async (txt, ms = 800) => {
    setOperation(txt);
    await sleep(ms / speed);
    setOperation(null);
  };

  /* ---------- insert ---------- */
  const insert = async () => {
    if (!inputValue.trim() || inputPriority === "") {
      setMessage("Please enter both value and priority");
      return;
    }
    const pri = Number(inputPriority);
    if (isNaN(pri)) {
      setMessage("Priority must be a number");
      return;
    }
    setIsAnimating(true);
    await showOp(`Inserting "${inputValue}" with priority ${pri} …`);
    const newEl = { val: inputValue, pri };
    const newPq = [...pq, newEl].sort((a, b) => a.pri - b.pri);
    setPq(newPq);
    setMessage(`"${inputValue}" inserted`);
    setInputValue("");
    setInputPriority("");
    setIsAnimating(false);
  };

  /* ---------- extract-min ---------- */
  const extractMin = async () => {
    if (pq.length === 0) {
      setMessage("Priority queue is empty!");
      return;
    }
    setIsAnimating(true);
    const minEl = pq[0];
    await showOp(`Extracting min element "${minEl.val}" …`);
    setPq((p) => p.slice(1));
    setMessage(`"${minEl.val}" (priority ${minEl.pri}) removed`);
    setIsAnimating(false);
  };

  /* ---------- peek-min ---------- */
  const peekMin = async () => {
    if (pq.length === 0) {
      setMessage("Priority queue is empty!");
      return;
    }
    setIsAnimating(true);
    const minEl = pq[0];
    setMessage(`Min element: "${minEl.val}" (priority ${minEl.pri})`);
    await sleep(1500 / speed);
    setIsAnimating(false);
  };

  /* ---------- clear ---------- */
  const clear = () => {
    setPq([]);
    setInputValue("");
    setInputPriority("");
    setOperation(null);
    setMessage("Priority queue cleared");
  };

  /* ---------- UI ---------- */
  return (
    <main className="container mx-auto px-6 pt-4 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Min-Priority Queue Visualiser (lower number = higher priority)
      </p>

      <div className="max-w-4xl mx-auto">
        {/* ----- Controls card ----- */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 w-full flex flex-col items-center">
          {/* Priority Input row */}
          <div className="w-full flex justify-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-neutral-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="font-medium">Priority:</span>
              <input
                type="number"
                value={inputPriority}
                onChange={(e) => setInputPriority(e.target.value)}
                placeholder="Number"
                className="w-24 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
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
              { label: "Insert", onClick: insert, variant: "primary", needsInput: true },
              { label: "Extract-Min", onClick: extractMin, disabled: pq.length === 0, variant: "secondary" },
              { label: "Peek-Min", onClick: peekMin, disabled: pq.length === 0, variant: "secondary" },
              { label: "Reset", onClick: clear, variant: "outline" }
            ]}
          />
        </div>

        {/* ----- Visualisation card (hidden when empty) ----- */}
        {pq.length > 0 && (
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-center">Visualisation</h2>

            <div className="flex items-center gap-3 w-full justify-center flex-wrap">
              {pq.map((el, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-300 ${
                    idx === 0 && operation?.includes("Extracting") ? "animate-pulse scale-110" : ""
                  }`}
                >
                  <div
                    className={`w-24 h-24 rounded-lg shadow-md flex flex-col items-center justify-center text-lg font-medium border-2 ${
                      idx === 0
                        ? "border-[#c27cf7] dark:border-primary-dark bg-blue-50 dark:bg-blue-900/30 text-primary-dark dark:text-blue-200"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-neutral-900"
                    }`}
                  >
                    <span>{el.val}</span>
                    <span className="text-xs mt-1 opacity-70">pri: {el.pri}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PriorityQueueVisualizer;