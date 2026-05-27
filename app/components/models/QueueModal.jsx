"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function QueueModel() {
  const boxRefs = useRef([]);
  const queue = [10, 20, 30, 40];

  useEffect(() => {
    gsap.fromTo(
      boxRefs.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-40 w-full">
      <div className="relative flex items-center gap-3 px-6 py-4 rounded-lg border border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 dark:bg-gradient-to-b shadow-lg w-fit mx-auto">
        {/* Front Label */}
        <div className="absolute -top-5 left-0 text-sm text-blue-600 font-semibold">
          Front
        </div>
        {/* Rear Label */}
        <div className="absolute -top-5 right-0 text-sm text-blue-600 font-semibold">
          Rear
        </div>

        {queue.map((item, index) => (
          <div
            key={index}
            ref={(el) => (boxRefs.current[index] = el)}
            className="w-7 h-7 bg-gradient-to-t from-blue-600 to-blue-500 text-white flex items-center justify-center rounded-md shadow-md border border-blue-700 text-sm font-medium"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}