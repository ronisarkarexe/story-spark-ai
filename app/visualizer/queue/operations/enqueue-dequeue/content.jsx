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

  const paragraph = [
    `A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Elements are added at the rear (enqueue) and removed from the front (dequeue). It operates much like a real-world queue (line) where the first person to arrive is the first to be served.`,
    `The space complexity is O(n) where n is the number of elements in the queue, as it needs to store all elements.`,
    `Queues are fundamental in computer science and are used in various applications like CPU scheduling, disk scheduling, handling interrupts, breadth-first search, and any scenario where you need to maintain order of processing.`,
  ];

  const enqueue = [
    { points : "Check if the queue is full (in case of fixed-size implementation)" },
    { points : "If full, return overflow error (or resize in dynamic implementation)" },
    { points : "Increment the rear pointer" },
    { points : "Add the new element at the rear position" },
  ];

  const opeartionEnqueue = [
    { points : "Before Enqueue: [10, 20, 30]" },
    { points : "Enqueue(40): Add 40 to the rear" },
    { points : "Enqueue(40): Add 40 to the rear" },
  ];

  const dequeue = [
    { points : "Check if the queue is empty" },
    { points : "If empty, return underflow error" },
    { points : "Access the data at the front of the queue" },
    { points : "Increment the front pointer to the next element" },
    { points : "Return the accessed data" },
  ];

  const operationDequeue = [
    { points : "Before Dequeue: [10, 20, 30, 40]" },
    { points : "Dequeue(): Remove and return 10" },
    { points : "After Dequeue: [20, 30, 40]" },
  ];

  const complexity = [
    { points : "Enqueue Operation: O(1) - Constant time to add to the end" },
    { points : "Dequeue Operation: O(1) - Constant time to remove from the front" },
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
    {/* What is a Queue? */}
    <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        What is a Queue?
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
          {paragraph[0]}
        </p>
      </div>
    </section>

    {/* Enqueue Operation */}
    <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        Enqueue Operation
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
          Enqueue adds an element to the end (rear) of the queue. Example with queue: [10, 20, 30]
        </p>
        
        <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
          {opeartionEnqueue.map((item, index) => (
            <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
              {item.points}
            </li>
          ))}
        </ol>
        
        <p className="text-[#374151] dark:text-[#d1d5db] mt-4 leading-relaxed">
          The new element always goes to the end of the queue.
        </p>
      </div>
    </section>

    {/* Dequeue Operation */}
    <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        Dequeue Operation
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
          Dequeue removes and returns the element from the front (head) of the queue.
        </p>
        <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
          Example with queue: <span className="font-mono dark:text-amber-500 text-purple-600">[10, 20, 30, 40]</span>
        </p>
        
        <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
          {operationDequeue.map((item, index) => (
            <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
              {item.points}
            </li>
          ))}
        </ol>
        
        <p className="text-[#374151] dark:text-[#d1d5db] mt-4 leading-relaxed">
          The oldest element (first one added) is always removed first.
        </p>
      </div>
    </section>

    {/* Algorithm Steps for Enqueue */}
    <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        Algorithm Steps for Enqueue
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
          {enqueue.map((item, index) => (
            <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
              {item.points}
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* Algorithm Steps for Dequeue */}
    <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        Algorithm Steps for Dequeue
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
          {dequeue.map((item, index) => (
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
        Time Complexity
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

    {/* Space Complexity */}
    <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        Space Complexity
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
          {paragraph[1]}
        </p>
      </div>
    </section>

    {/* Additional Info */}
    <section className="p-6">
      <div className="prose dark:prose-invert max-w-none">
        <div className="px-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
          <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
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
