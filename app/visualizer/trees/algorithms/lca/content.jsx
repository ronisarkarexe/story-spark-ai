"use client";
import ComplexityGraph from "@/app/components/ui/graph";
import { Search, MoveUp, ArrowRight, Lightbulb } from "lucide-react";

const LCAContent = () => {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-lg shadow-purple-500/5">
        
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            What is the Lowest Common Ancestor?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              The Lowest Common Ancestor (LCA) of two nodes <strong>p</strong> and <strong>q</strong> in a tree is the lowest (i.e. deepest) node that has both <strong>p</strong> and <strong>q</strong> as descendants. Note that a node can be a descendant of itself.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] bg-purple-50/30 dark:bg-purple-900/5">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            Visual Example
          </h2>
          <div className="flex justify-center my-6">
            <svg width="400" height="250" viewBox="0 0 400 250" className="drop-shadow-lg">
              <line x1="200" y1="50" x2="100" y2="120" stroke="#475569" strokeWidth="2" />
              <line x1="200" y1="50" x2="300" y2="120" stroke="#475569" strokeWidth="2" />
              <line x1="100" y1="120" x2="50" y2="190" stroke="#a855f7" strokeWidth="3" strokeDasharray="5,5" />
              <line x1="100" y1="120" x2="150" y2="190" stroke="#a855f7" strokeWidth="3" strokeDasharray="5,5" />
              <circle cx="200" cy="50" r="24" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <text x="200" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">3</text>
              
              <circle cx="100" cy="120" r="26" fill="#4c1d95" stroke="#a855f7" strokeWidth="3" className="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <text x="100" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">5 (LCA)</text>
              
              <circle cx="300" cy="120" r="24" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <text x="300" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
              
              <circle cx="50" cy="190" r="24" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
              <text x="50" y="195" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">6 (p)</text>
              
              <circle cx="150" cy="190" r="24" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
              <text x="150" y="195" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">2 (q)</text>
            </svg>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Node 5 is the deepest node that is an ancestor to both 6 and 2.
          </p>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            Algorithm Strategy
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] space-y-4 leading-relaxed">
            <div className="mt-6 grid gap-4">
              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">1. Search Down</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Start at the root and recursively search the left and right subtrees. If you hit a null node, return null. If the current node matches either <strong>p</strong> or <strong>q</strong>, return the current node.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <MoveUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">2. Bubble Up</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      As recursion unwinds, pass the found nodes back up the tree. At any given node, look at what was returned from its left and right children.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">3. Evaluate</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      If both left and right return a non-null node, then the current node is the LCA! Otherwise, return whichever child is non-null.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            Complexity Analysis
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 shadow-sm">
                <span className="font-semibold text-purple-800 dark:text-purple-300">Time:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">O(N)</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 shadow-sm">
                <span className="font-semibold text-purple-800 dark:text-purple-300">Space:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">O(H)</span>
              </div>
            </div>
            <p className="text-sm mb-6">Where N is the number of nodes, and H is the height of the tree (recursion stack).</p>
            <div className="mt-4 bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-inner">
              <ComplexityGraph
                bestCase={(n) => n}
                averageCase={(n) => n}
                worstCase={(n) => n}
                maxN={50}
                title="Time Complexity: O(N)"
              />
            </div>
          </div>
        </section>
        
        <section className="p-6 border-t border-[#f3f4f6] dark:border-[#1e1e1e] bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/20 dark:to-neutral-950">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-purple-100 dark:bg-purple-900/50 p-2.5 rounded-xl shadow-sm text-purple-600 dark:text-purple-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                Key Takeaways
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-purple-800 dark:text-purple-200/80 leading-relaxed">
                <li>LCA naturally relies on a bottom-up (post-order) traversal. You need information from children before deciding if the current node is the LCA.</li>
                <li>If a node is an ancestor of the other (e.g., p is ancestor of q), the algorithm returns p directly without needing to explore its subtree.</li>
              </ul>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default LCAContent;
