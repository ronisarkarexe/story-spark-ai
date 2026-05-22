import Animation from "@/app/visualizer/linkedList/operations/insertion/animation";
import Content from "@/app/visualizer/linkedList/operations/insertion/content";
import Quiz from "@/app/visualizer/linkedList/operations/insertion/quiz";
import CodeBlock from "@/app/visualizer/linkedList/operations/insertion/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export const metadata = {
  title:
    "Linked List Insertion Algorithm | Interactive Visualization & Step-by-Step Guide",
  description:
    "Learn how insertion works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the insertion process and master linked list algorithms efficiently.",
  keywords: [
    "Linked List Insertion",
    "Insertion Animation Linked List",
    "Visualize Insertion in Linked List",
    "Linked List Algorithm",
    "DSA Linked List Insertion",
    "Linked List Insertion Visualization",
    "Interactive Linked List",
    "Insertion Step-by-Step",
    "Linked List Learning",
    "Data Structures Animation",
    "DSA Practice Linked List",
    "Insertion Code Example",
    "Linked List Tutorial",
    "Insertion using C",
    "Insertion using Java",
    "Insertion using Javascript",
    "Insertion using Python",
    "Insertion using linked list",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Insertion")}
      title="Insertion"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Traversal", url: "./traversal" },
            { text: "Deletion", url: "./deletion" },
            { text: "Searching", url: "./search" },
            { text: "Merging", url: "./merge" },
            { text: "Comparison", url: "./comparison" },
            { text: "Reverse", url: "./reverse" },
          ]}
        />
      }
    />
  );
}
