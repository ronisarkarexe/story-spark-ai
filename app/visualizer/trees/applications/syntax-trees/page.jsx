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
  title: "Syntax Trees Visualizer | Tree Applications | AlgoBuddy",
  description:
    "Learn Abstract Syntax Trees (ASTs), a tree representation of the abstract syntactic structure of source code. Used heavily in compilers and interpreters.",
  keywords: [
    "Syntax Trees",
    "AST",
    "Abstract Syntax Tree",
    "Compilers",
    "Tree Applications",
    "AlgoBuddy",
  ],
  robots: "index, follow",
};

export default function SyntaxTreesPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Applications", "Syntax Trees")}
      title="Syntax Trees"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.syntaxTrees}
          description="Mark Syntax Trees as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Applications"
          links={[
            { text: "Heap Sort", description: "Efficient sorting algorithm based on binary heap.", url: "./heapsort" },
            { text: "Huffman Coding", description: "Data compression using Huffman Trees.", url: "./huffman" },
            { text: "Decision Trees", description: "Machine learning decision-making workflows.", url: "./decision-trees" },
          ]}
          columns="3"
        />
      }
    />
  );
}
