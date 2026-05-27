import PrintNTo1Animation from "@/app/visualizer/recursion/print-n-to-1/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/recursion/print-n-to-1/codeBlock";
import Quiz from "@/app/visualizer/recursion/print-n-to-1/quiz";
import Content from "@/app/visualizer/recursion/print-n-to-1/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Print N to 1 Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize basic recursion by printing numbers N down to 1 step-by-step. Witness stack frame pushes and LIFO pops.",
  keywords: [
    "Print N to 1",
    "Basic Recursion",
    "Call Stack",
    "Visualizer",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Basic Recursion")}
      title="Basic Recursion"
      headerDescription="Observe the stack frame behavior while counting down from N to 1 using linear recursion."
      headerActions={<ArticleActions />}
      animation={<PrintNTo1Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionPrintNTo1}
          description="Mark Print N to 1 as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Print 1 to N", url: "/visualizer/recursion/print-1-to-n" },
            { text: "Sum of First N Numbers", url: "/visualizer/recursion/sum-of-n" },
            { text: "Factorial of N", url: "/visualizer/recursion/factorial" }
          ]}
        />
      }
    />
  );
}
