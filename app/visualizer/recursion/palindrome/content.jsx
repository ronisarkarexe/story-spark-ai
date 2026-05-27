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
            Recursion on Strings: Palindrome Check
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              A string is a palindrome if it reads the same backward as forward (e.g., &quot;radar&quot;, &quot;level&quot;, &quot;madam&quot;).
            </p>
            <p className="mt-4 leading-relaxed font-semibold">
              To check this recursively, we compare characters from the outside inwards:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Index Mapping:</strong> At index $i$, the corresponding symmetrically opposite character is located at <code>len - 1 - i</code>.</li>
              <li><strong>Base Case:</strong> <code>i &gt;= len / 2</code>. When pointer $i$ reaches or crosses the middle of the string, it means all outer pairs matched. We return <code>true</code>.</li>
              <li><strong>Mismatch check:</strong> If <code>str[i] !== str[len - 1 - i]</code>, the string cannot be a palindrome. We return <code>false</code> immediately.</li>
              <li><strong>Recursive Step:</strong> If the characters match, call <code>isPalindrome(i + 1, str)</code>.</li>
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
              In the worst case (palindrome string), the function compares $N/2$ pairs of characters, executing in $O(N)$ linear time.
            </p>
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Space Complexity: O(N)</span>
              <br />
              The call stack size reaches a maximum height of $N/2$ stack frames. Thus, the auxiliary space complexity is linear, $O(N)$.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
