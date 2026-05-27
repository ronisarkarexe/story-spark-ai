"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const HashMapVisualizer = () => {
  const TABLE_SIZE = 8;
  const [hashMap, setHashMap] = useState(Array(TABLE_SIZE).fill(null).map(() => []));
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [operation, setOperation] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const rowRefs = useRef([]);

  const hashFunction = (key) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % TABLE_SIZE;
    }
    return hash;
  };

  const handleInsert = () => {
    if (!keyInput || !valueInput || isAnimating) return;
    const index = hashFunction(keyInput);
    setIsAnimating(true);
    setHighlightIndex(index);
    setOperation(`Key "${keyInput}" hashes to index ${index}`);

    gsap.fromTo(
      rowRefs.current[index],
      { backgroundColor: "#a435f022" },
      {
        backgroundColor: "#a435f044",
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setHashMap((prev) => {
            const newMap = prev.map((bucket) => [...bucket]);
            const existing = newMap[index].findIndex((p) => p.key === keyInput);
            if (existing >= 0) {
              newMap[index][existing].value = valueInput;
              setOperation(`Updated key "${keyInput}" at index ${index}`);
            } else {
              newMap[index].push({ key: keyInput, value: valueInput });
              setOperation(`Inserted "${keyInput}: ${valueInput}" at index ${index}`);
            }
            return newMap;
          });
          setIsAnimating(false);
          setKeyInput("");
          setValueInput("");
          setTimeout(() => setHighlightIndex(null), 1000);
        },
      }
    );
  };

  const handleReset = () => {
    setHashMap(Array(TABLE_SIZE).fill(null).map(() => []));
    setOperation(null);
    setHighlightIndex(null);
    setKeyInput("");
    setValueInput("");
  };

  return (
    <main className="container mx-auto px-6 pb-8">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize key-value insertion with hash function and collision chaining
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <input
              type="text"
              placeholder="Key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-32"
            />
            <input
              type="text"
              placeholder="Value"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-32"
            />
            <button
              onClick={handleInsert}
              disabled={isAnimating}
              className="bg-[#a435f0] text-white px-4 py-2 rounded hover:bg-[#8710d8] disabled:opacity-50"
            >
              Insert
            </button>
            <button
              onClick={handleReset}
              className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Operation Status */}
        {operation && (
          <div className="mb-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-primary-dark dark:text-blue-200 text-center">
            {operation}
          </div>
        )}

        {/* Hash Table Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Hash Table (Size: {TABLE_SIZE})</h2>
          <div className="space-y-2">
            {hashMap.map((bucket, index) => (
              <div
                key={index}
                ref={(el) => (rowRefs.current[index] = el)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  highlightIndex === index
                    ? "border-[#a435f0] bg-[#faf5ff] dark:bg-[#1a0a2e]"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Index */}
                <div className="w-10 h-10 flex items-center justify-center bg-[#a435f0] text-white rounded font-bold text-sm shrink-0">
                  {index}
                </div>

                {/* Bucket contents */}
                <div className="flex gap-2 flex-wrap">
                  {bucket.length === 0 ? (
                    <span className="text-gray-400 text-sm">empty</span>
                  ) : (
                    bucket.map((pair, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 bg-[#f3f4f6] dark:bg-[#222] px-3 py-1 rounded-full text-sm"
                      >
                        <span className="font-medium text-[#a435f0]">{pair.key}</span>
                        <span className="text-gray-400">→</span>
                        <span>{pair.value}</span>
                        {i < bucket.length - 1 && (
                          <span className="ml-1 text-gray-400">→</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Hash Function Info */}
          <div className="mt-4 p-3 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-lg border border-[#e9d5ff] dark:border-[#3b1a6e] text-sm text-gray-600 dark:text-gray-400">
            Hash Function: sum of char codes % {TABLE_SIZE}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HashMapVisualizer;