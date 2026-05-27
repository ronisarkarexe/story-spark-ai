"use client";
import { useState } from "react";

// Matches the actual shortcuts in useVisualizerKeyboard.js
const SHORTCUTS = [
  { keys: ["Space"], label: "Start / Reset" },
  { keys: ["R"],     label: "Reset All"     },
  { keys: ["+","="], label: "Speed up"      },
  { keys: ["-"],     label: "Slow down"     },
];

export default function KeyboardShortcutsLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts"
        className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-neutral-950 px-3 py-1.5 text-sm font-medium
                   text-gray-600 dark:text-gray-300
                   hover:bg-gray-50 dark:hover:bg-neutral-900
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {/* keyboard icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <rect x="2" y="6" width="20" height="13" rx="2"/>
          <path strokeLinecap="round" d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>
        </svg>
        <span className="hidden sm:inline">Shortcuts</span>
        {/* chevron */}
        <svg xmlns="http://www.w3.org/2000/svg"
             className={`h-3 w-3 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="tooltip"
          className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200
                     dark:border-gray-700 bg-white dark:bg-neutral-950 p-3 shadow-lg"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide
                        text-gray-400 dark:text-gray-500">
            Keyboard Shortcuts
          </p>
          <ul className="space-y-1.5">
            {SHORTCUTS.map(({ keys, label }) => (
              <li key={label} className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                <span className="flex items-center gap-1">
                  {keys.map((k) => (
                    <kbd key={k}
                         className="inline-flex items-center justify-center min-w-[1.75rem]
                                    rounded border border-gray-300 dark:border-gray-600
                                    bg-gray-100 dark:bg-neutral-800
                                    px-1.5 py-0.5 font-mono text-xs font-semibold
                                    text-gray-800 dark:text-gray-100 shadow-sm">
                      {k}
                    </kbd>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}