import FenwickAnimation from "@/app/visualizer/trees/advanced/fenwick/animation";
import FenwickContent from "@/app/visualizer/trees/advanced/fenwick/content";
import FenwickCode from "@/app/visualizer/trees/advanced/fenwick/codeBlock";
import FenwickQuiz from "@/app/visualizer/trees/advanced/fenwick/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Fenwick Tree (Binary Indexed Tree) Visualizer | Interactive Queries & Updates | AlgoBuddy",
  description:
    "Explore Fenwick Tree (Binary Indexed Tree) structures, dynamic LSB update steps, prefix sum queries, and point updates with educational modules and quizzes.",
  keywords: [
    "Fenwick Tree",
    "Binary Indexed Tree",
    "Prefix Sum Query",
    "LSB Operations",
    "DSA Tree Animations"
  ],
  robots: "index, follow",
};

export default function FenwickTreePage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Fenwick Trees")}
      title="Fenwick Trees"
      animation={<FenwickAnimation />}
      content={<FenwickContent />}
      code={<FenwickCode />}
      quiz={<FenwickQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.fenwickTree}
          description="Mark Fenwick Tree as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
            { text: "Red-Black Trees", url: "./red-black" },
            { text: "B-Trees", url: "./b-trees" },
            { text: "Trie (Prefix Tree)", url: "./trie" },
            { text: "Segment Trees", url: "./segment" }
          ]}
        />
      }
    />
  );
}
