"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import usePlayback from "@/app/hooks/usePlayback";
import LinearMemoryControls from "@/app/components/ui/LinearMemoryControls";

const StackVisualizer = () => {
  /* ---------- state ---------- */
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Stack is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  const [peekedItem, setPeekedItem] = useState(null);
  const [isEmptyStatus, setIsEmptyStatus] = useState(null);
  const { speed, setSpeed } = usePlayback(1);

  const itemRefs = useRef([]);

  /* ---------- helpers ---------- */
  const resetRefs = () => (itemRefs.current = []);

  /* ---------- push ---------- */
  const push = () => {
    const val = inputValue.trim();
    if (!val) {
      setMessage("Please enter a value to push");
      return;
    }
    setIsAnimating(true);
    setOperation(`Pushing "${val}"…`);
    setMessage("");
    setPeekedItem(null);
    setIsEmptyStatus(null);

    setStack((prev) => [val, ...prev]);

    setTimeout(() => {
      const el = itemRefs.current[0];
      gsap.set(el, { y: -60, scale: 0.8, opacity: 0 });
      gsap
        .timeline({ onComplete: () => setIsAnimating(false) })
        .to(el, { y: 0, scale: 1, opacity: 1, duration: 0.4 / speed, ease: "back.out(1.7)" })
        .to(el, { boxShadow: "0 0 10px #3b82f6", duration: 0.2 / speed, yoyo: true, repeat: 1 }, "-=0.2")
        .call(() => setMessage(`"${val}" pushed to stack!`));
    }, 10);

    setInputValue("");
  };

  /* ---------- pop ---------- */
  const pop = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty!");
      setIsEmptyStatus(true);
      return;
    }
    setIsAnimating(true);
    const val = stack[0];
    setOperation(`Popping "${val}"…`);
    setMessage("");
    setPeekedItem(null);
    setIsEmptyStatus(null);

    const el = itemRefs.current[0];
    gsap
      .timeline({ onComplete: () => {
        setStack((prev) => prev.slice(1));
        setIsAnimating(false);
        setMessage(`"${val}" popped from stack!`);
      } })
      .to(el, { scale: 0.5, rotation: 15, y: 80, opacity: 0, duration: 0.5 / speed, ease: "power2.in" });
  };

  /* ---------- peek ---------- */
  const peek = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty!");
      setIsEmptyStatus(true);
      return;
    }
    setIsAnimating(true);
    setOperation("Peeking at top element…");
    setPeekedItem(stack[0]);
    setIsEmptyStatus(false);

    const el = itemRefs.current[0];
    gsap
      .timeline({ onComplete: () => setIsAnimating(false) })
      .to(el, { y: -6, boxShadow: "0 0 15px #a855f7", duration: 0.25 / speed })
      .to(el, { y: 0, boxShadow: "0 0 0px transparent", duration: 0.25 / speed })
      .to(el, { y: -6, duration: 0.25 / speed })
      .to(el, { y: 0, duration: 0.25 / speed })
      .call(() => setMessage(`Top element is "${stack[0]}"`));
  };

  /* ---------- isEmpty ---------- */
  const checkEmpty = () => {
    setIsAnimating(true);
    setOperation("Checking if stack is empty…");
    setPeekedItem(null);
    setTimeout(() => {
      const empty = stack.length === 0;
      setIsEmptyStatus(empty);
      setOperation(null);
      setMessage(empty ? "Stack is empty!" : "Stack is not empty");
      setIsAnimating(false);
    }, 1000 / speed);
  };

  /* ---------- reset ---------- */
  const reset = () => {
    setIsAnimating(true);
    gsap.to(itemRefs.current.filter(Boolean), {
      scale: 0,
      y: -60,
      opacity: 0,
      stagger: 0.06 / speed,
      duration: 0.3 / speed,
      onComplete: () => {
        setStack([]);
        setInputValue("");
        setOperation(null);
        setMessage("Stack is empty");
        setPeekedItem(null);
        setIsEmptyStatus(null);
        setIsAnimating(false);
        resetRefs();
      },
    });
  };

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Push, Pop, Peek, and IsEmpty operations
      </p>

      <div className="max-w-4xl mx-auto">
        <LinearMemoryControls
          inputValue={inputValue}
          setInputValue={setInputValue}
          isAnimating={isAnimating}
          operation={operation}
          message={message}
          speed={speed}
          onSpeedChange={setSpeed}
          actions={[
            { label: "Push", onClick: push, variant: "primary", needsInput: true },
            { label: "IsEmpty", onClick: checkEmpty, variant: "secondary" },
            { label: "Pop", onClick: pop, disabled: stack.length === 0, variant: "secondary" },
            { label: "Reset", onClick: reset, variant: "outline" }
          ]}
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

            <div className="w-32 relative">
              {stack.length === 0 ? (
                <EmptyCloud />
              ) : (
                <div className="space-y-1">
                  {stack.map((item, index) => (
                    <div
                      key={index}
                      ref={(el) => (itemRefs.current[index] = el)}
                      className={`p-3 border-2 rounded text-center font-medium transition-all ${
                        index === 0 && peekedItem !== null
                          ? "bg-purple-200 dark:bg-purple-800 border-purple-400 dark:border-purple-600"
                          : index === 0
                          ? "bg-blue-100 dark:bg-blue-900 border-[#c27cf7] dark:border-primary-dark"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {item}
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

/* ---------- cute floating cloud (empty) ---------- */
const EmptyCloud = () => {
  const cloudRef = useRef(null);
  useEffect(() => {
    gsap.to(cloudRef.current, { y: -6, duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut" });
  }, []);
  return (
    <div className="flex flex-col items-center pt-8 text-gray-400">
      <svg
        ref={cloudRef}
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
      <span className="text-sm">Stack is empty</span>
    </div>
  );
};

export default StackVisualizer;