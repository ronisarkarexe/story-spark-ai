"use client";
import React from "react";

const Content = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        {/* Concept */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            Recursive Binary Search
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              <strong>Binary Search</strong> is a highly efficient algorithm for finding a target value within a <em>sorted</em> array. 
              Instead of searching linearly item-by-item, it repeatedly halves the search space.
            </p>
            <p className="mt-4 leading-relaxed font-semibold">
              How it works recursively:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Base Case 1 (Empty Interval):</strong> If the search pointers cross (<code>low &gt; high</code>), the element is not present. Return <code>-1</code>.</li>
              <li><strong>Mid Computation:</strong> Find the middle index: <code>mid = Math.floor((low + high) / 2)</code>.</li>
              <li><strong>Base Case 2 (Match Found):</strong> If <code>arr[mid] === target</code>, the search is complete. Return <code>mid</code>.</li>
              <li><strong>Recursive Step (Left Half):</strong> If the target is smaller than the middle element, search the left subsegment recursively: <code>binarySearch(arr, target, low, mid - 1)</code>.</li>
              <li><strong>Recursive Step (Right Half):</strong> If the target is larger, search the right subsegment recursively: <code>binarySearch(arr, target, mid + 1, high)</code>.</li>
            </ul>
          </div>
        </section>

        {/* Complexity Analysis */}
        <section className="p-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            Complexity Analysis
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] space-y-3">
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Time Complexity: O(log N)</span>
              <br />
              Each recursive call divides the search space in half. For an array of size $N$, it takes at most $\log_2 N$ steps to find the element or determine its absence.
            </p>
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Space Complexity: O(log N)</span>
              <br />
              Since it divides the array space recursively, the maximum call stack height is $\log_2 N$, requiring logarithmic auxiliary stack space.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
