import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ExploreOther from "@/app/components/ui/exploreOther";
import { Info, Sparkles } from "lucide-react";

export const metadata = {
  title: "AVL Tree Balancing | Self-Balancing BST | AlgoBuddy",
  description:
    "Learn about AVL Trees, the first self-balancing binary search trees. Explore height-balancing, single and double rotations, and complexity analysis.",
  keywords: [
    "AVL Tree",
    "Self-Balancing BST",
    "Tree Rotations",
    "Height Balanced Tree",
    "DSA Tree"
  ],
  robots: "index, follow",
};

export default function AVLPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Binary Search Tree", "Balancing (AVL)")}
      title="AVL Tree Balancing"
      animation={
        <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-7xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-lg">
            <div className="text-xs text-purple-400 font-semibold flex items-center gap-1.5 bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-900/35">
              <Sparkles className="w-4 h-4 animate-pulse" /> Active Visualizer under development for GSSoc &apos;26!
            </div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
              <Info className="w-3.5 h-3.5 text-purple-400" /> Module Status
            </div>
            <p className="text-sm font-medium text-purple-200/90 leading-relaxed">
              Welcome to the AVL Tree learning module! In AVL Trees, the heights of the two child subtrees of any node differ by at most one. Study standard balance factor criteria and tree rotations in your DSA courses, and practice the interactive BST visualizers in the sidebar.
            </p>
          </div>
        </div>
      }
      content={
        <main className="max-w-4xl mx-auto bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] p-6 space-y-6 shadow-sm mt-8">
          <section>
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              What is an AVL Tree?
            </h2>
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              Named after its inventors Adelson-Velsky and Landis, the AVL Tree is the first self-balancing binary search tree. In an AVL Tree, each node maintains a Balance Factor (defined as the height difference between the left and right subtrees: Height_left - Height_right). For any node to remain balanced, its Balance Factor must belong to the set {"{-1, 0, 1}"}.
            </p>
          </section>
        </main>
      }
      exploreOther={
        <ExploreOther
          title="Explore other BST operations"
          links={[
            { text: "Insertion", url: "/visualizer/trees/bst/insertion" },
            { text: "Deletion", url: "/visualizer/trees/bst/deletion" },
            { text: "Searching", url: "/visualizer/trees/bst/searching" }
          ]}
        />
      }
    />
  );
}
