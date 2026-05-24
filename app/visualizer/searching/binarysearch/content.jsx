"use client";
import ComplexityGraph from "@/app/components/ui/graph";
import { useEffect, useState } from "react";

const Content = () => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
    };

    updateTheme();
    setMounted(true);

    window.addEventListener('storage', updateTheme);
    window.addEventListener('themeChange', updateTheme);

    return () => {
      window.removeEventListener('storage', updateTheme);
      window.removeEventListener('themeChange', updateTheme);
    };
  }, []);

  const paragraphs = [
    `Binary Search is an efficient algorithm for finding an item in a sorted list. It works by repeatedly dividing the search interval in half. If the target value is less than the middle element, the search continues in the lower half. Otherwise, it continues in the upper half. This process repeats until the value is found.`,
    `If the number is not in the list (e.g., searching for 8), the search ends when the subarray becomes empty.`,
    `Binary Search is extremely fast for large datasets but requires the list to be sorted beforehand. It's much more efficient than Linear Search for sorted data.`,
  ];

  const searching = [
    { points: "First middle is 7 (too high)" },
    { points: "Search left half: [1, 3, 5]" },
    { points: "New middle is 3 (too low)" },
    { points: "Search right portion: [5]" },
    { points: "Found at position 2" },
  ];

  const steps = [
    { points: "Start with the entire sorted array" },
    {
      points: "Compare the target with the middle element:",
      subpoints: [
        "If equal, return the position",
        "If target is smaller, search the left half",
        "If target is larger, search the right half",
      ],
    },
    { points: "Repeat until the element is found or the subarray is empty" },
    { points: 'If not found, return "Not Found"' },
  ];

  const complexity = [
    { points: "Best Case: Target is the middle element → O(1)." },
    {
      points:
        "Worst Case: Element not present → O(log n) (halves search space each step).",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto">

      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        {/* What is Binary Search */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Binary Search?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[0]}
            </p>
          </div>
        </section>

        {/* How Does It Work */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            How Does It Work?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Imagine you have a sorted list of numbers: [1, 3, 5, 7, 9, 11, 13]
              and you want to find the number 7.
            </p>

            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li className="text-[#374151] dark:text-[#d1d5db] pl-2">
                Compare 7 with the middle element (7). It matches! Return the
                position.
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db] pl-2">
                If searching for 5:
                <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                  {searching.map((item, index) => (
                    <li
                      key={index}
                      className="text-[#6b7280] dark:text-[#9ca3af]"
                    >
                      {item.points}
                    </li>
                  ))}
                </ul>
              </li>
            </ol>

            <p className="text-[#374151] dark:text-[#d1d5db] mt-4 leading-relaxed">
              {paragraphs[1]}
            </p>
          </div>
        </section>

        {/* Algorithm Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Algorithm Steps
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {steps.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.points}
                  {item.subpoints && (
                    <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                      {item.subpoints.map((subitem, subindex) => (
                        <li
                          key={subindex}
                          className="text-[#6b7280] dark:text-[#9ca3af]"
                        >
                          {subitem}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Time Complexity */}
        <section className="p-6">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time Complexity
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {complexity.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm font-mono">
                    {item.points.split(":")[0]}:
                  </span>
                  <span className="ml-2">{item.points.split(":")[1]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ComplexityGraph
                bestCase={(n) => 1}
                averageCase={(n) => Math.log2(n)}
                worstCase={(n) => Math.log2(n)}
                maxN={25}
              />
            </div>

            <div className="mt-6 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                {paragraphs[2]}
              </p>
            </div>
          </div>
        </section>
      </article>


    </main>
  );
};

export default Content;
