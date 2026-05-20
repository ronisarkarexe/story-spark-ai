"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { event } from "@/lib/gtag";
import { ArrowRight } from "lucide-react";

const TOPICS = [
  { label: "Sorting Algorithms", color: "#a435f0", bg: "#faf5ff" },
  { label: "Binary Search", color: "#2563eb", bg: "#eff6ff" },
  { label: "Graph Traversal", color: "#059669", bg: "#f0fdf4" },
  { label: "Linked Lists", color: "#d97706", bg: "#fffbeb" },
  { label: "Dynamic Programming", color: "#dc2626", bg: "#fef2f2" },
  { label: "Stack & Queue", color: "#7c3aed", bg: "#f5f3ff" },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % TOPICS.length);
        setVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    event({
      action: "click_start_visualizing",
      category: "Hero",
      label: "Start Visualizing Button",
    });
  };

  return (
    <main
      className="bg-white dark:bg-surface-900"
    >
      <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5 py-20 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* ══ LEFT — text ══ */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-7">
            {/* headline */}
            <h1
              className="text-[2.8rem] sm:text-[3.5rem] lg:text-[4rem] font-extrabold leading-[1.1] tracking-tighter text-surface-900 dark:text-surface-50"
            >
              The smartest way
              <br />
              to learn DSA — <span className="text-primary">visually.</span>
            </h1>

            {/* animated topic pill */}
            <div className="flex items-center gap-3 h-10">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-bold transition-all duration-300"
                style={{
                  background: visible ? TOPICS[index].bg : "transparent",
                  color: visible ? TOPICS[index].color : "transparent",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0px)" : "translateY(6px)",
                  border: `1.5px solid ${visible ? TOPICS[index].color + "33" : "transparent"}`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: TOPICS[index].color }}
                />
                {TOPICS[index].label}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <Link
                href="/visualizer"
                onClick={handleStart}
                className="group inline-flex items-center gap-2 h-[52px] min-h-[44px] px-8 rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-[15px] font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all duration-200"
              >
                Start Visualizing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 h-[52px] min-h-[44px] px-8 rounded-full border-2 border-surface-900 dark:border-surface-50 text-surface-900 dark:text-surface-50 text-[15px] font-bold hover:bg-surface-900 hover:text-white dark:hover:bg-white dark:hover:text-surface-900 transition-all duration-200"
              >
                Read Blogs
              </Link>
            </div>
          </div>

          {/* ══ RIGHT — DSA visual card ══ */}
          <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto">
            <div className="relative w-full max-w-[460px]">
              {/* ── main card: code editor window ── */}
              <div className="rounded-2xl border border-[#d1d7dc] dark:border-[#3e4143] bg-[#1c1d1f] shadow-2xl overflow-hidden">
                {/* title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2f31] border-b border-[#3e4143]">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-[12px] text-[#9e9e9e] font-mono">
                    binarySearch.js
                  </span>
                </div>

                {/* code body */}
                <div className="px-5 py-5 font-mono text-[13px] leading-[1.85] select-none">
                  <div>
                    <span className="text-[#c792ea]">function</span>{" "}
                    <span className="text-[#82aaff]">binarySearch</span>
                    <span className="text-[#f7f9fa]">(arr, target) {"{"}</span>
                  </div>
                  <div className="pl-5">
                    <span className="text-[#c792ea]">let</span>{" "}
                    <span className="text-[#f78c6c]">left</span>{" "}
                    <span className="text-[#89ddff]">=</span>{" "}
                    <span className="text-[#f78c6c]">0</span>
                    <span className="text-[#f7f9fa]">,</span>{" "}
                    <span className="text-[#f78c6c]">right</span>{" "}
                    <span className="text-[#89ddff]">=</span>{" "}
                    <span className="text-[#f7f9fa]">arr.length</span>{" "}
                    <span className="text-[#89ddff]">-</span>{" "}
                    <span className="text-[#f78c6c]">1</span>
                    <span className="text-[#f7f9fa]">;</span>
                  </div>
                  <div className="pl-5 mt-1">
                    <span className="text-[#c792ea]">while</span>{" "}
                    <span className="text-[#f7f9fa]">(left</span>{" "}
                    <span className="text-[#89ddff]">&lt;=</span>{" "}
                    <span className="text-[#f7f9fa]">right) {"{"}</span>
                  </div>
                  <div className="pl-10">
                    <span className="text-[#c792ea]">const</span>{" "}
                    <span className="text-[#f78c6c]">mid</span>{" "}
                    <span className="text-[#89ddff]">=</span>{" "}
                    <span className="text-[#f7f9fa]">Math.floor((left</span>{" "}
                    <span className="text-[#89ddff]">+</span>{" "}
                    <span className="text-[#f7f9fa]">right)</span>{" "}
                    <span className="text-[#89ddff]">/</span>{" "}
                    <span className="text-[#f78c6c]">2</span>
                    <span className="text-[#f7f9fa]">);</span>
                  </div>
                  <div className="pl-10 bg-[#a435f0]/20 rounded px-2 -mx-2">
                    <span className="text-[#c792ea]">if</span>{" "}
                    <span className="text-[#f7f9fa]">(arr[mid]</span>{" "}
                    <span className="text-[#89ddff]">===</span>{" "}
                    <span className="text-[#f7f9fa]">target)</span>{" "}
                    <span className="text-[#c792ea]">return</span>{" "}
                    <span className="text-[#f78c6c]">mid</span>
                    <span className="text-[#f7f9fa]">;</span>
                  </div>
                  <div className="pl-10">
                    <span className="text-[#c792ea]">else if</span>{" "}
                    <span className="text-[#f7f9fa]">(arr[mid]</span>{" "}
                    <span className="text-[#89ddff]">&lt;</span>{" "}
                    <span className="text-[#f7f9fa]">target) left</span>{" "}
                    <span className="text-[#89ddff]">=</span>{" "}
                    <span className="text-[#f7f9fa]">mid</span>{" "}
                    <span className="text-[#89ddff]">+</span>{" "}
                    <span className="text-[#f78c6c]">1</span>
                    <span className="text-[#f7f9fa]">;</span>
                  </div>
                  <div className="pl-10">
                    <span className="text-[#c792ea]">else</span>{" "}
                    <span className="text-[#f7f9fa]">right</span>{" "}
                    <span className="text-[#89ddff]">=</span>{" "}
                    <span className="text-[#f7f9fa]">mid</span>{" "}
                    <span className="text-[#89ddff]">-</span>{" "}
                    <span className="text-[#f78c6c]">1</span>
                    <span className="text-[#f7f9fa]">;</span>
                  </div>
                  <div className="pl-5">
                    <span className="text-[#f7f9fa]">{"}"}</span>
                  </div>
                  <div className="pl-5">
                    <span className="text-[#c792ea]">return</span>{" "}
                    <span className="text-[#f78c6c]">-1</span>
                    <span className="text-[#f7f9fa]">;</span>
                  </div>
                  <div>
                    <span className="text-[#f7f9fa]">{"}"}</span>
                  </div>
                </div>

                {/* visualizer strip */}
                <div className="px-5 pb-5">
                  <div className="rounded-lg bg-[#2d2f31] border border-[#3e4143] p-4">
                    <p className="text-[11px] text-[#9e9e9e] font-mono mb-3 uppercase tracking-wider">
                      Visualization — step 2 of 4
                    </p>
                    {/* array bars */}
                    <div className="flex items-end gap-1.5 h-[60px]">
                      {[2, 5, 8, 12, 16, 23, 38, 45, 56, 72].map((v, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-1"
                        >
                          <div
                            className="w-full rounded-sm transition-all"
                            style={{
                              height: `${(v / 72) * 52}px`,
                              background:
                                i === 5
                                  ? "#a435f0" // mid — purple
                                  : i >= 5
                                    ? "#3e4143" // right half — dimmed
                                    : "#6a6f73", // left half
                            }}
                          />
                          <span className="text-[9px] text-[#9e9e9e] font-mono">
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* legend */}
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-[11px] text-[#9e9e9e]">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#a435f0]" />{" "}
                        mid
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-[#9e9e9e]">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#6a6f73]" />{" "}
                        active
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-[#9e9e9e]">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#3e4143]" />{" "}
                        eliminated
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── floating badge top-right ── */}
              <div className="absolute -top-4 -right-4 flex items-center gap-2 bg-white dark:bg-[#2d2f31] border border-[#d1d7dc] dark:border-[#3e4143] rounded-full pl-2.5 pr-4 py-2 shadow-xl text-[13px] font-semibold text-[#1c1d1f] dark:text-[#f7f9fa]">
                <span className="w-7 h-7 rounded-full bg-[#a435f0] flex items-center justify-center text-white text-[11px] font-bold">
                  O
                </span>
                O(log n)
              </div>

              {/* ── floating badge bottom-left ── */}
              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 bg-white dark:bg-[#2d2f31] border border-[#d1d7dc] dark:border-[#3e4143] rounded-full pl-2.5 pr-4 py-2 shadow-xl text-[13px] font-semibold text-[#1c1d1f] dark:text-[#f7f9fa]">
                <span className="w-7 h-7 rounded-full bg-[#28c840] flex items-center justify-center text-white text-[11px] font-bold">
                  ✓
                </span>
                Found at index 5
              </div>

              {/* glow */}
              <div className="absolute inset-0 rounded-2xl bg-[#a435f0]/8 blur-3xl -z-10 scale-110" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HeroSection;
