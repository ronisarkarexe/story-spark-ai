"use client";
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
    `Implementing a Queue using a linked list provides dynamic memory allocation and efficient insertion/removal operations. Unlike array implementation, linked list queues don't have fixed capacity limitations and can grow dynamically as needed.`,
    `Each node in the linked list contains the data and a pointer to the next node. The front pointer points to the first node (for dequeue), while the rear pointer points to the last node (for enqueue).`,
    `Linked list queues are particularly useful when the maximum size isn't known in advance or when frequent insertions/deletions are required.`,
  ];

  const implementationSteps = [
    { points: "Define a Node class with data and next pointer attributes" },
    { points: "Create Queue class with front and rear pointers initialized to null" },
    { points: "Implement enqueue by adding nodes at the rear" },
    { points: "Implement dequeue by removing nodes from the front" },
    { points: "Maintain proper pointer connections during operations" },
  ];

  const enqueueAlgorithm = [
    { points: "Create a new node with the given data" },
    { points: "If queue is empty, set both front and rear to the new node" },
    { points: "Else, set rear.next to the new node and update rear pointer" },
    { points: "Increment the size counter" },
  ];

  const dequeueAlgorithm = [
    { points: "Check if queue is empty (front === null)" },
    { points: "Store the front node to return later" },
    { points: "Move front pointer to front.next" },
    { points: "If front becomes null (queue is now empty), set rear to null" },
    { points: "Decrement the size counter" },
    { points: "Return the stored node's data" },
  ];

  const complexity = [
    { points: "Enqueue Operation: O(1) - Constant time to add at tail" },
    { points: "Dequeue Operation: O(1) - Constant time to remove from head" },
    { points: "Peek Operation: O(1) - Direct access via front pointer" },
    { points: "Space Usage: O(n) - Linear space for storing elements plus pointer overhead" },
  ];

  const prosCons = [
    { points: "Pros: No fixed size limitation - grows dynamically" },
    { points: "Pros: Efficient O(1) operations for both enqueue and dequeue" },
    { points: "Pros: No wasted memory (only allocates what's needed)" },
    { points: "Cons: Extra memory for node pointers (next references)" },
    { points: "Cons: Not cache-friendly (nodes may be scattered in memory)" },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        {/* Queue Linked List Implementation Overview */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Queue Implementation Using Linked List
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraph[0]}
            </p>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Implementation Steps
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {implementationSteps.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Enqueue Algorithm */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Enqueue Algorithm
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {enqueueAlgorithm.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Dequeue Algorithm */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Dequeue Algorithm
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {dequeueAlgorithm.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Time Complexity */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time & Space Complexity
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {complexity.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm font-mono">
                    {item.points.split(':')[0]}:
                  </span>
                  <span className="ml-2">{item.points.split(':')[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pros and Cons */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Pros and Cons
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {prosCons.map((item, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Additional Info */}
        <section className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="px-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">When to Use Linked List Queue</h3>
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                {paragraph[2]}
              </p>
              <ul className="mt-2 space-y-1 list-disc pl-5 marker:text-blue-500 dark:marker:text-blue-400">
                <li className="text-[#374151] dark:text-[#d1d5db]">When the maximum queue size is unpredictable</li>
                <li className="text-[#374151] dark:text-[#d1d5db]">When memory efficiency is more important than cache performance</li>
                <li className="text-[#374151] dark:text-[#d1d5db]">In applications with frequent dynamic memory allocation/deallocation</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
</main>
  );
};

export default Content;
