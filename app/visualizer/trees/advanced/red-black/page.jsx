import RedBlackAnimation from "@/app/visualizer/trees/advanced/red-black/animation";
import RedBlackContent from "@/app/visualizer/trees/advanced/red-black/content";
import RedBlackCode from "@/app/visualizer/trees/advanced/red-black/codeBlock";
import RedBlackQuiz from "@/app/visualizer/trees/advanced/red-black/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Red-Black Tree Visualizer | Interactive Rotations & Recoloring | AlgoBuddy",
  description:
    "Visualize Red-Black Tree self-balancing operations, node insertions, left/right rotations, and color flips step-by-step with educational modules and quizzes.",
  keywords: [
    "Red-Black Tree",
    "Self-Balancing Binary Tree",
    "Tree Rotations",
    "Color Flips",
    "DSA Tree Animations",
    "Learn Red-Black Tree"
  ],
  robots: "index, follow",
};

export default function RedBlackPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Red-Black Tree")}
      title="Red-Black Tree"
      animation={<RedBlackAnimation />}
      content={<RedBlackContent />}
      code={<RedBlackCode />}
      quiz={<RedBlackQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.redBlackTree}
          description="Mark Red-Black Tree as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
            { text: "B-Trees", url: "./b-trees" },
            { text: "Trie (Prefix Tree)", url: "./trie" },
            { text: "Segment Trees", url: "./segment" },
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
