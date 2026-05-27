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
            Sum of First N Numbers Recursively
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              Summing numbers from $1$ to $N$ is a classic arithmetic operation. The sum of the first $N$ numbers can be calculated using recursion by formulating the problem as:
            </p>
            <p className="mt-2 font-mono bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-150 dark:border-zinc-800 text-center text-lg">
              sum(N) = N + sum(N - 1)
            </p>
            <p className="mt-4 leading-relaxed">
              The structure of the recursive function consists of:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Base Case:</strong> <code>sum(0) = 0</code>. When $N$ becomes $0$, the recursion stops and returns $0$.</li>
              <li><strong>Recursive Step:</strong> <code>n + sum(n-1)</code>. The function calls itself with $n-1$.</li>
            </ul>
          </div>
        </section>

        {/* Step-by-Step Trace */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            Trace of sum(3)
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              The step-by-step resolution of <code>sum(3)</code> is as follows:
            </p>
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400 mt-2">
              <li className="pl-2"><code>sum(3)</code> is called $\rightarrow$ calls <code>sum(2)</code>.</li>
              <li className="pl-2"><code>sum(2)</code> is called $\rightarrow$ calls <code>sum(1)</code>.</li>
              <li className="pl-2"><code>sum(1)</code> is called $\rightarrow$ calls <code>sum(0)</code>.</li>
              <li className="pl-2"><code>sum(0)</code> is called $\rightarrow$ base case matched, returns <strong>0</strong>.</li>
              <li className="pl-2"><code>sum(1)</code> receives 0, computes $1 + 0 = 1$, returns <strong>1</strong>.</li>
              <li className="pl-2"><code>sum(2)</code> receives 1, computes $2 + 1 = 3$, returns <strong>3</strong>.</li>
              <li className="pl-2"><code>sum(3)</code> receives 3, computes $3 + 3 = 6$, returns <strong>6</strong>.</li>
            </ol>
          </div>
        </section>

        {/* Complexity */}
        <section className="p-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            Complexity Analysis
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] space-y-3">
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Time Complexity: O(N)</span>
              <br />
              There are $N+1$ recursive calls, each executing in constant time $O(1)$.
            </p>
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Space Complexity: O(N)</span>
              <br />
              At the deepest recursion level, there are $N+1$ stack frames concurrently on the Call Stack. Thus, auxiliary space is linear, $O(N)$.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
