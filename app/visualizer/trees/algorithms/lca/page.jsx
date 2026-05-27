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
  title: "Lowest Common Ancestor Visualizer | Tree Algorithm | AlgoBuddy",
  description:
    "Learn the Lowest Common Ancestor algorithm for binary trees with clear examples, time and space complexity analysis, and implementation details.",
  keywords: [
    "Lowest Common Ancestor",
    "LCA",
    "Tree Algorithms",
    "Binary Tree",
    "AlgoBuddy",
  ],
  robots: "index, follow",
};

export default function LCAAlgorithmPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Algorithms", "Lowest Common Ancestor")}
      title="Lowest Common Ancestor"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.lca}
          description="Mark Lowest Common Ancestor as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Algorithms"
          links={[
            { text: "Tree Diameter", description: "Find the longest path between any two nodes.", url: "./diameter" },
            { text: "Tree Isomorphism", description: "Check if two trees are structurally identical.", url: "./isomorphism" },
            { text: "Serialize/Deserialize", description: "Convert trees to strings and back.", url: "./serialization" },
          ]}
          columns="3"
        />
      }
    />
  );
}
