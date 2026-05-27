"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function StackModal() {
  const boxRefs = useRef([]);

  const stack = [10, 20, 30];

  useEffect(() => {
    gsap.fromTo(
      boxRefs.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.6 }
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-48 w-full">
      <div className="flex flex-col items-center gap-4 border border-blue-300 rounded-lg p-4 bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 dark:bg-gradient-to-b from-blue-50 to-blue-100 shadow-lg max-w-xs mx-auto">
        <span className="text-xs font-semibold text-blue-600 mb-0">Top</span>
        {stack.map((item, index) => (
          <div
            key={index}
            ref={(el) => (boxRefs.current[index] = el)}
            className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center rounded-lg shadow-md border border-blue-700 text-sm font-medium"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}