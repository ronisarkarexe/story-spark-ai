"use client";
import React, { useState } from "react";
import SumOfNAnimation from "../sum-of-n/animation";
import FactorialAnimation from "../factorial/animation";
import ReverseArrayAnimation from "../reverse-array/animation";
import PalindromeAnimation from "../palindrome/animation";

import SumOfNCode from "../sum-of-n/codeBlock";
import FactorialCode from "../factorial/codeBlock";
import ReverseArrayCode from "../reverse-array/codeBlock";
import PalindromeCode from "../palindrome/codeBlock";

import SumOfNContent from "../sum-of-n/content";
import FactorialContent from "../factorial/content";
import ReverseArrayContent from "../reverse-array/content";
import PalindromeContent from "../palindrome/content";

import SumOfNQuiz from "../sum-of-n/quiz";
import FactorialQuiz from "../factorial/quiz";
import ReverseArrayQuiz from "../reverse-array/quiz";
import PalindromeQuiz from "../palindrome/quiz";

import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ExploreOther from "@/app/components/ui/exploreOther";

export default function FunctionalParameterizedClient() {
  const [problem, setProblem] = useState("sum-of-n");

  const getProblemDetails = () => {
    switch (problem) {
      case "sum-of-n":
        return {
          title: "Sum of First N Numbers",
          desc: "Visualize functional recursion calculating the sum of the first N integers (N + sum(N-1)).",
          animation: <SumOfNAnimation />,
          content: <SumOfNContent />,
          code: <SumOfNCode />,
          quiz: <SumOfNQuiz />,
        };
      case "factorial":
        return {
          title: "Factorial of N",
          desc: "Animate recursive call frames calculating N factorial (N * fact(N-1)) with LIFO resolution.",
          animation: <FactorialAnimation />,
          content: <FactorialContent />,
          code: <FactorialCode />,
          quiz: <FactorialQuiz />,
        };
      case "reverse-array":
        return {
          title: "Reverse an Array",
          desc: "Watch how functional recursion swaps elements inwards using two pointers.",
          animation: <ReverseArrayAnimation />,
          content: <ReverseArrayContent />,
          code: <ReverseArrayCode />,
          quiz: <ReverseArrayQuiz />,
        };
      case "palindrome":
        return {
          title: "String Palindrome Check",
          desc: "Observe pointer comparisons working recursively from both ends of the string.",
          animation: <PalindromeAnimation />,
          content: <PalindromeContent />,
          code: <PalindromeCode />,
          quiz: <PalindromeQuiz />,
        };
      default:
        return {};
    }
  };

  const details = getProblemDetails();

  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Functional & Parameterized Recursion")}
      title="Functional & Parameterized Recursion"
      headerDescription={details.desc}
      headerActions={
        <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 shadow-inner justify-center max-w-2xl mx-auto">
          {[
            { id: "sum-of-n", label: "Sum of N" },
            { id: "factorial", label: "Factorial" },
            { id: "reverse-array", label: "Reverse Array" },
            { id: "palindrome", label: "Palindrome Check" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setProblem(btn.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                problem === btn.id
                  ? "bg-white dark:bg-zinc-850 text-teal-600 dark:text-teal-400 shadow-md ring-1 ring-black/5"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      }
      animation={details.animation}
      content={details.content}
      code={details.code}
      quiz={details.quiz}
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Basic Recursion", url: "/visualizer/recursion/basic-recursion" },
            { text: "Multiple Recursive Calls", url: "/visualizer/recursion/multiple-calls" },
            { text: "Backtracking", url: "/visualizer/recursion/backtracking" },
          ]}
        />
      }
    />
  );
}
