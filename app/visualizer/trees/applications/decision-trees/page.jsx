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
  title: "Decision Trees Visualizer | Tree Applications | AlgoBuddy",
  description:
    "Learn Decision Trees, a popular machine learning algorithm. Visualize how decisions are made based on conditions and features.",
  keywords: [
    "Decision Trees",
    "Machine Learning",
    "Tree Applications",
    "Classification",
    "AlgoBuddy",
  ],
  robots: "index, follow",
};

export default function DecisionTreesPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Applications", "Decision Trees")}
      title="Decision Trees"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.decisionTrees}
          description="Mark Decision Trees as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Applications"
          links={[
            { text: "Heap Sort", description: "Efficient sorting algorithm based on binary heap.", url: "./heapsort" },
            { text: "Huffman Coding", description: "Data compression using Huffman Trees.", url: "./huffman" },
            { text: "Syntax Trees", description: "Abstract Syntax Trees in compilers.", url: "./syntax-trees" },
          ]}
          columns="3"
        />
      }
    />
  );
}
