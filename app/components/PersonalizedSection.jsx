"use client";
import React from "react";
import Link from "next/link";

/* DSA topic map — rows of topic cards, some completed, some locked */
const TOPIC_ROWS = [
  [
    { label: "Arrays",        color: "#f87171", done: true },
    { label: "Strings",       color: "#fb923c", done: true },
    { label: "Hashing",       color: "#a78bfa", done: true },
    { label: "Recursion",     color: "#34d399", done: true },
  ],
  [
    { label: "Linked List",   color: "#f87171", done: true },
    { label: "Stack",         color: "#60a5fa", done: true },
    { label: "Queue",         color: "#a78bfa", done: true },
    { label: "Binary Search", color: "#34d399", done: true },
    { label: "Two Pointers",  color: "#fb923c", done: false, lock: true },
  ],
  [
    { label: "Trees",         color: "#f87171", done: true },
    { label: "BST",           color: "#60a5fa", done: true },
    { label: "Heaps",         color: "#a78bfa", done: false, lock: false },
    { label: "Tries",         color: "#34d399", done: false, lock: false },
    { label: "Graphs",        color: "#fb923c", done: false, lock: true },
    { label: "Sorting",       color: "#f472b6", done: false, lock: true },
  ],
  [
    { label: "BFS / DFS",        color: "#f87171", done: false, lock: false },
    { label: "Backtracking",     color: "#60a5fa", done: false, lock: true },
    { label: "Greedy",           color: "#a78bfa", done: false, lock: true },
    { label: "Divide & Conquer", color: "#34d399", done: false, lock: true },
    { label: "Dynamic Prog.",    color: "#fb923c", done: false, lock: true },
  ],
  [
    { label: "Sliding Window",   color: "#f87171", done: false, lock: true },
    { label: "Bit Manipulation", color: "#60a5fa", done: false, lock: true },
    { label: "Segment Tree",     color: "#a78bfa", done: false, lock: true },
    { label: "Disjoint Set",     color: "#34d399", done: false, lock: true },
  ],
];

function TopicCard({ label, color, done, lock }) {
  return (
    <div
      className="relative flex flex-col gap-1 px-3 py-2 rounded-xl bg-white dark:bg-[#2d2f31] border border-[#e5e7eb] dark:border-[#3e4143] shadow-sm select-none transition-colors duration-300"
      style={{
        filter: lock ? "blur(3px)" : "none",
        opacity: lock ? 0.55 : 1,
        minWidth: "90px",
      }}
    >
      {/* colour bar */}
      <div className="h-[3px] w-8 rounded-full" style={{ background: color }} />
      <span className="text-[12px] font-semibold text-[#1a1a1a] dark:text-[#f7f9fa] leading-tight transition-colors duration-300">
        {label}
      </span>
      {done && (
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white dark:bg-[#2d2f31] border border-[#e5e7eb] dark:border-[#3e4143] flex items-center justify-center text-[10px] text-[#22c55e] font-bold shadow-sm transition-colors duration-300">
          ✓
        </span>
      )}
    </div>
  );
}

export default function PersonalizedSection() {
  return (
    <section
      className="py-24 px-6 overflow-hidden bg-gradient-to-b from-white via-[#eef2ff] to-[#faf5ff] dark:from-[#1c1d1f] dark:via-[#1c1d1f] dark:to-[#1c1d1f] transition-colors duration-300"
      style={{
        fontFamily: "'Inter', 'Source Sans 3', sans-serif",
      }}
    >
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        {/* ── LEFT: text ── */}
        <div className="flex-1 flex flex-col gap-5 items-start lg:min-w-[320px]">
          <h2
            className="text-[2.6rem] sm:text-[3.2rem] font-black leading-[1.08] tracking-tight text-[#1a1a1a] dark:text-white transition-colors duration-300"
            style={{ letterSpacing: "-0.03em" }}
          >
            Your DSA path,
            <br />
            your pace
          </h2>
          <p className="text-[1.1rem] text-[#4b5563] dark:text-[#9e9e9e] leading-relaxed max-w-[400px] transition-colors duration-300">
            Every topic you master unlocks the next. AlgoBuddy maps your
            progress across Arrays, Trees, Graphs and beyond — so you always
            know exactly where to go next.
          </p>

          <Link
            href="/visualizer"
            className="inline-flex items-center gap-2 h-[46px] px-7 rounded-full bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] text-[15px] font-bold hover:bg-[#a435f0] dark:hover:bg-[#a435f0] dark:hover:text-white transition-all duration-200"
          >
            Start your path
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>

        {/* ── RIGHT: topic map ── */}
        <div className="flex-1 relative w-full overflow-hidden">

          {/* fade edge LEFT — matches section bg in both modes */}
          <div
            className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none
                        bg-gradient-to-r from-[#eef2ff] to-transparent
                        dark:from-[#1c1d1f] dark:to-transparent"
          />

          {/* fade edge RIGHT — matches section bg in both modes */}
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none
                        bg-gradient-to-l from-[#faf5ff] to-transparent
                        dark:from-[#1c1d1f] dark:to-transparent"
          />

          {/* fade BOTTOM — matches section bg in both modes */}
          <div
            className="absolute left-0 right-0 bottom-0 h-20 z-10 pointer-events-none
                        bg-gradient-to-t from-[#f0fdf4] to-transparent
                        dark:from-[#1c1d1f] dark:to-transparent"
          />

          <div className="flex flex-col gap-3 py-2">
            {TOPIC_ROWS.map((row, ri) => (
              <div
                key={ri}
                className="flex gap-3 flex-wrap"
                style={{ paddingLeft: `${ri * 14}px` }}
              >
                {row.map((topic, ti) => (
                  <TopicCard key={ti} {...topic} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
