import Animation from "@/app/visualizer/sorting/insertionsort/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/sorting/insertionsort/content";
import Quiz from "@/app/visualizer/sorting/insertionsort/quiz";
import Code from "@/app/visualizer/sorting/insertionsort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Insertion Sort Algorithm | Learn with Interactive Animations",
  description:
    "Understand how Insertion Sort works through step-by-step animations and test your knowledge with an interactive quiz. Includes code examples in JavaScript, C, Python, and Java. Perfect for beginners learning data structures and algorithms visually and through hands-on coding.",
  keywords: [
    "Insertion Sort Visualizer",
    "Insertion Sort Animation",
    "Insertion Sort Visualization",
    "DSA Insertion Sort",
    "Learn Insertion Sort",
    "Insertion Sort Quiz",
    "Sorting Algorithm Quiz",
    "Sorting Algorithm Visualization",
    "Step by Step Insertion Sort",
    "Interactive DSA Tool",
    "DSA for Beginners",
    "Insertion Sort Explained",
    "Practice Insertion Sort",
    "Interactive Insertion Sort Quiz",
    "Insertion Sort in JavaScript",
    "Insertion Sort in C",
    "Insertion Sort in Python",
    "Insertion Sort in Java",
    "Insertion Sort Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/sorting/insertionSort.png",
        width: 1200,
        height: 630,
        alt: "Insertion Sort Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Sorting", "Insertion Sort")}
      title="Insertion Sort"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.insertionSort}
          description="Mark Insertion Sort as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Sorting Algorithms"
          links={[
            { text: "Selection Sort", url: "/visualizer/sorting/selectionsort" },
            { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
            { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
            { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
            { text: "Heap Sort", url: "/algorithms/sorting/heap" },
          ]}
        />
      }
    />
  );
}
