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
    `A Circular Queue is an advanced version of a linear queue that connects the end of the queue back to the front, forming a circle. This efficient structure prevents memory wastage and allows better utilization of fixed-size buffers.`,
    `The circular queue is an essential data structure for systems requiring efficient, fixed-size buffers with constant-time operations. Its circular nature solves the memory wastage problem of linear queues while maintaining simple and predictable performance characteristics, making it ideal for low-level system programming and real-time applications.`,
  ];

  const characteristics = [
    { points : "Fixed capacity: Size is predetermined at creation" },
    { points : "Two pointers:",
      subpoints : [
        "Front: Points to the first element",
        "Rear: Points to the last element",
      ],
     },
    { points : "Circular behavior: When pointers reach the end, they wrap around to the start" },
    { points : "Efficient space utilization: Reuses empty spaces created after dequeues" },
  ];

  const implementation = [
    { points : "Pointer Movement:", 
      subpoints : [
        "front = (front + 1) % capacity",
        "rear = (rear + 1) % capacity",
      ],
    },
    { points : "Full/Empty Conditions:", 
      subpoints : [
        "Full: (rear + 1) % capacity == front",
        "Empty: front == rear",
      ],
    },
    { points : "Always one empty slot:", 
      subpoints : [
        "Needed to distinguish between full and empty states",
      ],
    },
  ];

  const complexity = [
    { points : "enqueue(): O(1)" },
    { points : "dequeue(): O(1)" },
    { points : "peekFront(): O(1)" },
    { points : "peekRear(): O(1)" },
    { points : "isEmpty(): O(1)" },
    { points : "isFull(): O(1)" },
  ];

  const application = [
    { points : "CPU Scheduling: Round-robin scheduling algorithms" },
    { points : "Memory Management: Circular buffers in memory systems" },
    { points : "Traffic Systems: Controlling the flow of traffic signals" },
    { points : "Data Streams: Handling continuous data streams (audio/video buffers)" },
    { points : "Producer-Consumer Problems: Where producers and consumers operate at different rates" },
  ];

  const advantages = [
    { points : "Better memory utilization: Reuses empty spaces" },
    { points : "Efficient operations: No need to shift elements" },
    { points : "Fixed memory footprint: Predictable memory usage" },
    { points : "Real-time systems friendly: Bounded execution time" },
  ];

    return (
          <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
    {/* What is a Circular Queue? */}
    <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        What is a Circular Queue?
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
          {paragraph[0]}
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
          Circular queues have these fundamental properties:
        </p>
        <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
          {characteristics.map((item, index) => (
            <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
              {item.points}
              {item.subpoints && (
                <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                  {item.subpoints.map((subitem, subindex) => (
                    <li key={subindex} className="text-[#6b7280] dark:text-[#9ca3af]">
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

    {/* Implementation Details */}
    <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        Implementation Details
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
          Key implementation aspects:
        </p>
        <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
          {implementation.map((item, index) => (
            <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
              <span className="font-semibold">{item.points}</span>
              {item.subpoints && (
                <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                  {item.subpoints.map((subitem, subindex) => (
                    <li key={subindex} className="text-[#6b7280] dark:text-[#9ca3af]">
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

    {/* Applications */}
    <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        Applications
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed">
          Circular queues are used in:
        </p>
        <ul className="space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
          {application.map((item, index) => (
            <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
              {item.points}
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Advantages Over Linear Queue */}
    <section className="p-6">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
        <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
        Advantages Over Linear Queue
      </h1>
      <div className="prose dark:prose-invert max-w-none">
        <ul className="space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
          {advantages.map((item, index) => (
            <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
              {item.points}
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Additional Info */}
    <section className="p-6 border-t border-[#f3f4f6] dark:border-[#1e1e1e]">
      <div className="prose dark:prose-invert max-w-none">
        <div className="px-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
          <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
            {paragraph[1]}
          </p>
        </div>
      </div>
    </section>
  </article>
</main>
    );
  };
  
  export default Content;
