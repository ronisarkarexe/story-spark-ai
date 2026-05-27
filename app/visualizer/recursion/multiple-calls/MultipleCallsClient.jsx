"use client";
import React from "react";
import FibonacciAnimation from "../fibonacci/animation";
import Code from "../fibonacci/codeBlock";
import Quiz from "../fibonacci/quiz";
import Content from "../fibonacci/content";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";
import ModuleCard from "@/app/components/ui/ModuleCard";

export default function MultipleCallsClient() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Multiple Recursive Calls")}
      title="Multiple Recursive Calls"
      headerDescription="Visualize how Fibonacci uses multiple recursive calls (tree recursion), branching twice at each level and creating duplicate subproblems."
      animation={<FibonacciAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionFibonacci}
          description="Mark Multiple Recursive Calls (Fibonacci Number) as done"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Functional & Parameterized", url: "/visualizer/recursion/functional-parameterized" },
            { text: "Recursion on Subsequences", url: "/visualizer/recursion/subsequences" },
            { text: "Backtracking", url: "/visualizer/recursion/backtracking" },
          ]}
        />
      }
    />
  );
}
