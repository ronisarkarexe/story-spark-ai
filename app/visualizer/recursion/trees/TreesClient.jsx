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

export default function TreesClient() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Recursion Trees")}
      title="Recursion Trees"
      headerDescription="Visualize recursion trees using the Fibonacci calculation. Observe how the function execution branches out dynamically to form a decision tree."
      animation={<FibonacciAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionFibonacci}
          description="Mark Recursion Trees (Fibonacci Tree) as done"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Call Stack Visualization", url: "/visualizer/recursion/stack" },
            { text: "Backtracking", url: "/visualizer/recursion/backtracking" },
            { text: "Multiple Recursive Calls", url: "/visualizer/recursion/multiple-calls" },
          ]}
        />
      }
    />
  );
}
