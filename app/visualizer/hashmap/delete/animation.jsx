"use client";
import React, { useState, useRef } from "react";
import { gsap } from "gsap";

const HashMapDeleteVisualizer = () => {
  const TABLE_SIZE = 8;
  const [hashMap, setHashMap] = useState(Array(TABLE_SIZE).fill(null).map(() => []));
  const [keyInput, setKeyInput] = useState("");
  const [insertKey, setInsertKey] = useState("");
  const [insertValue, setInsertValue] = useState("");
  const [operation, setOperation] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [deletedKey, setDeletedKey] = useState(null);
  const rowRefs = useRef([]);

  const hashFunction = (key) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % TABLE_SIZE;
    }
    return hash;
  };

  const handleInsert = () => {
    if (!insertKey || !insertValue || isAnimating) return;
    const index = hashFunction(insertKey);
    setHashMap((prev) => {
      const newMap = prev.map((bucket) => [...bucket]);
      const existing = newMap[index].findIndex((p) => p.key === insertKey);
      if (existing >= 0) {
        newMap[index][existing].value = insertValue;
      } else {
        newMap[index].push({ key: insertKey, value: insertValue });
      }
      return newMap;
    });
    setOperation(`Inserted "${insertKey}: ${insertValue}" at index ${index}`);
    setInsertKey("");
    setInsertValue("");
  };

  const handleDelete = () => {
    if (!keyInput || isAnimating) return;
    const index = hashFunction(keyInput);
    setIsAnimating(true);
    setHighlightIndex(index);
    setOperation(`Searching for key "${keyInput}" at index ${index}...`);

    gsap.fromTo(
      rowRefs.current[index],
      { backgroundColor: "#fee2e222" },
      {
        backgroundColor: "#fee2e244",
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setHashMap((prev) => {
            const newMap = prev.map((bucket) => [...bucket]);
            const existing = newMap[index].findIndex((p) => p.key === keyInput);
            if (existing >= 0) {
              newMap[index].splice(existing, 1);
              setOperation(`Deleted key "${keyInput}" from index ${index}`);
              setDeletedKey(keyInput);
            } else {
              setOperation(`Key "${keyInput}" not found at index ${index}`);
            }
            return newMap;
          });
          setIsAnimating(false);
          setKeyInput("");
          setTimeout(() => {
            setHighlightIndex(null);
            setDeletedKey(null);
          }, 1500);
        },
      }
    );
  };

  const handleReset = () => {
    setHashMap(Array(TABLE_SIZE).fill(null).map(() => []));
    setOperation(null);
    setHighlightIndex(null);
    setDeletedKey(null);
    setKeyInput("");
    setInsertKey("");
    setInsertValue("");
  };

  return (
    <main className="container mx-auto px-6 pb-8">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize key deletion with hash function lookup and bucket removal
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Insert Controls */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-4">
          <p className="text-sm text-gray-500 mb-3 font-medium">Add entries first:</p>
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <input
              type="text"
              placeholder="Key"
              value={insertKey}
              onChange={(e) => setInsertKey(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-32"
            />
            <input
              type="text"
              placeholder="Value"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-32"
            />
            <button
              onClick={handleInsert}
              className="bg-[#a435f0] text-white px-4 py-2 rounded hover:bg-[#8710d8]"
            >
              Insert
            </button>
          </div>
        </div>

        {/* Delete Controls */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
          <p className="text-sm text-gray-500 mb-3 font-medium">Delete by key:</p>
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <input
              type="text"
              placeholder="Key to delete"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-40"
            />
            <button
              onClick={handleDelete}
              disabled={isAnimating}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              Delete
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
          <div className={`mb-4 p-3 rounded-lg text-center ${
            deletedKey
              ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
              : "bg-blue-100 dark:bg-blue-900 text-primary-dark dark:text-blue-200"
          }`}>
            {operation}
          </div>
        )}

        {/* Hash Table */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Hash Table (Size: {TABLE_SIZE})</h2>
          <div className="space-y-2">
            {hashMap.map((bucket, index) => (
              <div
                key={index}
                ref={(el) => (rowRefs.current[index] = el)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  highlightIndex === index
                    ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-[#a435f0] text-white rounded font-bold text-sm shrink-0">
                  {index}
                </div>
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
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-lg border border-[#e9d5ff] dark:border-[#3b1a6e] text-sm text-gray-600 dark:text-gray-400">
            Hash Function: sum of char codes % {TABLE_SIZE}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HashMapDeleteVisualizer;