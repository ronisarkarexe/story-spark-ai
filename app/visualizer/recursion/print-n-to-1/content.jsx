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
            Basic Recursion: Print N to 1
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              Counting down recursively from $N$ to $1$ is another fundamental exercise. In this configuration, we initialize the loop parameter $i$ to $N$, and decrement it towards the base case of $0$.
            </p>
            <p className="mt-4 leading-relaxed font-semibold">
              The recursive function signature is:
            </p>
            <p className="mt-2 font-mono bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-155 dark:border-zinc-800 text-center text-md">
              printNTo1(i)
            </p>
            <p className="mt-4 leading-relaxed">
              The parameters and cases work as follows:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Base Case:</strong> <code>i &lt; 1</code>. Once our counter goes below 1, we exit.</li>
              <li><strong>Recursive Step:</strong> Decrement the counter and invoke `printNTo1(i - 1)`.</li>
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
              The function makes exactly $N+1$ recursive calls to print numbers from N down to 1.
            </p>
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Space Complexity: O(N)</span>
              <br />
              Just like printing 1 to N, there are at most $N+1$ active stack frames on the Call Stack. Thus, auxiliary space is linear, $O(N)$.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
