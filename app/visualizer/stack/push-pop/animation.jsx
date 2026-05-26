"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import PushPop from "@/app/components/ui/PushPop";
import usePlayback from "@/app/hooks/usePlayback";

const StackVisualizer = () => {
  const [stack, setStack] = useState([]);
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Stack is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  const { speed, setSpeed } = usePlayback(1);
  const stackRefs = useRef([]);

  // Reset stack
  const reset = () => {
    setStack([]);
    setMessage("Stack is empty");
    setOperation(null);
  };

  useEffect(() => {
    if (isAnimating && stackRefs.current.length > 0) {
      const el = stackRefs.current[0];
      if (operation?.includes("pushed")) {
        gsap.fromTo(
          el,
          { y: -50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 / speed, ease: "power3.out" }
        );
      } else if (operation?.includes("popped")) {
        gsap.to(el, { y: 50, opacity: 0, duration: 0.3 / speed, ease: "power1.in" });
      } else if (operation?.includes("Peek")) {
        gsap.fromTo(
          el,
          { scale: 1 },
          { scale: 1.2, yoyo: true, repeat: 1, duration: 0.2 / speed }
        );
      }
    }
  }, [stack, operation, isAnimating, speed]);

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize the LIFO (Last In, First Out) principle
      </p>

      <div className="max-w-4xl mx-auto">
        <PushPop
          stack={stack}
          setStack={setStack}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          operation={operation}
          setOperation={setOperation}
          message={message}
          setMessage={setMessage}
          speed={speed}
          setSpeed={setSpeed}
        />

        {/* Stack Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Stack Visualization</h2>

          {/* Vertical Stack */}
          <div className="flex flex-col items-center min-h-[300px]">
            {/* Top indicator */}
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {stack.length > 0 ? "↑ Top" : ""}
            </div>

            {/* Stack elements */}
            <div className="w-32 relative">
              {stack.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span>Stack is empty</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {stack.map((item, index) => (
                    <div
                      key={index}
                      ref={(el) => (stackRefs.current[index] = el)}
                      className={`p-3 border-2 rounded text-center font-medium transition-all duration-300 ${
                        index === 0
                          ? "bg-blue-100 dark:bg-blue-900 border-[#c27cf7] dark:border-primary-dark"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <div>{item}</div>
                      {index === 0 && (
                        <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          (Top)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom indicator */}
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {stack.length > 0 ? "↓ Bottom" : ""}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StackVisualizer;
