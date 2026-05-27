"use client";
import React from "react";
import NQueensAnimation from "../n-queens/animation";
import Code from "../n-queens/codeBlock";
import Quiz from "../n-queens/quiz";
import Content from "../n-queens/content";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";
import ModuleCard from "@/app/components/ui/ModuleCard";

export default function BacktrackingClient() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Backtracking")}
      title="Backtracking"
      headerDescription="Visualize classical backtracking recursively. Watch the algorithm place queens on a chessboard, backtrack upon conflicts, and find all safe placements."
      animation={<NQueensAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionNQueens}
          description="Mark Backtracking (N-Queens Placement) as done"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Recursion on Subsequences", url: "/visualizer/recursion/subsequences" },
            { text: "Multiple Recursive Calls", url: "/visualizer/recursion/multiple-calls" },
            { text: "Recursion Trees", url: "/visualizer/recursion/trees" },
          ]}
        />
      }
    />
  );
}
