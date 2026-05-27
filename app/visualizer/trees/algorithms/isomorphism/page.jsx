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
  title: "Tree Isomorphism Visualizer | Tree Algorithm | AlgoBuddy",
  description:
    "Learn how to determine whether two binary trees are structurally identical using tree isomorphism checks, supported by examples and code.",
  keywords: ["Tree Isomorphism", "Binary Tree", "AlgoBuddy"],
  robots: "index, follow",
};

export default function IsomorphismAlgorithmPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Algorithms", "Tree Isomorphism")}
      title="Tree Isomorphism"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.isomorphism}
          description="Mark Tree Isomorphism as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Algorithms"
          links={[
            { text: "Lowest Common Ancestor", description: "Find the lowest shared parent.", url: "./lca" },
            { text: "Tree Diameter", description: "Find the longest path between any two nodes.", url: "./diameter" },
            { text: "Serialize/Deserialize", description: "Convert trees to strings and back.", url: "./serialization" },
          ]}
          columns="3"
        />
      }
    />
  );
}
