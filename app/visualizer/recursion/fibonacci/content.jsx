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
            What is Tree Recursion? (Fibonacci example)
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              In linear recursion (like Factorial), a function makes at most <strong>one</strong> recursive call per execution frame. In <strong>Tree Recursion</strong>, a function makes <strong>multiple</strong> recursive calls per frame. This branches out, forming a tree-like execution graph.
            </p>
            <p className="mt-4 leading-relaxed font-semibold">
              The Fibonacci recurrence relation is:
            </p>
            <p className="mt-2 font-mono bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-150 dark:border-zinc-800 text-center text-lg">
              fib(N) = fib(N - 1) + fib(N - 2)
            </p>
            <p className="mt-4 leading-relaxed">
              This triggers two recursive calls at each step, except for base cases:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Base Cases:</strong> <code>fib(0) = 0</code> and <code>fib(1) = 1</code>.</li>
              <li><strong>Recursive Case:</strong> <code>fib(n) = fib(n-1) + fib(n-2)</code>.</li>
            </ul>
          </div>
        </section>

        {/* Overlapping Subproblems */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-amber-500 mr-3 rounded-full"></span>
            Overlapping Subproblems
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              If you inspect the recursion tree, you will notice that the same state is calculated multiple times. For example, to calculate <code>fib(4)</code>:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5 marker:text-gray-400">
              <li><code>fib(2)</code> is calculated <strong>2 times</strong>.</li>
              <li><code>fib(1)</code> is calculated <strong>3 times</strong>.</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              As $N$ grows, the number of redundant computations grows exponentially. This can be optimized using <strong>Memoization</strong> (caching results) or <strong>Dynamic Programming</strong> (iterative solutions) to reduce time complexity from exponential to linear.
            </p>
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
              Specifically, the number of operations is proportional to the Golden Ratio raised to $N$ power, approx. $1.618^N$, which is mathematically bounded by $O(2^N)$ representing exponential growth.
            </p>
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Space Complexity: O(N)</span>
              <br />
              Even though the total number of calls is exponential, the Call Stack only holds active frames. The maximum stack depth is bounded by the height of the tree, which is linear, $O(N)$.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
