"use client";
import ComplexityGraph from "@/app/components/ui/graph";

const RedBlackContent = () => {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-sm">

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is a Red-Black Tree?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              A Red-Black Tree is a specialized self-balancing binary search tree (BST) where each node
              carries an extra bit representing its color — either Red or Black.
            </p>
            <p>
              These colors are used to keep the tree approximately balanced during insertions and
              deletions, guaranteeing that search, insertion, and deletion all complete in O(log N)
              time, even in the worst case.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Five Red-Black Tree Properties
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed">
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500">
              <li><strong>Node Color:</strong> Every node is either Red or Black.</li>
              <li><strong>Root Property:</strong> The root is always Black.</li>
              <li><strong>Leaf Property:</strong> Every leaf (NULL sentinel) is Black.</li>
              <li>
                <strong>Red Node Property:</strong> If a node is Red, both its children must be
                Black — no two consecutive Red nodes may appear on any root-to-leaf path.
              </li>
              <li>
                <strong>Black Height Property:</strong> For every node, all simple paths from that
                node to its descendant leaves contain the same number of Black nodes.
              </li>
            </ol>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Balancing Operations
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] space-y-4 leading-relaxed">
            <p>
              Every new node is inserted as Red. If this violates the RB properties, two operations
              restore balance:
            </p>
            <ol className="space-y-3 list-decimal pl-5">
              <li>
                <strong>Rotations (Left or Right):</strong> Structural changes that adjust the local
                height without breaking the BST ordering.
              </li>
              <li>
                <strong>Recoloring / Color Flips:</strong> Toggling node colors between Red and Black
                to redistribute Black-height evenly.
              </li>
            </ol>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {[
                { case: "Case 1", desc: "Uncle is RED → Recolor parent, uncle, and grandparent. Move z up.", color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800" },
                { case: "Case 2", desc: "Uncle is BLACK, z is right child → Left-rotate parent. Convert to Case 3.", color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
                { case: "Case 3", desc: "Uncle is BLACK, z is left child → Recolor + Right-rotate grandparent. Done.", color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" },
              ].map(({ case: c, desc, color }) => (
                <div key={c} className={`p-4 rounded-xl border ${color}`}>
                  <p className="font-bold text-sm mb-1 text-[#1a1a1a] dark:text-white">{c}</p>
                  <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Complexity Analysis
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <ul className="space-y-2 font-mono text-sm bg-gray-50 dark:bg-[#1b1b1b] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <li>Insertion Time: O(log N)</li>
              <li>Deletion Time: O(log N)</li>
              <li>Search Time: O(log N)</li>
              <li>Space Complexity: O(N)</li>
            </ul>
            <div className="mt-8">
              <ComplexityGraph
                bestCase={(n) => Math.log2(n + 1)}
                averageCase={(n) => Math.log2(n + 1)}
                worstCase={(n) => Math.log2(n + 1) * 2}
                maxN={50}
              />
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default RedBlackContent;
