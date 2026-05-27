import Animation from "@/app/visualizer/linkedList/operations/traversal/animation";
import Content from "@/app/visualizer/linkedList/operations/traversal/content";
import Quiz from "@/app/visualizer/linkedList/operations/traversal/quiz";
import CodeBlock from "@/app/visualizer/linkedList/operations/traversal/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export const metadata = {
  title:
    "Linked List Traversal Algorithm | Interactive Visualization & Step-by-Step Guide",
  description:
    "Explore how traversal works in Linked Lists with interactive animations, clear explanations, and hands-on practice. Visualize each step of the traversal process and master linked list algorithms efficiently.",
  keywords: [
    "Linked List Traversal",
    "Traversal Animation Linked List",
    "Visualize Traversal in Linked List",
    "Linked List Algorithm",
    "DSA Linked List Traversal",
    "Linked List Traversal Visualization",
    "Interactive Linked List",
    "Traversal Step-by-Step",
    "Linked List Learning",
    "Data Structures Animation",
    "DSA Practice Linked List",
    "Traversal Code Example",
    "Linked List Tutorial",
    "Traversal using C",
    "Traversal using Java",
    "Traversal using Javascript",
    "Traversal using Python",
    "Traversal using linked list",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Traversal")}
      title="Traversal"
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
            { text: "Compare", url: "./comparison" },
            { text: "Merge", url: "./merge" },
            { text: "Searching", url: "./search" },
            { text: "Reverse", url: "./reverse" },
          ]}
        />
      }
    />
  );
}
