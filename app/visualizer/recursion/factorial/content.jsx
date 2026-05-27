"use client";
import React from "react";

const Content = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        {/* What is Factorial */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            What is Factorial?
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              The factorial of a non-negative integer $N$ (denoted as $N!$) is the product of all positive integers less than or equal to $N$.
            </p>
            <p className="mt-2 font-mono bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-150 dark:border-zinc-800 text-center text-lg">
              N! = N * (N - 1) * (N - 2) * ... * 1
            </p>
            <p className="mt-4 leading-relaxed">
              Factorial naturally lends itself to recursion because it can be defined in terms of a smaller sub-problem:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Base Case:</strong> $1! = 1$ and $0! = 1$. The recursion stops here.</li>
              <li><strong>Recursive Case:</strong> $N! = N \times (N-1)!$. The function calls itself with $N-1$.</li>
            </ul>
          </div>
        </section>

        {/* Step-by-Step Call Trace */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            Trace of fact(3)
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              When we call <code>fact(3)</code>, the execution builds up stack frames and then resolves back down:
            </p>
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400 mt-2">
              <li className="pl-2"><code>fact(3)</code> is called. Since $3 &gt; 1$, it spawns <code>fact(2)</code> and waits.</li>
              <li className="pl-2"><code>fact(2)</code> is called. Since $2 &gt; 1$, it spawns <code>fact(1)</code> and waits.</li>
              <li className="pl-2"><code>fact(1)</code> is called. Since $1 \le 1$, the base case is met. It returns <strong>1</strong>.</li>
              <li className="pl-2"><code>fact(2)</code> receives 1, calculates $2 \times 1 = 2$, and returns <strong>2</strong>.</li>
              <li className="pl-2"><code>fact(3)</code> receives 2, calculates $3 \times 2 = 6$, and returns <strong>6</strong>.</li>
            </ol>
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
              The function calls itself $N$ times, performing a constant amount of work (comparison and multiplication) in each call.
            </p>
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Space Complexity: O(N)</span>
              <br />
              Since it pushes $N$ stack frames onto the Call Stack before popping them during the return phase, it requires $O(N)$ auxiliary stack memory.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
