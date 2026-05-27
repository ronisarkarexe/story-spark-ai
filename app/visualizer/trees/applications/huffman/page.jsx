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
  title: "Huffman Coding Visualizer | Tree Applications | AlgoBuddy",
  description:
    "Learn Huffman Coding, an efficient data compression algorithm. Visualize tree construction, encoding, and decoding processes.",
  keywords: [
    "Huffman Coding",
    "Data Compression",
    "Tree Applications",
    "Greedy Algorithm",
    "AlgoBuddy",
  ],
  robots: "index, follow",
};

export default function HuffmanCodingPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Applications", "Huffman Coding")}
      title="Huffman Coding"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.huffmanCoding}
          description="Mark Huffman Coding as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Applications"
          links={[
            { text: "Heap Sort", description: "Efficient sorting algorithm based on binary heap.", url: "./heapsort" },
            { text: "Decision Trees", description: "Machine learning decision-making workflows.", url: "./decision-trees" },
            { text: "Syntax Trees", description: "Abstract Syntax Trees in compilers.", url: "./syntax-trees" },
          ]}
          columns="3"
        />
      }
    />
  );
}
