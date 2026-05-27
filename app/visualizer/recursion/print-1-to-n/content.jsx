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
            Basic Recursion: Print 1 to N
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              Printing numbers from $1$ to $N$ is one of the simplest recursive exercises. It illustrates how we track a loop counter inside function parameters instead of relying on a standard <code>for</code> or <code>while</code> loop.
            </p>
            <p className="mt-4 leading-relaxed font-semibold">
              The recursive function signature is:
            </p>
            <p className="mt-2 font-mono bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-155 dark:border-zinc-800 text-center text-md">
              print1ToN(i, n)
            </p>
            <p className="mt-4 leading-relaxed">
              We invoke the function initially with $i = 1$. In each recursive step, we print $i$ and call `print1ToN(i + 1, n)` to increment our virtual loop counter.
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Base Case:</strong> <code>i &gt; n</code>. Once $i$ exceeds $n$, we return to prevent infinite loops.</li>
              <li><strong>Recursive Step:</strong> Increment $i$ by $1$ and call the function again.</li>
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
              The function makes exactly $N+1$ recursive calls to print numbers from 1 to N.
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
