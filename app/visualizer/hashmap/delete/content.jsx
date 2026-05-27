"use client";
import ComplexityGraph from "@/app/components/ui/graph";

const Content = () => {
  const paragraphs = [
    `HashMap Delete operation removes a key-value pair from the hash table. It uses the hash function to locate the bucket index, then searches the bucket for the key and removes it.`,
    `Delete is a fundamental HashMap operation with O(1) average time complexity, making it highly efficient for dynamic data management.`,
  ];

  const deleteSteps = [
    { points: 'Call delete("age")' },
    { points: 'Compute hash("age") = 5 → go to index 5' },
    { points: "Search bucket at index 5 for key \"age\"" },
    { points: "Key found → remove from bucket" },
    { points: "If key not found → return null/false" },
  ];

  const complexity = [
    { points: "Time Complexity (Average): O(1)" },
    { points: "Time Complexity (Worst): O(n)" },
    { points: "Space Complexity: O(1)" },
  ];

  const applications = [
    { points: "Removing expired cache entries" },
    { points: "Unregistering event listeners" },
    { points: "Removing user sessions" },
    { points: "Dynamic symbol table management in compilers" },
  ];

  const edgeCases = [
    { title: "Key not found", detail: "Returns null or false without modifying the table" },
    { title: "Collision chain", detail: "Only the matching key is removed, others in chain remain" },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is HashMap Delete?
          </h1>
          <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
            {paragraphs[0]}
          </p>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Delete Operation Steps
          </h1>
          <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {deleteSteps.map((item, index) => (
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

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Edge Cases
          </h1>
          <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {edgeCases.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                <span className="font-semibold">{item.title}:</span> {item.detail}
              </li>
            ))}
          </ul>
        </section>

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