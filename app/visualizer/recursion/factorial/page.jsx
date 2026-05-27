import FactorialAnimation from "@/app/visualizer/recursion/factorial/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/recursion/factorial/codeBlock";
import Quiz from "@/app/visualizer/recursion/factorial/quiz";
import Content from "@/app/visualizer/recursion/factorial/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Factorial Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize the Factorial recursive algorithm step by step. Learn how stack frames are pushed and popped with animations, line-by-line trace, and conceptual quizzes.",
  keywords: [
    "Factorial Visualizer",
    "Factorial Recursion",
    "Call Stack Animation",
    "Stack Frames",
    "DSA Recursion",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Functional & Parameterized Recursion")}
      title="Functional & Parameterized Recursion"
      headerDescription="Visualize how the Factorial algorithm calls itself, pushes frames to the call stack, reaches the base case, and propagates return values back up."
      headerActions={<ArticleActions />}
      animation={<FactorialAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionFactorial}
          description="Mark Factorial Recursion as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Sum of First N Numbers", url: "/visualizer/recursion/sum-of-n" },
            { text: "Fibonacci (Tree Recursion)", url: "/visualizer/recursion/fibonacci" },
            { text: "Stack operations", url: "/visualizer/stack/push-pop" }
          ]}
        />
      }
    />
  );
}
