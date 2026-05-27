"use client";
import React from "react";

const Content = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        {/* What is N-Queens */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            What is the N-Queens Problem?
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              The <strong>N-Queens puzzle</strong> is the problem of placing $N$ chess queens on an $N \times N$ chessboard so that no two queens threaten each other. 
              According to chess rules, a queen can attack another piece if it shares the same row, column, or diagonal.
            </p>
            <p className="mt-4 leading-relaxed">
              Therefore, a valid solution requires that:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li>No two queens share the same <strong>row</strong>.</li>
              <li>No two queens share the same <strong>column</strong>.</li>
              <li>No two queens share the same <strong>diagonal</strong> (both major and minor diagonals).</li>
            </ul>
          </div>
        </section>

        {/* Backtracking Strategy */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            The Backtracking Strategy
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              Backtracking is a systematic way to search for solutions by trying to build a solution incrementally, one step at a time, and removing choices (backtracking) that fail to satisfy the constraints.
            </p>
            <p className="mt-4 leading-relaxed">
              For N-Queens, we place queens column by column:
            </p>
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400 mt-2">
              <li className="pl-2">Start in the leftmost column (column 0).</li>
              <li className="pl-2">For the current column, try placing a queen in row 0, 1, ..., $N-1$ and check if the position is safe.</li>
              <li className="pl-2">If placing a queen in row $R$ is <strong>safe</strong>, record the choice and recursively move to the next column.</li>
              <li className="pl-2">If we successfully place a queen in the last column ($N-1$), a solution is found!</li>
              <li className="pl-2">If we find that <strong>no row</strong> in the current column is safe, we backtrack: return to the previous column, remove the queen placed there, and resume trying the next row candidates.</li>
            </ol>
          </div>
        </section>

        {/* Safety Checks */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            Checking If a Position is Safe
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              Since we place queens column-by-column (from left to right), we only need to check for attacks on the left side of the current position:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Horizontal row:</strong> Check if any queen is already in the same row to the left.</li>
              <li><strong>Upper-left diagonal:</strong> Check if any queen is in the diagonal going up and left.</li>
              <li><strong>Lower-left diagonal:</strong> Check if any queen is in the diagonal going down and left.</li>
            </ul>
            <p className="mt-4 leading-relaxed font-semibold">
              Note: We do not need to check columns to the right, because we haven&apos;t placed any queens there yet.
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
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Time Complexity: O(N!)</span>
              <br />
              There are $N$ choices for placing the first queen, at most $N-2$ choices for the second, $N-4$ for the third, and so on. In the worst case, the backtracking search tree generates $O(N!)$ states.
            </p>
            <p>
              <span className="font-mono font-bold bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded border dark:border-zinc-800 text-sm">Space Complexity: O(N)</span>
              <br />
              The auxiliary space required consists of the recursion stack ($O(N)$ depth) and the board array ($O(N)$ size to record the row positions of the queens).
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
