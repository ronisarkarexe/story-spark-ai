import Animation from "@/app/visualizer/linkedList/types/singly/animation";
import Content from "@/app/visualizer/linkedList/types/singly/content";
import Quiz from "@/app/visualizer/linkedList/types/singly/quiz";
import CodeBlock from "@/app/visualizer/linkedList/types/singly/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export const metadata = {
  title:
    "Singly Linked List Implementation | Visualize Linked List in JS, C, Python, Java",
  description:
    "Explore Singly Linked List implementation with interactive visualizations and real-time code examples in JavaScript, C, Python, and Java. Learn insertion, deletion, and traversal with step-by-step animations. Perfect for DSA beginners and interview preparation.",
  keywords: [
    "Singly Linked List Implementation",
    "Singly Linked List Visualization",
    "Linked List in JavaScript",
    "Linked List in C",
    "Linked List in Python",
    "Linked List in Java",
    "DSA Linked List",
    "Linked List Operations",
    "Insertion in Linked List",
    "Deletion in Linked List",
    "Traverse Linked List",
    "Learn Linked List",
    "Visualize Linked List",
    "DSA for Beginners",
    "Interactive Linked List Tool",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Singly Linked List")}
      title="Singly Linked List"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Doubly Linked List", url: "./doubly" },
            { text: "Circular Linked List", url: "./circular" },
          ]}
        />
      }
    />
  );
}
