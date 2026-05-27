"use client";
import React, { useState } from "react";
import Print1ToNAnimation from "../print-1-to-n/animation";
import PrintNTo1Animation from "../print-n-to-1/animation";
import Print1ToNCode from "../print-1-to-n/codeBlock";
import PrintNTo1Code from "../print-n-to-1/codeBlock";
import Print1ToNContent from "../print-1-to-n/content";
import PrintNTo1Content from "../print-n-to-1/content";
import Print1ToNQuiz from "../print-1-to-n/quiz";
import PrintNTo1Quiz from "../print-n-to-1/quiz";

import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ExploreOther from "@/app/components/ui/exploreOther";

export default function BasicRecursionClient() {
  const [problem, setProblem] = useState("1-to-n");

  const is1ToN = problem === "1-to-n";

  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Basic Recursion")}
      title="Basic Recursion"
      headerDescription={
        is1ToN
          ? "Understand the absolute basics of recursion by pushing frames onto the stack to count up from 1 to N."
          : "Visualize the execution order when actions are performed before calling recursively to print down from N to 1."
      }
      headerActions={
        <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 shadow-inner">
          <button
            onClick={() => setProblem("1-to-n")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              is1ToN
                ? "bg-white dark:bg-zinc-850 text-teal-600 dark:text-teal-400 shadow-md ring-1 ring-black/5"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Print 1 to N
          </button>
          <button
            onClick={() => setProblem("n-to-1")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              !is1ToN
                ? "bg-white dark:bg-zinc-850 text-teal-600 dark:text-teal-400 shadow-md ring-1 ring-black/5"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Print N to 1
          </button>
        </div>
      }
      animation={is1ToN ? <Print1ToNAnimation /> : <PrintNTo1Animation />}
      content={is1ToN ? <Print1ToNContent /> : <PrintNTo1Content />}
      code={is1ToN ? <Print1ToNCode /> : <PrintNTo1Code />}
      quiz={is1ToN ? <Print1ToNQuiz /> : <PrintNTo1Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Functional & Parameterized", url: "/visualizer/recursion/functional-parameterized" },
            { text: "Multiple Recursive Calls", url: "/visualizer/recursion/multiple-calls" },
            { text: "Backtracking", url: "/visualizer/recursion/backtracking" },
          ]}
        />
      }
    />
  );
}
