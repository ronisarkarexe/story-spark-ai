"use client";
import React from "react";
import FactorialAnimation from "../factorial/animation";
import Code from "../factorial/codeBlock";
import Quiz from "../factorial/quiz";
import Content from "../factorial/content";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";
import ModuleCard from "@/app/components/ui/ModuleCard";

export default function StackClient() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Call Stack Visualization")}
      title="Call Stack Visualization"
      headerDescription="Visualize how active calls construct LIFO frames on the system call stack, showing parameter variables and active execution paths."
      animation={<FactorialAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionFactorial}
          description="Mark Call Stack Visualization (Factorial Stack) as done"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Recursion Trees", url: "/visualizer/recursion/trees" },
            { text: "Functional & Parameterized", url: "/visualizer/recursion/functional-parameterized" },
            { text: "Basic Recursion", url: "/visualizer/recursion/basic-recursion" },
          ]}
        />
      }
    />
  );
}
