"use client";
import ComplexityGraph from "@/app/components/ui/graph";
import { FileDown, FileUp, Braces, Lightbulb } from "lucide-react";

const SerializationContent = () => {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-lg shadow-orange-500/5">
        
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-orange-500 mr-3 rounded-full"></span>
            What is Tree Serialization?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              <strong>Serialization</strong> is the process of converting a data structure or object (like a binary tree) into a sequence of bits or a string so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. 
              <strong>Deserialization</strong> is the reverse process of taking that string and rebuilding the original tree structure in memory.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] bg-orange-50/30 dark:bg-orange-900/5">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-orange-500 mr-3 rounded-full"></span>
            Visual Example
          </h2>
          <div className="flex flex-col md:flex-row justify-center my-6 gap-8 items-center">
            {/* Tree */}
            <svg width="250" height="200" viewBox="0 0 250 200" className="drop-shadow-lg">
              <line x1="125" y1="40" x2="60" y2="100" stroke="#475569" strokeWidth="2" />
              <line x1="125" y1="40" x2="190" y2="100" stroke="#475569" strokeWidth="2" />
              <line x1="190" y1="100" x2="160" y2="160" stroke="#475569" strokeWidth="2" />
              <line x1="190" y1="100" x2="220" y2="160" stroke="#475569" strokeWidth="2" />
              
              <circle cx="125" cy="40" r="20" fill="#0f172a" stroke="#f97316" strokeWidth="2" />
              <text x="125" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
              
              <circle cx="60" cy="100" r="20" fill="#0f172a" stroke="#f97316" strokeWidth="2" />
              <text x="60" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">2</text>
              
              <circle cx="190" cy="100" r="20" fill="#0f172a" stroke="#f97316" strokeWidth="2" />
              <text x="190" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">3</text>
              
              <circle cx="160" cy="160" r="20" fill="#0f172a" stroke="#f97316" strokeWidth="2" />
              <text x="160" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">4</text>

              <circle cx="220" cy="160" r="20" fill="#0f172a" stroke="#f97316" strokeWidth="2" />
              <text x="220" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">5</text>
            </svg>

            <div className="flex flex-col items-center gap-2">
              <FileDown className="w-8 h-8 text-orange-500" />
              <FileUp className="w-8 h-8 text-orange-500" />
            </div>

            {/* String Representation */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-orange-300 drop-shadow-xl text-center">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-sans">Pre-order String</div>
              &quot;1,2,N,N,3,4,N,N,5,N,N&quot;
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Using Pre-order traversal, the tree is flattened. &apos;N&apos; is used to explicitly mark null pointers to preserve the exact structure.
          </p>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-orange-500 mr-3 rounded-full"></span>
            Algorithm Strategy
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] space-y-4 leading-relaxed">
            <div className="mt-6 grid gap-4">
              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-orange-50/30 dark:from-neutral-900 dark:to-orange-950/20 border-orange-100 dark:border-orange-900/50 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/60 p-2 rounded-lg text-orange-600 dark:text-orange-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">1. Serialize (DFS Pre-order)</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Traverse the tree using Depth-First Search (DFS) in Pre-order (Root, Left, Right). Append the current node&apos;s value to a list. If a node is null, append a special marker like &quot;N&quot;.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-orange-50/30 dark:from-neutral-900 dark:to-orange-950/20 border-orange-100 dark:border-orange-900/50 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/60 p-2 rounded-lg text-orange-600 dark:text-orange-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <Braces className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">2. Format Output</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Join the list of strings using a delimiter like a comma &quot;,&quot;. This creates a single continuous string representation of the tree.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-orange-50/30 dark:from-neutral-900 dark:to-orange-950/20 border-orange-100 dark:border-orange-900/50 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/60 p-2 rounded-lg text-orange-600 dark:text-orange-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">3. Deserialize</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Split the string by commas into a queue or array. Use DFS again, reading values one by one in the exact same Pre-order sequence. If you encounter &quot;N&quot;, return null. Otherwise, construct a new node, recursively attach its left and right children, and return it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-orange-500 mr-3 rounded-full"></span>
            Complexity Analysis
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-800 shadow-sm">
                <span className="font-semibold text-orange-800 dark:text-orange-300">Time:</span>
                <span className="font-mono text-orange-600 dark:text-orange-400">O(N)</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-800 shadow-sm">
                <span className="font-semibold text-orange-800 dark:text-orange-300">Space:</span>
                <span className="font-mono text-orange-600 dark:text-orange-400">O(N)</span>
              </div>
            </div>
            <p className="text-sm mb-6">Where N is the number of nodes. We visit every node exactly once during both serialization and deserialization. The resulting string and the array used to process it will take O(N) space.</p>
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
        
        <section className="p-6 border-t border-[#f3f4f6] dark:border-[#1e1e1e] bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-neutral-950">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-orange-100 dark:bg-orange-900/50 p-2.5 rounded-xl shadow-sm text-orange-600 dark:text-orange-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-orange-900 dark:text-orange-300 mb-2">
                Key Takeaways
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-orange-800 dark:text-orange-200/80 leading-relaxed">
                <li>Pre-order traversal is excellent for this because the root node is always processed first, which perfectly matches how you need to read the data to rebuild the tree top-down.</li>
                <li>Explicitly marking null pointers is crucial. Without them, you lose the structural information needed to know when to stop attaching children.</li>
              </ul>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default SerializationContent;
