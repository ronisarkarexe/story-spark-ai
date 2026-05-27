"use client";
import ComplexityGraph from "@/app/components/ui/graph";
import { Combine, ArrowDownUp, Minimize2, Lightbulb } from "lucide-react";

const HuffmanContent = () => {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-lg shadow-purple-500/5">
        
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            What is Huffman Coding?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              Huffman Coding is a lossless data compression algorithm. The idea is to assign variable-length codes to input characters, with lengths based on the frequencies of corresponding characters.
            </p>
            <p>
              The most frequent character gets the smallest code and the least frequent character gets the largest code. This variable-length coding is created using a <strong>Huffman Tree</strong>, which is built using a greedy approach.
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
              <line x1="100" y1="120" x2="50" y2="190" stroke="#475569" strokeWidth="2" />
              <line x1="100" y1="120" x2="150" y2="190" stroke="#475569" strokeWidth="2" />

              <text x="140" y="80" fill="#a855f7" fontSize="14" fontWeight="bold">0</text>
              <text x="260" y="80" fill="#a855f7" fontSize="14" fontWeight="bold">1</text>
              <text x="65" y="150" fill="#a855f7" fontSize="14" fontWeight="bold">0</text>
              <text x="135" y="150" fill="#a855f7" fontSize="14" fontWeight="bold">1</text>

              <circle cx="200" cy="50" r="24" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <text x="200" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">100</text>
              
              <circle cx="100" cy="120" r="24" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <text x="100" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">45</text>
              
              <circle cx="300" cy="120" r="24" fill="#4c1d95" stroke="#a855f7" strokeWidth="3" />
              <text x="300" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">55 (A)</text>
              
              <circle cx="50" cy="190" r="24" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
              <text x="50" y="195" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">20 (B)</text>
              
              <circle cx="150" cy="190" r="24" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
              <text x="150" y="195" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">25 (C)</text>
            </svg>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            A: 1, B: 00, C: 01. The most frequent character &apos;A&apos; has the shortest code.
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
                    <ArrowDownUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">1. Calculate Frequencies</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Count how often each character appears in the data. Create a leaf node for each character and build a min-heap of all leaf nodes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <Combine className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">2. Build Tree</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Extract two nodes with the minimum frequency from the min-heap. Create a new internal node with a frequency equal to the sum of the two nodes&apos; frequencies. Insert this new node back into the min-heap. Repeat until one node remains.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <Minimize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">3. Generate Codes</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Traverse the constructed tree from root to leaves. Assign &apos;0&apos; for a left branch and &apos;1&apos; for a right branch. The sequence of bits from root to a leaf node is the code for that character.
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
                <span className="font-mono text-purple-600 dark:text-purple-400">O(N log N)</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 shadow-sm">
                <span className="font-semibold text-purple-800 dark:text-purple-300">Space:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">O(N)</span>
              </div>
            </div>
            <p className="text-sm mb-6">Where N is the number of unique characters. Extracting minimum from the priority queue takes O(log N) and it is done 2*(N-1) times.</p>
            <div className="mt-4 bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-inner">
              <ComplexityGraph
                bestCase={(n) => n * Math.log2(n)}
                averageCase={(n) => n * Math.log2(n)}
                worstCase={(n) => n * Math.log2(n)}
                maxN={50}
                title="Time Complexity: O(N log N)"
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
                <li>Huffman Coding generates <strong>prefix codes</strong>, meaning no code is a prefix of another code. This ensures unambiguous decoding.</li>
                <li>It is optimally efficient for character-by-character coding when character frequencies are known.</li>
              </ul>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default HuffmanContent;
