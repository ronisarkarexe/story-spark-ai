import Animation from "@/app/visualizer/sorting/selectionsort/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/sorting/selectionsort/content";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/sorting/selectionsort/codeBlock";
import Quiz from "@/app/visualizer/sorting/selectionsort/quiz";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Selection Sort Visualizer | Simple Sorting Animation with Code in JS, C, Python, Java",
  description:
    "Visualize Selection Sort in action with step-by-step animations and code examples in JavaScript, C, Python, and Java. A beginner-friendly way to understand this simple sorting algorithm using comparisons and swaps.",
  keywords: [
    "Selection Sort Visualizer",
    "Selection Sort Animation",
    "Selection Sort Algorithm",
    "DSA Selection Sort",
    "Learn Selection Sort",
    "Sorting Algorithm Visualization",
    "Interactive Sorting Tool",
    "Sorting for Beginners",
    "Step by Step Sorting",
    "Selection Sort in JavaScript",
    "Selection Sort in C",
    "Selection Sort in Python",
    "Selection Sort in Java",
    "Selection Sort Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/sorting/selectionSort.png",
        width: 1200,
        height: 630,
        alt: "Selection Sort Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Sorting", "Selection Sort")}
      title="Selection Sort"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.selectionSort}
          description="Mark Selection Sort as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Sorting Algorithms"
          links={[
            { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
            { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
            {
              text: "Insertion Sort",
              url: "/visualizer/sorting/insertionsort",
            },
            { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
            { text: "Heap Sort", url: "/algorithms/sorting/heap" },
          ]}
        />
      }
    />
  );
}
