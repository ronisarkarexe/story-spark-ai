import Animation from "./animation";
import Content from "./content";
import CodeBlock from "./codeBlock";
import Quiz from "./quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Tree Diameter Visualizer | Tree Algorithm | AlgoBuddy",
  description:
    "Explore tree diameter calculation with practical examples, recursion strategies, and complexity analysis for tree algorithms.",
  keywords: ["Tree Diameter", "Tree Algorithms", "Binary Tree", "AlgoBuddy"],
  robots: "index, follow",
};

export default function DiameterAlgorithmPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Algorithms", "Tree Diameter")}
      title="Tree Diameter"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.diameter}
          description="Mark Tree Diameter as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Algorithms"
          links={[
            { text: "Lowest Common Ancestor", description: "Find the lowest shared parent.", url: "./lca" },
            { text: "Tree Isomorphism", description: "Check if two trees are structurally identical.", url: "./isomorphism" },
            { text: "Serialize/Deserialize", description: "Convert trees to strings and back.", url: "./serialization" },
          ]}
          columns="3"
        />
      }
    />
  );
}
