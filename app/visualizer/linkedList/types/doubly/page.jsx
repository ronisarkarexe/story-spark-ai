import Animation from "@/app/visualizer/linkedList/types/doubly/animation";
import Content from "@/app/visualizer/linkedList/types/doubly/content";
import Quiz from "@/app/visualizer/linkedList/types/doubly/quiz";
import CodeBlock from "@/app/visualizer/linkedList/types/doubly/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export const metadata = {
  title:
    "Doubly Linked List Implementation | Visualize Doubly Linked List in JS, C, Python, Java",
  description:
    "Explore Doubly Linked List implementation with interactive animations and code examples in JavaScript, C, Python, and Java. Learn insertion, deletion, and traversal from both directions. Perfect for DSA beginners and interview preparation.",
  keywords: [
    "Doubly Linked List Implementation",
    "DLL Visualization",
    "Doubly Linked List in JavaScript",
    "Doubly Linked List in C",
    "Doubly Linked List in Python",
    "Doubly Linked List in Java",
    "DSA Doubly Linked List",
    "Bidirectional Linked List",
    "Insertion in DLL",
    "Deletion in DLL",
    "DLL Operations",
    "Learn Doubly Linked List",
    "DSA for Beginners",
    "Interactive Linked List Visualizer",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Doubly Linked List")}
      title="Doubly Linked List"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Singly Linked List", url: "./singly" },
            { text: "Circular Linked List", url: "./circular" },
          ]}
        />
      }
    />
  );
}
