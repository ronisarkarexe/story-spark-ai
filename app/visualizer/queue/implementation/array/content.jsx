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
    `Implementing a Queue using an array is a fundamental approach where we use a fixed-size or dynamic array to store elements while maintaining FIFO order. The array implementation requires careful handling of front and rear pointers to efficiently enqueue and dequeue elements.`,
    `In a circular array implementation, we treat the array as circular to maximize space utilization. When either pointer reaches the end of the array, it wraps around to the beginning.`,
    `Queues are widely used in scenarios like printer job scheduling, call center systems, and network packet handling where order preservation is crucial.`,
  ];

  const implementationSteps = [
    {
      points:
        "Initialize an array of fixed size (for static implementation) or dynamic array",
    },
    {
      points:
        "Initialize two pointers: front (for dequeue) and rear (for enqueue), both set to -1 initially",
    },
    {
      points:
        "Implement boundary checks for overflow (full queue) and underflow (empty queue) conditions",
    },
    {
      points:
        "For circular queue implementation, use modulo arithmetic for pointer updates",
    },
  ];

  const enqueueAlgorithm = [
    {
      points:
        "Check if queue is full (if (rear == capacity - 1) for linear array)",
    },
    { points: "For empty queue, set both front and rear to 0" },
    { points: "For circular queue: rear = (rear + 1) % capacity" },
    { points: "Insert new element at items[rear]" },
    { points: "Increment size counter" },
  ];

  const dequeueAlgorithm = [
    { points: "Check if queue is empty (front == -1)" },
    { points: "Store the front element to return later" },
    { points: "If only one element (front == rear), reset pointers to -1" },
    { points: "For circular queue: front = (front + 1) % capacity" },
    { points: "Decrement size counter" },
    { points: "Return the stored element" },
  ];

  const complexity = [
    {
      points:
        "Enqueue Operation: O(1) - Amortized constant time for dynamic arrays",
    },
    {
      points:
        "Dequeue Operation: O(1) - No shifting needed with pointer approach",
    },
    { points: "Peek Operation: O(1) - Direct access via front pointer" },
    { points: "Space Usage: O(n) - Linear space for storing elements" },
  ];

  const prosCons = [
    {
      points:
        "Pros: Simple implementation, cache-friendly (array elements contiguous in memory)",
    },
    { points: "Pros: Efficient O(1) operations with pointer tracking" },
    { points: "Cons: Fixed size limitation in static array implementation" },
    {
      points:
        "Cons: Wasted space in linear array implementation without circular approach",
    },
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
        {/* Queue Array Implementation Overview */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Queue Implementation Using Array
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

        {/* Enqueue Algorithm */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Enqueue Algorithm
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {enqueueAlgorithm.map((item, index) => (
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

        {/* Dequeue Algorithm */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Dequeue Algorithm
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {dequeueAlgorithm.map((item, index) => (
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

        {/* Time Complexity */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time & Space Complexity
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

        {/* Pros and Cons */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Pros and Cons
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {prosCons.map((item, index) => (
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Practical Considerations
              </h3>
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                {paragraph[1]}
              </p>
              <p className="text-[#374151] dark:text-[#d1d5db] mt-2 leading-relaxed">
                {paragraph[2]}
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
