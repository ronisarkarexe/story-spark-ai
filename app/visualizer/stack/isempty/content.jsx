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
    `The isEmpty operation checks whether a stack contains any elements or not. It's a fundamental operation that helps prevent errors when trying to perform operations like pop() or peek() on an empty stack.`,
    `The isEmpty operation is a simple but crucial part of stack implementation, ensuring safe stack manipulation and preventing runtime errors.`,
  ];

  const usage = [
    { points : "Prevent stack underflow errors before pop() operations." },
    { points : "Check if there are elements to process." },
    { points : "Validate stack state in algorithms." },
    { points : "Terminate processing loops when stack becomes empty." },
  ];

  const working = [
    { points : "For an empty stack [ ],isEmpty() returns true." },
    { points : "For a non-empty stack [5, 3, 8],isEmpty() returns false." },
  ];

  const implementation = [
    { points : "Check the current size/length of the stack" },
    { points : "Return the result :",
      subpoints : [
        "true if size equals 0.",
        "false otherwise.",
      ],
     },
  ];

  const complexity = [
    { points : "O(1) constant time complexity." },
    { points : "The operation only needs to check one value (size/length) regardless of stack size." },
  ];

    return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
          {/* What is the isEmpty Operation in Stack? */}
          <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
            <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              What is the isEmpty Operation in Stack?
            </h1>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                {paragraphs[0]}
              </p>
            </div>
          </section>

          {/* How Does It Work? */}
          <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
            <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              How Does It Work?
            </h1>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
                Consider a stack represented as an array: [ ] (empty) or [5, 3,
                8] (with elements).
              </p>

              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {working.map((item, index) => (
                  <li
                    key={index}
                    className="text-[#374151] dark:text-[#d1d5db] pl-2"
                  >
                    {item.points}
                  </li>
                ))}
              </ol>

              <p className="text-[#374151] dark:text-[#d1d5db] mt-4 leading-relaxed">
                The operation simply checks if the stack&apos;s size/length is zero.
              </p>
            </div>
          </section>

          {/* Algorithm Implementation */}
          <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
            <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              Algorithm Implementation
            </h1>
            <div className="prose dark:prose-invert max-w-none">
              <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {implementation.map((item, index) => (
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
          <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
            <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
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
                averageCase={(n) => 1}
                worstCase={(n) => 1}
                maxN={25}
              />
            </div>
            </div>
          </section>

          {/* Practical Usage */}
          <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
            <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              Practical Usage
            </h1>
            <div className="prose dark:prose-invert max-w-none">
              <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {usage.map((item, index) => (
                  <li
                    key={index}
                    className="text-[#374151] dark:text-[#d1d5db] pl-2"
                  >
                    {item.points}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Additional Info */}
          <section className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              <div className="px-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
                <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                  {paragraphs[1]}
                </p>
              </div>
            </div>
          </section>
        </article>
</main>
    );
  };
  
  export default Content;
