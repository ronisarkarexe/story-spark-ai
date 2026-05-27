import Content from "@/app/visualizer/trees/binaryTree/types/content";
import CodeBlock from "@/app/visualizer/trees/binaryTree/types/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export const metadata = {
  title: "Binary Tree Types | Learn Full, Complete, and Degenerate Binary Trees in DSA",
  description:
    "Learn about Binary Tree types in Data Structures and Algorithms, including Full Binary Tree, Complete Binary Tree, and Degenerate Tree with clear visual explanations, animations, and code examples in JavaScript, C, Python, and Java.",
  keywords: [
    "Binary Tree",
    "Binary Tree Types",
    "Full Binary Tree",
    "Complete Binary Tree",
    "Degenerate Tree",
    "Binary Tree Visualization",
    "DSA Binary Trees",
    "Binary Tree Animation",
    "Binary Tree Implementation",
    "Binary Tree in JavaScript",
    "Binary Tree in C",
    "Binary Tree in Python",
    "Binary Tree in Java",
    "Learn Binary Trees DSA",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Types of Binary Trees")}
      title="Types of Binary Trees"
      content={<Content />}
      code={<CodeBlock />}
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Structure & Properties", url: "/visualizer/trees/binaryTree/properties" }]}
        />
      }
    />
  );
}
