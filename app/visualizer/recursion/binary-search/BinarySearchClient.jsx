"use client";
import React from "react";
import BinarySearchAnimation from "./animation";
import BinarySearchCode from "./codeBlock";
import BinarySearchContent from "./content";
import BinarySearchQuiz from "./quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";
import ModuleCard from "@/app/components/ui/ModuleCard";

export default function BinarySearchClient() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Recursive Binary Search")}
      title="Recursive Binary Search"
      headerDescription="Visualize how Binary Search operates recursively by halving the search space, computing middle pointers, and recursively calling left or right intervals."
      animation={<BinarySearchAnimation />}
      content={<BinarySearchContent />}
      code={<BinarySearchCode />}
      quiz={<BinarySearchQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionBinarySearch}
          description="Mark Recursive Binary Search as done"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Basic Recursion", url: "/visualizer/recursion/basic-recursion" },
            { text: "Functional & Parameterized", url: "/visualizer/recursion/functional-parameterized" },
            { text: "Multiple Recursive Calls", url: "/visualizer/recursion/multiple-calls" },
          ]}
        />
      }
    />
  );
}
