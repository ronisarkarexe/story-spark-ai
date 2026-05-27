"use client";
import ComplexityGraph from "@/app/components/ui/graph";

const FenwickContent = () => {
  return (
    <main className="max-w-7xl mx-auto mt-8">
      <article className="max-w-4xl mx-auto bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is a Fenwick Tree (Binary Indexed Tree)?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              A **Fenwick Tree** (also known as a **Binary Indexed Tree** or **BIT**) is a highly efficient tree-like data structure represented implicitly inside a flat 1D array. It is primarily used to perform dynamic prefix sum queries and point updates in logarithmic time.
            </p>
            <p>
              Compared to a Segment Tree, a Fenwick Tree requires far less memory space ($N$ elements instead of $4N$) and is significantly easier to implement using smart bitwise arithmetic.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Bit Manipulation & The LSB
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              The core mechanism of a Fenwick Tree revolves around index manipulation using the **Least Significant Bit (LSB)** of index binary representations:
            </p>
            <div className="bg-gray-50 dark:bg-[#1b1b1b] p-4 rounded-xl border border-gray-200 dark:border-gray-800 font-mono text-sm">
              LSB(i) = i & (-i)
            </div>
              <ul className="space-y-3 list-disc pl-5 marker:text-gray-500">
              <li><strong>Update key step:</strong> To propagate a point update at index i, we repeatedly add its LSB (i ← i + LSB(i)) to correct dependent node values up the array bounds.</li>
              <li><strong>Query prefix sum step:</strong> To query the sum from index 1 to i, we repeatedly subtract its LSB (i ← i - LSB(i)) to merge segment ranges backwards.</li>
            </ul>
          </div>
        </section>

        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Performance and Space
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <ul className="space-y-2 font-mono text-sm bg-gray-50 dark:bg-[#1b1b1b] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <li>Prefix Sum Query Time: O(log N)</li>
              <li>Point Update Time: O(log N)</li>
              <li>Space Complexity: O(N) - exact space match!</li>
            </ul>
            <div className="mt-8">
              <ComplexityGraph
                bestCase={(n) => Math.log2(n)}
                averageCase={(n) => Math.log2(n)}
                worstCase={(n) => Math.log2(n)}
                maxN={50}
              />
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default FenwickContent;
