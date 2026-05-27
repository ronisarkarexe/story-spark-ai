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
            Recursion on Subsequences: Take vs. Skip
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              A **subsequence** is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements (e.g., for `[1, 2]`, subsequences are `[]`, `[1]`, `[2]`, `[1, 2]`).
            </p>
            <p className="mt-4 leading-relaxed font-semibold">
              To generate all subsequences recursively, we make a **binary choice** at each index:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Choice 1 (Take):</strong> Include the element at the current index in the active subsequence, and call the function recursively for the next index.</li>
              <li><strong>Choice 2 (Skip/Backtrack):</strong> Remove the element from the active subsequence (backtrack), and call the function recursively for the next index.</li>
              <li><strong>Base Case:</strong> <code>index === arr.length</code>. When we&apos;ve made decisions for all elements in the array, we print/save the current subsequence and return.</li>
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
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Time Complexity: O(2^N)</span>
              <br />
              Since we make 2 choices for each of the $N$ elements, the recursion tree has a branching factor of 2 and depth $N$, resulting in $2^N$ leaf nodes/subsequences.
            </p>
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Space Complexity: O(N)</span>
              <br />
              The maximum height of the recursion tree and call stack depth is $N$, corresponding to the number of elements. Thus, auxiliary stack space is linear, $O(N)$.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
