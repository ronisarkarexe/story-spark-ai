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

  const paragraphs = [
    `A single-ended queue (often just called a queue) is a linear data structure that follows the FIFO (First-In-First-Out) principle. Elements are added (enqueued) at the rear and removed (dequeued) from the front, maintaining strict ordering.`,
    `The single-ended queue is a fundamental data structure in computer science, providing predictable ordering that's essential for many algorithms and system design patterns where processing order matters.`,
  ];

  const characteristics = [
    {
      points: "Two ends:",
      subpoints: ["Front (for removal) and rear (for insertion)"],
    },
    {
      points: "Basic Operations:",
      subpoints: [
        "enqueue() - Add to rear",
        "dequeue() - Remove from front",
        "peek() - View front element",
        "isEmpty() - Check if empty",
      ],
    },
    {
      points: "Fixed Order:",
      subpoints: ["Elements are processed in exact arrival sequence"],
    },
  ];

  const example = [
    { points: "enqueue(10): [10]" },
    { points: "enqueue(20): [10, 20]" },
    { points: "enqueue(30): [10, 20, 30]" },
    { points: "dequeue(): Returns 10 → [20, 30]" },
    { points: "peek(): Returns 20 → [20, 30] (unchanged)" },
  ];

  const implementation = [
    {
      points: "Array-Based:",
      subpoints: [
        "Fixed or dynamic array",
        "Need to handle wrap-around for circular queues",
      ],
    },
    {
      points: "Linked List:",
      subpoints: [
        "Head pointer as front",
        "Tail pointer as rear",
        "Efficient O(1) operations",
      ],
    },
  ];

  const complexity = [
    { points: "enqueue(): O(1)" },
    { points: "dequeue(): O(1)" },
    { points: "peek(): O(1)" },
    { points: "isEmpty(): O(1)" },
  ];

  const application = [
    { points: "CPU task scheduling" },
    { points: "Print job management" },
    { points: "Breadth-First Search (BFS) algorithms" },
    { points: "Buffering data streams" },
    { points: "Handling requests in web servers" },
  ];

  const differences = [
    {
      points: "Single-ended only allows insertion at rear and removal at front",
    },
    { points: "Double-ended (deque) allows insertion/removal at both ends" },
    { points: "Single-ended has stricter FIFO enforcement" },
    { points: "Single-ended is simpler to implement" },
  ];

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
        {/* What is a Single-Ended Queue? */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is a Single-Ended Queue?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraphs[0]}
            </p>
          </div>
        </section>

        {/* Key Characteristics */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Key Characteristics
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Single-ended queues have these fundamental properties:
            </p>
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {characteristics.map((item, index) => (
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

        {/* Visual Example */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Visual Example
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Operation sequence on an initially empty queue:
            </p>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {example.map((item, index) => (
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

        {/* Implementation Variations */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Implementation Variations
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Common implementation approaches:
            </p>
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {implementation.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  <span className="font-semibold">{item.points}</span>
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
            <ul className="space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
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
          </div>
        </section>

        {/* Applications */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Applications
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Single-ended queues are used in:
            </p>
            <ul className="space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {application.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.points}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comparison with Double-Ended Queue */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Comparison with Double-Ended Queue
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
              Key differences:
            </p>
            <ul className="space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {differences.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
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
    </main>
  );
};

export default Content;
