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
  title: "Serialize/Deserialize Binary Tree | Tree Algorithm | AlgoBuddy",
  description:
    "Master binary tree serialization and deserialization with step-by-step examples and JavaScript implementation details.",
  keywords: ["Serialize Binary Tree", "Deserialize Binary Tree", "Tree Algorithms", "AlgoBuddy"],
  robots: "index, follow",
};

export default function SerializationAlgorithmPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Algorithms", "Serialize/Deserialize")}
      title="Serialize/Deserialize Binary Tree"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.serialization}
          description="Mark Serialize/Deserialize as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Algorithms"
          links={[
            { text: "Lowest Common Ancestor", description: "Find the lowest shared parent.", url: "./lca" },
            { text: "Tree Diameter", description: "Find the longest path between any two nodes.", url: "./diameter" },
            { text: "Tree Isomorphism", description: "Check if two trees are structurally identical.", url: "./isomorphism" },
          ]}
          columns="3"
        />
      }
    />
  );
}
