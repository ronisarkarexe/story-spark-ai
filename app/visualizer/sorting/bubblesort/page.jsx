import Animation from "@/app/visualizer/sorting/bubblesort/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/sorting/bubblesort/content";
import Quiz from "@/app/visualizer/sorting/bubblesort/quiz";
import Code from "@/app/visualizer/sorting/bubblesort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Bubble Sort Algorithm | Step-by-Step Animation",
  description:
    "Visualize Bubble Sort in action with interactive animations, code examples in JavaScript, C, Python, and Java, and test your understanding with a dedicated Bubble Sort quiz. Learn how Bubble Sort works through comparisons and swaps in an easy-to-understand format.",
  keywords: [
    "Bubble Sort Visualizer",
    "Bubble Sort Animation",
    "Bubble Sort Algorithm",
    "Bubble Sort Quiz",
    "Sorting Algorithm Quiz",
    "Sorting Algorithm Visualization",
    "DSA Bubble Sort",
    "Learn Bubble Sort",
    "Sorting for Beginners",
    "Step by Step Bubble Sort",
    "Interactive Sorting Tool",
    "Bubble Sort in JavaScript",
    "Bubble Sort in C",
    "Bubble Sort in Python",
    "Bubble Sort in Java",
    "Bubble Sort Code Examples",
    "Practice Bubble Sort",
    "DSA Bubble Sort Quiz",
    "Interactive DSA Quiz",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/sorting/bubbleSort.png",
        width: 1200,
        height: 630,
        alt: "Bubble Sort Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Sorting", "Bubble Sort")}
      title="Bubble Sort"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.bubbleSort}
          description="Mark Bubble Sort as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Sorting Algorithms"
          links={[
            {
              text: "Selection Sort",
              url: "/visualizer/sorting/selectionsort",
            },
            {
              text: "Insertion Sort",
              url: "/visualizer/sorting/insertionsort",
            },
            { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
            { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
            { text: "Heap Sort", url: "/algorithms/sorting/heap" },
          ]}
        />
      }
    />
  );
}
