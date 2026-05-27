"use client";
import ComplexityGraph from "@/app/components/ui/graph";

const Content = () => {
  const paragraphs = [
    `HashMap is a data structure that stores key-value pairs using a hash function to compute an index into an array of buckets. It provides average O(1) time complexity for insert, search, and delete operations.`,
    `HashMap is one of the most important data structures in programming, widely used in interview problems and real-world applications for its constant-time average performance.`,
  ];

  const insertSteps = [
    { points: "Start with empty HashMap of size 8" },
    { points: 'Insert ("name", "Alice") → hash("name") = 3 → store at index 3' },
    { points: 'Insert ("age", 25) → hash("age") = 5 → store at index 5' },
    { points: 'Insert ("city", "NY") → hash("city") = 3 → collision! chain at index 3' },
  ];

  const complexity = [
    { points: "Time Complexity (Average): O(1)" },
    { points: "Time Complexity (Worst): O(n)" },
    { points: "Space Complexity: O(n)" },
  ];

  const applications = [
    { points: "Caching and memoization" },
    { points: "Database indexing" },
    { points: "Counting frequency of elements" },
    { points: "Two Sum and similar interview problems" },
    { points: "Symbol tables in compilers" },
  ];

  const collisions = [
    { title: "Chaining", detail: "Each bucket holds a linked list of entries that hash to the same index" },
    { title: "Open Addressing", detail: "Find next empty slot using linear/quadratic probing" },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">

        {/* What is HashMap Insert */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is HashMap Insert?
          </h1>
          <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
            {paragraphs[0]}
          </p>
        </section>

        {/* Insert Operation */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Insert Operation
          </h1>
          <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
            Computes hash of key, finds bucket index, stores key-value pair.
          </p>
          <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {insertSteps.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                {item.points}
              </li>
            ))}
          </ol>
          <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {complexity.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm">
                  {item.points.split(":")[0]}:
                </span>
                <span className="ml-2">{item.points.split(":")[1]}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ComplexityGraph
              bestCase={(n) => 1}
              averageCase={(n) => 1}
              worstCase={(n) => n}
              maxN={25}
            />
          </div>
        </section>

        {/* Collision Handling */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Collision Handling
          </h1>
          <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {collisions.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                <span className="font-semibold">{item.title}:</span> {item.detail}
              </li>
            ))}
          </ul>
        </section>

        {/* Real-world Applications */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Real-world Applications
          </h1>
          <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {applications.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                {item.points}
              </li>
            ))}
          </ul>
        </section>

        {/* Additional Info */}
        <section className="p-6">
          <div className="px-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[1]}
            </p>
          </div>
        </section>

      </article>
    </main>
  );
};

export default Content;