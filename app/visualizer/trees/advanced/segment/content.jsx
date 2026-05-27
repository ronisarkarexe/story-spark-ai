"use client";
import ComplexityGraph from "@/app/components/ui/graph";

const SegmentContent = () => {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-sm">

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is a Segment Tree?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              A Segment Tree is a binary tree data structure used to store intervals or segments. It
              lets you efficiently answer range aggregate queries (sum, min, max) and apply point or
              range updates on an underlying array.
            </p>
            <p>
              While a prefix-sum array answers range sum queries in O(1), any update costs O(N) to
              recompute. A Segment Tree solves this by supporting both range queries and point updates
              in O(log N) time.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Segment Tree Structure
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500">
              <li><strong>Leaf Nodes:</strong> Store individual elements of the base array.</li>
              <li>
                <strong>Internal Nodes:</strong> Store the merged aggregate of their left and right
                children.
              </li>
              <li>
                <strong>Tree Size:</strong> For an array of size N, the Segment Tree needs an array
                of size 4N to accommodate all leaves and padding branches.
              </li>
            </ul>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Three Core Operations
          </h2>
          <div className="grid sm:grid-cols-3 gap-3 text-[#374151] dark:text-[#d1d5db]">
            {[
              { op: "Build", cost: "O(N)", desc: "Recursively construct the tree by merging leaves up to the root." },
              { op: "Range Query", cost: "O(log N)", desc: "Traverse overlapping segments, accumulating the result at each matching node." },
              { op: "Point Update", cost: "O(log N)", desc: "Walk from the root to the target leaf, recomputing ancestor nodes on the way back." },
            ].map(({ op, cost, desc }) => (
              <div key={op} className="p-4 rounded-xl bg-gray-50 dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800">
                <p className="font-bold text-[#1a1a1a] dark:text-white">{op}</p>
                <p className="text-xs font-mono text-purple-600 dark:text-purple-400 mb-1">{cost}</p>
                <p className="text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Performance Complexity
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <ul className="space-y-2 font-mono text-sm bg-gray-50 dark:bg-[#1b1b1b] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <li>Tree Construction: O(N)</li>
              <li>Range Query Time: O(log N)</li>
              <li>Point Update Time: O(log N)</li>
              <li>Space Complexity: O(N)</li>
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

export default SegmentContent;
