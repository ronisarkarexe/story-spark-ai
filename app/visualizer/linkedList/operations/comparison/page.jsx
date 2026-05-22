import Animation from "@/app/visualizer/linkedList/operations/comparison/animation";
import Content from "@/app/visualizer/linkedList/operations/comparison/content";
import Quiz from "@/app/visualizer/linkedList/operations/comparison/quiz";
import CodeBlock from "@/app/visualizer/linkedList/operations/comparison/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export const metadata = {
  title:
    "Linked List Comparison Algorithm | Interactive Visualization & Step-by-Step Guide",
  description:
    "Learn how comparison works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the comparison process and master linked list algorithms efficiently.",
  keywords: [
    "Linked List Comparison",
    "Comparison Animation Linked List",
    "Visualize Comparison in Linked List",
    "Linked List Algorithm",
    "DSA Linked List Comparison",
    "Linked List Comparison Visualization",
    "Interactive Linked List",
    "Comparison Step-by-Step",
    "Linked List Learning",
    "Data Structures Animation",
    "DSA Practice Linked List",
    "Comparison Code Example",
    "Linked List Tutorial",
    "Comparison using C",
    "Comparison using Java",
    "Comparison using Javascript",
    "Comparison using Python",
    "Comparison using linked list",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Comparison")}
      title="Comparison"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore Other Operations"
          links={[
            { text: "Insertion", url: "./insertion" },
            { text: "Deletion", url: "./deletion" },
            { text: "Traversal", url: "./traversal" },
            { text: "Merging", url: "./merge" },
            { text: "Searching", url: "./search" },
            { text: "Reverse", url: "./reverse" },
          ]}
        />
      }
    />
  );
}
