import SubsequencesAnimation from "@/app/visualizer/recursion/subsequences/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/recursion/subsequences/codeBlock";
import Quiz from "@/app/visualizer/recursion/subsequences/quiz";
import Content from "@/app/visualizer/recursion/subsequences/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Subsequences Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize recursion on subsequences step-by-step. Witness the subset decision tree (Take vs. Not Take), active stack, and generated subsets list.",
  keywords: [
    "Subsequences",
    "Subset Generation",
    "Backtracking",
    "Recursion Tree",
    "Visualizer",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Recursion on Subsequences")}
      title="Recursion on Subsequences"
      headerDescription="Visualize how recursion generates all subsets/subsequences of a set by making a binary choice (Take vs. Not Take) at each element."
      headerActions={<ArticleActions />}
      animation={<SubsequencesAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionSubsequences}
          description="Mark Print all Subsequences as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "N-Queens Placement", url: "/visualizer/recursion/n-queens" },
            { text: "Fibonacci (Multiple Calls)", url: "/visualizer/recursion/fibonacci" },
            { text: "Reverse an Array", url: "/visualizer/recursion/reverse-array" }
          ]}
        />
      }
    />
  );
}
