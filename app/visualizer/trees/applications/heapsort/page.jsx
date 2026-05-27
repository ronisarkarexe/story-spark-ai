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
  title: "Heap Sort Visualizer | Tree Applications | AlgoBuddy",
  description:
    "Learn Heap Sort, an efficient sorting algorithm based on binary heap data structure. Visualize heap construction, heapify process, and sort arrays.",
  keywords: [
    "Heap Sort",
    "Tree Applications",
    "Sorting Algorithms",
    "Binary Heap",
    "AlgoBuddy",
  ],
  robots: "index, follow",
};

export default function HeapSortPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Applications", "Heap Sort")}
      title="Heap Sort"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.heapSort}
          description="Mark Heap Sort as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Applications"
          links={[
            { text: "Huffman Coding", description: "Data compression using Huffman Trees.", url: "./huffman" },
            { text: "Decision Trees", description: "Machine learning decision-making workflows.", url: "./decision-trees" },
            { text: "Syntax Trees", description: "Abstract Syntax Trees in compilers.", url: "./syntax-trees" },
          ]}
          columns="3"
        />
      }
    />
  );
}
