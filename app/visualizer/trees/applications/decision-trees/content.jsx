"use client";
import { GitBranch, GitMerge, FileQuestion, Lightbulb } from "lucide-react";

const DecisionTreesContent = () => {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-lg shadow-purple-500/5">
        
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            What are Decision Trees?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              A Decision Tree is a supervised machine learning algorithm that is used for both classification and regression tasks. It builds a flowchart-like tree structure where each internal node represents a &quot;test&quot; on an attribute (e.g., whether a coin flip comes up heads or tails), each branch represents the outcome of the test, and each leaf node represents a class label or continuous value.
            </p>
            <p>
              It is a highly interpretable model, meaning it is easy to understand exactly how the model arrived at a particular decision.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] bg-purple-50/30 dark:bg-purple-900/5">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            Visual Example
          </h2>
          <div className="flex justify-center my-6">
            <svg width="500" height="280" viewBox="0 0 500 280" className="drop-shadow-lg">
              <line x1="250" y1="50" x2="150" y2="130" stroke="#475569" strokeWidth="2" />
              <line x1="250" y1="50" x2="350" y2="130" stroke="#475569" strokeWidth="2" />
              <line x1="350" y1="130" x2="280" y2="210" stroke="#475569" strokeWidth="2" />
              <line x1="350" y1="130" x2="420" y2="210" stroke="#475569" strokeWidth="2" />

              <text x="180" y="80" fill="#a855f7" fontSize="14" fontWeight="bold">Yes</text>
              <text x="310" y="80" fill="#a855f7" fontSize="14" fontWeight="bold">No</text>
              <text x="300" y="160" fill="#a855f7" fontSize="14" fontWeight="bold">&lt; 30</text>
              <text x="390" y="160" fill="#a855f7" fontSize="14" fontWeight="bold">&gt;= 30</text>

              <rect x="170" y="30" width="160" height="40" rx="20" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
              <text x="250" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Is it raining?</text>
              
              <rect x="70" y="110" width="160" height="40" rx="8" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
              <text x="150" y="135" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Stay Indoors</text>
              
              <rect x="270" y="110" width="160" height="40" rx="20" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
              <text x="350" y="135" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Temperature?</text>

              <rect x="200" y="190" width="160" height="40" rx="8" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
              <text x="280" y="215" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Play Tennis</text>
              
              <rect x="370" y="190" width="100" height="40" rx="8" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
              <text x="420" y="215" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Go Swimming</text>
            </svg>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            A simple decision tree to decide an activity based on the weather conditions.
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
                    <FileQuestion className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">1. Select the Best Attribute</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Evaluate all features to find the one that best splits the data. This is typically done using metrics like Gini Impurity, Information Gain, or Variance Reduction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">2. Split the Dataset</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Divide the dataset into subsets based on the selected attribute. Create a child node for each possible outcome of the condition.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <GitMerge className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">3. Repeat Recursively</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Repeat the process for each subset. Stop when the subset is pure (all examples belong to the same class) or a stopping criterion (like max depth) is reached.
                    </p>
                  </div>
                </div>
              </div>
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
                <li>Decision Trees are prone to <strong>overfitting</strong> if they are allowed to grow too deep.</li>
                <li>Pruning is a technique used to remove sections of the tree that provide little power to classify instances, thus reducing overfitting.</li>
                <li>They handle both numerical and categorical data naturally.</li>
              </ul>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default DecisionTreesContent;
