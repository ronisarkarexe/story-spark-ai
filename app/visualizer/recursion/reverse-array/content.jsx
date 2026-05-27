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
            Recursion on Arrays: Reverse an Array
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              Reversing an array recursively utilizes a **two-pointer approach**. We maintain a left pointer ($L$) starting at index $0$ and a right pointer ($R$) starting at index $len - 1$.
            </p>
            <p className="mt-4 leading-relaxed font-semibold">
              The recursive algorithm is structured as:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Base Case:</strong> <code>l &gt;= r</code>. When the pointers cross or meet in the middle, the array is fully reversed, and the recursion halts.</li>
              <li><strong>Swap Process:</strong> Swap elements at index $L$ and index $R$.</li>
              <li><strong>Recursive Step:</strong> Increment $L$ by 1, decrement $R$ by 1, and make the recursive call: <code>reverse(l + 1, r - 1, arr)</code>.</li>
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
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Time Complexity: O(N)</span>
              <br />
              Since each recursive call processes 2 elements (one swap) and we swap $N/2$ times, the execution runs in linear time $O(N)$.
            </p>
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Space Complexity: O(N)</span>
              <br />
              At the deepest recursion level, there are $N/2$ stack frames on the Call Stack. Thus, the auxiliary space is bounded by $O(N)$.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
