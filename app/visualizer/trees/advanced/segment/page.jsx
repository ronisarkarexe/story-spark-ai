import SegmentAnimation from "@/app/visualizer/trees/advanced/segment/animation";
import SegmentContent from "@/app/visualizer/trees/advanced/segment/content";
import SegmentCode from "@/app/visualizer/trees/advanced/segment/codeBlock";
import SegmentQuiz from "@/app/visualizer/trees/advanced/segment/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Segment Tree Visualizer | Interactive Range Query & Point Updates | AlgoBuddy",
  description:
    "Explore Segment Tree structures, dynamic range queries, segment builds, and point updates step-by-step with educational animations and quizzes.",
  keywords: [
    "Segment Tree",
    "Range Query",
    "Point Update",
    "DSA Tree Animations",
    "Interval Tree"
  ],
  robots: "index, follow",
};

export default function SegmentTreePage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Segment Trees")}
      title="Segment Trees"
      animation={<SegmentAnimation />}
      content={<SegmentContent />}
      code={<SegmentCode />}
      quiz={<SegmentQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.segmentTree}
          description="Mark Segment Tree as done and view it on your dashboard"
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
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
