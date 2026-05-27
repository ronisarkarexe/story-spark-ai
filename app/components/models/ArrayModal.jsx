"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function ArrayModal() {
  const boxRefs = useRef([]);

  const array = [10, 20, 30, 40];

  useEffect(() => {
    gsap.from(boxRefs.current, {
  opacity: 0,
  y: 50,
  stagger: 0.2,
  duration: 0.6,
  clearProps: "all",
});
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-32">
      <div className="flex justify-center gap-4">
        {array.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              ref={(el) => (boxRefs.current[index] = el)}
              className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded shadow-md border border-blue-700 text-sm"
            >
              {item}
            </div>
            <span className="mt-1 text-xs text-gray-600 dark:text-gray-300">[{index}]</span>
          </div>
        ))}
      </div>
    </div>
  );
}