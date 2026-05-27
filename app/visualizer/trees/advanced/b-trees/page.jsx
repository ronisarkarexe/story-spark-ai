import BTreeAnimation from "@/app/visualizer/trees/advanced/b-trees/animation";
import BTreeContent from "@/app/visualizer/trees/advanced/b-trees/content";
import BTreeCode from "@/app/visualizer/trees/advanced/b-trees/codeBlock";
import BTreeQuiz from "@/app/visualizer/trees/advanced/b-trees/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "B-Tree Visualizer | Interactive Key Insertion & Node Splitting | AlgoBuddy",
  description:
    "Explore multi-way search B-Tree structures, node insertions, splitting criteria, and search traversals with step-by-step visual modules and practice quizzes.",
  keywords: [
    "B-Tree",
    "Multi-Way Search Tree",
    "Node Splitting",
    "Database Indexing",
    "DSA Trees Visualizer"
  ],
  robots: "index, follow",
};

export default function BTreePage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "B-Tree")}
      title="B-Tree"
      animation={<BTreeAnimation />}
      content={<BTreeContent />}
      code={<BTreeCode />}
      quiz={<BTreeQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.bTree}
          description="Mark B-Tree as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
            { text: "Red-Black Trees", url: "./red-black" },
            { text: "Trie (Prefix Tree)", url: "./trie" },
            { text: "Segment Trees", url: "./segment" },
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
