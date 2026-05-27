import Content from "./content";
import CodeBlock from "./codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export const metadata = {
  title: "Binary Tree Structure & Properties | Learn Terminology and Metrics | AlgoBuddy",
  description:
    "Learn about Binary Tree structure, properties, and terminology in Data Structures and Algorithms. Discover root, parent, child, sibling, leaf, and internal nodes along with height, depth, level, degrees, and common formulas with interactive animations and code examples in JavaScript, Python, Java, C, and C++.",
  keywords: [
    "Binary Tree",
    "Binary Tree Structure",
    "Binary Tree Properties",
    "Tree Height",
    "Tree Depth",
    "Leaf Nodes",
    "Binary Tree Formulas",
    "Interactive Tree Inspector",
    "Data Structures",
    "Algorithms",
    "Learn DSA",
    "Binary Tree in C++",
    "Binary Tree in JavaScript",
    "Binary Tree in Python",
    "Binary Tree in Java",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Structure & Properties")}
      title="Binary Tree Structure & Properties"
      content={<Content />}
      code={<CodeBlock />}
      exploreOther={
        <ExploreOther
          title="Explore other tree modules"
          links={[
            { text: "Types of Binary Trees", url: "/visualizer/trees/binaryTree/types" },
            { text: "BST Insertion", url: "/visualizer/trees/bst/insertion" },
            { text: "In-order Traversal", url: "/visualizer/trees/traversing/in-order" },
            { text: "Morris Traversal", url: "/visualizer/trees/traversing/morris" },
          ]}
        />
      }
    />
  );
}
