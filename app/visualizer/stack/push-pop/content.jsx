"use client";
import ComplexityGraph from "@/app/components/ui/graph";
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

  const paragraphs = [
    `Push and Pop are the two fundamental operations in stack data structure. Stack follows LIFO (Last In First Out) principle - the last element added is the first one to be removed.`,
    `Push and Pop operations are fundamental to stack functionality. While simple to implement, stacks are powerful data structures used in many algorithms and system designs.`,
  ];

  const examplePush = [
    { points: "Start with empty stack: [ ]" },
    { points: "Push 5: [5]" },
    { points: "Push 3: [3, 5]" },
    { points: "Push 7: [7, 3, 5]" },
  ];

  const pushComplexity = [
    { points: "Time Complexity: O(1)" },
    { points: "Space Complexity: O(1)" },
  ];

  const examplePop = [
    { points: "Current stack: [7, 3, 5]" },
    { points: "Pop → returns 7: [3, 5]" },
    { points: "Pop → returns 3: [5]" },
    { points: "Pop → returns 5: [ ]" },
  ];

  const popComplexity = [
    { points: "Time Complexity: O(1)" },
    { points: "Space Complexity: O(1)" },
  ];

  {
    /* applications */
  }
  const applications = [
    {
      points: "Function call management in programming languages (call stack)",
    },
    { points: "Undo/Redo operations in text editors" },
    { points: "Back/Forward navigation in web browsers" },
    { points: "Expression evaluation and syntax parsing" },
    { points: "Memory management" },
  ];

  {
    /* underflow and overflow */
  }
  const flows = [{ title: "Stack Underflow" }, { title: "Stack Overflow" }];

  const flowsDetails = [
    { detail: "Trying to pop from an empty stack" },
    {
      detail: "Trying to push to a full stack (in fixed-size implementations)",
    },
  ];

  const combineData = flows.map((item, index) => ({
    title: item.title,
    detail: flowsDetails[index].detail,
  }));

  return (
    <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 md:gap-4">
      <div className="col-span-1">
        <div className="hidden md:block">
          {mounted && (
            <iframe
              key={theme}
              src={
                theme === "dark"
                  ? "https://hw.glich.co/resources/embed/daily/dsa?theme=dark"
                  : "https://hw.glich.co/resources/embed/daily/dsa?theme=light"
              }
              width="100%"
              height="400"
              title="Daily DSA Challenge"
            ></iframe>
          )}
        </div>
        <div className="flex justify-center">
          <span className="text-xs hidden md:block">
            Daily DSA Challenge by{" "}
            <a
              href="https://hw.glich.co/resources/daily"
              target="_blank"
              className="underline hover:text-blue-500 duration-300"
            >
              Hello World
            </a>
          </span>
        </div>
      </div>
      <article className="col-span-4 max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        {/* What is Stack Push & Pop */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Stack Push & Pop?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[0]}
            </p>
          </div>
        </section>

        {/* Push Operation */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Push Operation
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Adds an element to the top of the stack.
            </p>
            <p className="text-[#374151] dark:text-[#d1d5db] font-medium mb-2">
              Example: Pushing elements onto a stack
            </p>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {examplePush.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.points}
                </li>
              ))}
            </ol>
            <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {pushComplexity.map((item, index) => (
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
          </div>
        </section>

        {/* Pop Operation */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Pop Operation
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Removes and returns the topmost element from the stack.
            </p>
            <p className="text-[#374151] dark:text-[#d1d5db] font-medium mb-2">
              Example: Popping elements from a stack
            </p>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {examplePop.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.points}
                </li>
              ))}
            </ol>
            <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {popComplexity.map((item, index) => (
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

        {/* Stack Underflow & Overflow */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Stack Underflow & Overflow
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {combineData.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  <span className="font-semibold">{item.title}:</span>{" "}
                  {item.detail}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Real-world Applications */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Real-world Applications
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {applications.map((items, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {items.points}
                </li>
              ))}
            </ul>
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

      {/* Mobile iframe at bottom */}
      <div className="block md:hidden w-full">
        {mounted && (
          <iframe
            key={theme}
            src={
              theme === "dark"
                ? "https://hw.glich.co/resources/embed/daily/dsa?theme=dark"
                : "https://hw.glich.co/resources/embed/daily/dsa?theme=light"
            }
            width="100%"
            height="320"
            title="Daily DSA Challenge"
          ></iframe>
        )}
        <div className="flex justify-center pb-8">
          <span className="text-xs">
            Daily DSA Challenge By{" "}
            <a
              href="https://hw.glich.co/resources/daily"
              target="_blank"
              className="underline hover:text-blue-500 duration-300"
            >
              Hello World
            </a>
          </span>
        </div>
      </div>
    </main>
  );
};

export default Content;
