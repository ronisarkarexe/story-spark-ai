"use client";
import ComplexityGraph from "@/app/components/ui/graph";
import { CopySlash, ArrowLeftRight, CheckCircle2, Lightbulb } from "lucide-react";

const IsomorphismContent = () => {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-lg shadow-green-500/5">
        
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-green-500 mr-3 rounded-full"></span>
            What is Tree Isomorphism?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              Two trees are considered <strong>isomorphic</strong> if one tree can be transformed into the other by swapping the left and right children of a number of nodes (including potentially zero swaps). Essentially, they represent the same structure if we ignore the left/right ordering of children.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] bg-green-50/30 dark:bg-green-900/5">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-green-500 mr-3 rounded-full"></span>
            Visual Example
          </h2>
          <div className="flex justify-center my-6 gap-8 items-center">
            {/* Tree 1 */}
            <svg width="250" height="200" viewBox="0 0 250 200" className="drop-shadow-lg">
              <line x1="125" y1="40" x2="60" y2="100" stroke="#475569" strokeWidth="2" />
              <line x1="125" y1="40" x2="190" y2="100" stroke="#475569" strokeWidth="2" />
              <line x1="60" y1="100" x2="30" y2="160" stroke="#475569" strokeWidth="2" />
              <line x1="60" y1="100" x2="90" y2="160" stroke="#475569" strokeWidth="2" />
              
              <circle cx="125" cy="40" r="20" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
              <text x="125" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
              
              <circle cx="60" cy="100" r="20" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
              <text x="60" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">2</text>
              
              <circle cx="190" cy="100" r="20" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <text x="190" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">3</text>
              
              <circle cx="30" cy="160" r="20" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
              <text x="30" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">4</text>

              <circle cx="90" cy="160" r="20" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
              <text x="90" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">5</text>
            </svg>

            <ArrowLeftRight className="w-8 h-8 text-green-500" />

            {/* Tree 2 */}
            <svg width="250" height="200" viewBox="0 0 250 200" className="drop-shadow-lg">
              <line x1="125" y1="40" x2="60" y2="100" stroke="#475569" strokeWidth="2" />
              <line x1="125" y1="40" x2="190" y2="100" stroke="#475569" strokeWidth="2" />
              <line x1="190" y1="100" x2="160" y2="160" stroke="#475569" strokeWidth="2" />
              <line x1="190" y1="100" x2="220" y2="160" stroke="#475569" strokeWidth="2" />
              
              <circle cx="125" cy="40" r="20" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
              <text x="125" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
              
              <circle cx="60" cy="100" r="20" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <text x="60" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">3</text>
              
              <circle cx="190" cy="100" r="20" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
              <text x="190" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">2</text>
              
              <circle cx="160" cy="160" r="20" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
              <text x="160" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">5</text>

              <circle cx="220" cy="160" r="20" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
              <text x="220" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">4</text>
            </svg>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            These trees are isomorphic. If you swap the children of node 1, and then swap the children of node 2, they become identical.
          </p>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-green-500 mr-3 rounded-full"></span>
            Algorithm Strategy
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] space-y-4 leading-relaxed">
            <div className="mt-6 grid gap-4">
              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-green-50/30 dark:from-neutral-900 dark:to-green-950/20 border-green-100 dark:border-green-900/50 hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/60 p-2 rounded-lg text-green-600 dark:text-green-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">1. Value Equality</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      First check if both nodes are null (return true) or if only one is null or values differ (return false).
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-green-50/30 dark:from-neutral-900 dark:to-green-950/20 border-green-100 dark:border-green-900/50 hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/60 p-2 rounded-lg text-green-600 dark:text-green-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <CopySlash className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">2. Check Non-Swapped</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Assume the children were NOT swapped. Recursively verify if `root1.left` is isomorphic to `root2.left`, AND `root1.right` is isomorphic to `root2.right`.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-green-50/30 dark:from-neutral-900 dark:to-green-950/20 border-green-100 dark:border-green-900/50 hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/60 p-2 rounded-lg text-green-600 dark:text-green-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">3. Check Swapped</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Assume the children WERE swapped. Recursively verify if `root1.left` is isomorphic to `root2.right`, AND `root1.right` is isomorphic to `root2.left`. Return true if either the swapped or non-swapped check passes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-green-500 mr-3 rounded-full"></span>
            Complexity Analysis
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
                <span className="font-semibold text-green-800 dark:text-green-300">Time:</span>
                <span className="font-mono text-green-600 dark:text-green-400">O(min(N1, N2))</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
                <span className="font-semibold text-green-800 dark:text-green-300">Space:</span>
                <span className="font-mono text-green-600 dark:text-green-400">O(min(H1, H2))</span>
              </div>
            </div>
            <p className="text-sm mb-6">Where N1/N2 are the number of nodes, and H1/H2 are the heights. In the worst case (e.g. perfect binary trees), time could be O(N^2) if not optimized, but practically bounds are close to O(N) for unbalanced comparisons.</p>
            <div className="mt-4 bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-inner">
              <ComplexityGraph
                bestCase={(n) => n}
                averageCase={(n) => n}
                worstCase={(n) => n * n}
                maxN={50}
                title="Time Complexity: O(min(M, N))"
              />
            </div>
          </div>
        </section>
        
        <section className="p-6 border-t border-[#f3f4f6] dark:border-[#1e1e1e] bg-gradient-to-r from-green-50 to-white dark:from-green-950/20 dark:to-neutral-950">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-green-100 dark:bg-green-900/50 p-2.5 rounded-xl shadow-sm text-green-600 dark:text-green-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">
                Key Takeaways
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-green-800 dark:text-green-200/80 leading-relaxed">
                <li>Isomorphism is a classic example of &quot;try both possibilities&quot; recursion. We branch into two possibilities at every step: swapped and unswapped.</li>
                <li>Because of short-circuit evaluation (`||` and `&&`), the recursion often stops early if structural mismatches are found.</li>
              </ul>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default IsomorphismContent;
