import TrieAnimation from "@/app/visualizer/trees/advanced/trie/animation";
import TrieContent from "@/app/visualizer/trees/advanced/trie/content";
import TrieCode from "@/app/visualizer/trees/advanced/trie/codeBlock";
import TrieQuiz from "@/app/visualizer/trees/advanced/trie/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Trie (Prefix Tree) Visualizer | Interactive Word Search & Autocomplete | AlgoBuddy",
  description:
    "Visualize Trie (Prefix Tree) character-by-character string insertion, search, and prefix matching step-by-step with interactive SVG animations, code blocks, and quizzes.",
  keywords: [
    "Trie Visualizer",
    "Prefix Tree Visualizer",
    "Trie Animation",
    "Trie Insertion",
    "Trie Search",
    "Prefix Match",
    "DSA Word Search",
    "Learn Tries",
    "Autocomplete Data Structure",
    "Trie in JavaScript",
    "Trie in Python",
    "Trie in C++"
  ],
  robots: "index, follow",
};

export default function TriePage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Trie (Prefix Tree)")}
      title="Trie (Prefix Tree)"
      animation={<TrieAnimation />}
      content={<TrieContent />}
      code={<TrieCode />}
      quiz={<TrieQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.trie}
          description="Mark Trie (Prefix Tree) as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
            { text: "Red-Black Trees", url: "./red-black" },
            { text: "B-Trees", url: "./b-trees" },
            { text: "Segment Trees", url: "./segment" },
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
