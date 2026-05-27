"use client";
import React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Content = () => {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
    };

    updateTheme();
    setMounted(true);

    window.addEventListener("storage", updateTheme);
    window.addEventListener("themeChange", updateTheme);

    return () => {
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("themeChange", updateTheme);
    };
  }, []);

  const paragraph = [
    `A stack implemented using a linked list follows the LIFO (Last In First Out) principle. Unlike array implementation, linked list stacks dynamically allocate memory for each element and don't have size limitations (until memory is exhausted).`,
  ];

  const opeartions = [
    { points : "Initialize Stack",
      subpoints : [
        "Create a head pointer initialized to null.",
        "Optional: Maintain a size counter initialized to 0.",
      ],
     },
    { points : "push()",
      subpoints : [
        "Create a new node with the given data.",
        "Set new node's next pointer to current head.",
        "Update head to point to the new node.",
        "Increment size counter (if maintained).",
      ],
     },
    { points : "pop()",
      subpoints : [
        "Check if stack is empty (head is null).",
        `If empty, return "Stack Underflow".`,
        "Store current head node in a temporary variabl.",
        "Update head to point to the next node.",
        "Decrement size counter (if maintained).",
        "Return data from the temporary node.",
      ],
     },
  ];

  const helper = [
    { points : "peek()",
      subpoints : [
        "Check if stack is empty (head is null).",
        "If empty, return null.",
        "Return data from head node without removal.",
      ],
     },
    { points : "isEmpty()",
      subpoints : [
        "Return true if head is null.",
        "Return false otherwise.",
      ],
     },
    { points : "size()",
      subpoints : [
        "If size counter is maintained, return its value.",
        "Otherwise, traverse the list and count nodes.",
      ],
     },
  ];

    return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-neutral-950 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Header Section */}
        <section className="p-8 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-[#a435f0] mr-4 rounded-full"></span>
            Stack Implementation Using Linked List
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              {paragraph[0]}
            </p>
          </div>
        </section>

        {/* Algorithmic Steps */}
        <section className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <span className="w-1.5 h-6 bg-[#a435f0] mr-4 rounded-full"></span>
            Algorithmic Steps
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Core Operations */}
            <div className="rounded-xl p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl mb-6 font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Core Operations</h3>
              <div className="space-y-6">
                {opeartions.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <h4 className="font-bold text-[#a435f0] mb-3 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-[#a435f0]"></span>
                       {item.points}
                    </h4>
                    {item.subpoints && (
                      <ul className="space-y-2 ml-4">
                        {item.subpoints.map((subitem, subindex) => (
                          <li key={subindex} className="text-gray-600 dark:text-gray-400 text-sm flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600 flex-shrink-0"></span>
                            {subitem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Utility Operations */}
            <div className="rounded-xl p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl mb-6 font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Utility Functions</h3>
              <div className="space-y-6">
                {helper.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <h4 className="font-bold text-[#a435f0] mb-3 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-[#a435f0]"></span>
                       {item.points}
                    </h4>
                    {item.subpoints && (
                      <ul className="space-y-2 ml-4">
                        {item.subpoints.map((subitem, subindex) => (
                          <li key={subindex} className="text-gray-600 dark:text-gray-400 text-sm flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600 flex-shrink-0"></span>
                            {subitem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Complexity Analysis */}
        <section className="p-8 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-[#a435f0] mr-4 rounded-full"></span>
            Efficiency Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Time Complexity</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Push/Pop/Peek:</span>
                  <code className="text-[#a435f0] font-bold">O(1)</code>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Search:</span>
                  <code className="text-[#a435f0] font-bold">O(n)</code>
                </li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Space Complexity</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Overall Space:</span>
                  <code className="text-[#a435f0] font-bold">O(n)</code>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Memory overhead:</span>
                  <p className="text-xs text-right text-gray-500">(1 pointer per node)</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Characteristics */}
        <section className="p-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <span className="w-1.5 h-6 bg-[#a435f0] mr-4 rounded-full"></span>
            Key Characteristics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Dynamic Size: No fixed capacity (grows as needed)",
              "Memory Efficiency: Uses only needed memory",
              "No Wasted Space: Unlike array implementation",
              "Extra Memory: Requires space for pointers",
              "Flexibility: Can grow until memory exhausted",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="w-2 h-2 rounded-full bg-[#a435f0]"></div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Section */}
        <section className="p-8 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-[#a435f0] mr-4 rounded-full"></span>
            Implementation Comparison
          </h2>
          <div className="prose dark:prose-invert max-w-none overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 p-4 text-left font-semibold">Feature</th>
                  <th className="border border-gray-200 dark:border-gray-700 p-4 text-left font-semibold">Linked List</th>
                  <th className="border border-gray-200 dark:border-gray-700 p-4 text-left font-semibold">Array</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Memory Usage", "Extra for pointers", "Fixed size, may be wasted"],
                  ["Dynamic Size", "Yes", "No (unless resized)"],
                  ["Memory Allocation", "Dynamic", "Static (usually)"],
                  ["Access Time", "O(1) for top", "O(1) for all"],
                  ["Complexity", "Slightly higher", "Very Simple"],
                ].map(([feature, ll, arr], index) => (
                  <tr key={feature} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">{feature}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{ll}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{arr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
