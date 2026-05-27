"use client";
import ComplexityGraph from "@/app/components/ui/graph";

const TrieContent = () => {
  const paragraphs = [
    `A Trie (pronounced "try"), also known as a prefix tree, is an advanced tree-like data structure used to store a dynamic set of strings, where keys are usually strings. Unlike a standard binary search tree, no node in the tree stores the key associated with that node. Instead, its position in the tree defines the key with which it is associated.`,
    `Tries are highly optimized for fast retrieval. They allow strings to be inserted and searched in O(L) time, where L is the length of the string. This makes them significantly faster than balanced binary trees or hash tables for prefix matching, auto-complete features, and dictionary lookups.`,
    `Each node in a Trie contains a map or array of children pointers (up to 26 for English lowercase letters) and a boolean flag "isEndOfWord" to mark if a complete word terminates at that node.`,
    `If a search reaches the end of the query string and the current node has "isEndOfWord" set to true, the word exists in the Trie. If the flag is false, the string exists only as a prefix to other words.`
  ];

  const insertSteps = [
    { points: "Start at the root node." },
    { points: "For each character in the word, check if a child pointer exists for that character." },
    { points: "If the child node does not exist, create a new node and link it under the parent." },
    { points: "Move the current pointer to the child node and repeat for the next character." },
    { points: "Once the last character is processed, set the 'isEndOfWord' flag of that node to true." }
  ];

  const searchSteps = [
    { points: "Start at the root node." },
    { points: "For each character in the query word, check if a child node exists for that character." },
    { points: "If any character child is missing, the word does not exist in the Trie (return false)." },
    { points: "If all characters match, check the 'isEndOfWord' flag on the final node. Return true if true, otherwise false." }
  ];

  const prefixSteps = [
    { points: "Start at the root node." },
    { points: "Iterate through each character of the prefix, following child links." },
    { points: "If at any point a character link is missing, the prefix does not exist (return false)." },
    { points: "If all characters in the prefix are traversed successfully, return true." }
  ];

  const complexity = [
    { data: "Insertion Time Complexity: O(L) - where L is the length of the word." },
    { data: "Search Time Complexity: O(L) - where L is the length of the query string." },
    { data: "Space Complexity: O(AL * N) - where AL is alphabet size, L is avg length, and N is number of words." }
  ];

  return (
    <main className="max-w-7xl mx-auto mt-8">
      <article className="max-w-4xl mx-auto bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        {/* What is a Trie */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is a Trie (Prefix Tree)?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>{paragraphs[0]}</p>
            <p>{paragraphs[1]}</p>
          </div>
        </section>

        {/* Structure and Nodes */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Node Structure
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>{paragraphs[2]}</p>
            <div className="bg-gray-50 dark:bg-[#1b1b1b] p-4 rounded-xl border border-gray-200 dark:border-gray-800 font-mono text-sm">
              <span className="text-purple-600 dark:text-purple-400">struct</span> TrieNode {"{"} <br />
              &nbsp;&nbsp;TrieNode* children[26]; <span className="text-gray-400">{"// Pointers to character children"}</span><br />
              &nbsp;&nbsp;<span className="text-primary dark:text-[#c27cf7]">bool</span> isEndOfWord; <span className="text-gray-400">{"// True if node is the end of a word"}</span><br />
              {"}"};
            </div>
          </div>
        </section>

        {/* Operations */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              Insertion Algorithm
            </h2>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 text-[#374151] dark:text-[#d1d5db]">
              {insertSteps.map((step, idx) => (
                <li key={idx} className="pl-1">{step.points}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              Search Algorithm
            </h2>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 text-[#374151] dark:text-[#d1d5db]">
              {searchSteps.map((step, idx) => (
                <li key={idx} className="pl-1">{step.points}</li>
              ))}
            </ol>
            <p className="text-sm text-gray-500 mt-2 italic">{paragraphs[3]}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              Prefix Matching Algorithm
            </h2>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 text-[#374151] dark:text-[#d1d5db]">
              {prefixSteps.map((step, idx) => (
                <li key={idx} className="pl-1">{step.points}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* Time Complexity */}
        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Performance and Complexity
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {complexity.map((item, index) => (
                <li key={index} className="pl-2">
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm font-semibold text-purple-700 dark:text-purple-300">
                    {item.data.split(":")[0]}:
                  </span>
                  <span className="ml-2">{item.data.split(":")[1]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3">Time Complexity relative to Word Length (L)</h3>
              <ComplexityGraph
                bestCase={(n) => n}
                averageCase={(n) => n}
                worstCase={(n) => n}
                maxN={20}
              />
            </div>

            <div className="mt-6 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Key Advantage:</h4>
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                Tries provide extremely fast string lookups. Unlike Hash Tables, which can suffer from hash collisions and require computing a hash function over the key, a Trie lookup depends only on the length of the string, making its worst-case search performance extremely reliable.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default TrieContent;
