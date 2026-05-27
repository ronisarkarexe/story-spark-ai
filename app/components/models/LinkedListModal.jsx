"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

export default function SinglyLinkedList() {
  const nodeRefs = useRef([]);
  const list = [10, 20, 30];

  useEffect(() => {
    gsap.fromTo(
      nodeRefs.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="flex flex-col items-center py-6">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Node */}
            <div
              ref={(el) => (nodeRefs.current[index] = el)}
              className="flex flex-col items-center px-3 py-2 bg-blue-100 border border-blue-400 rounded-md shadow w-10"
            >
              <div className="text-blue-700 font-semibold text-sm">{item}</div>
              <div className="text-xs text-gray-500">data</div>
              <div className="border-t border-blue-400 w-full my-1" />
              <div className="text-xs text-gray-500">next</div>
            </div>

            {/* Arrow */}
            {index < list.length - 1 && (
              <ArrowRight className="text-blue-500 w-4 h-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}