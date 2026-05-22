import Animation from "@/app/visualizer/searching/binarysearch/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/searching/binarysearch/codeBlock";
import Quiz from "@/app/visualizer/searching/binarysearch/quiz";
import Content from "@/app/visualizer/searching/binarysearch/content";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Binary Search Algorithm | Step-by-Step Animation",
  description:
    "Visualize the Binary Search algorithm with intuitive step-by-step animations, code examples in JavaScript, C, Python, and Java, and an interactive Binary Search Quiz to test your knowledge. Perfect for DSA preparation and beginners learning efficient search algorithms.",
  keywords: [
    "Binary Search Visualizer",
    "Binary Search Visualization",
    "Binary Search Animation",
    "Learn Binary Search",
    "Binary Search for Beginners",
    "Binary Search Step-by-Step",
    "Visualize Binary Search Algorithm",
    "DSA Binary Search",
    "Binary Search Explanation",
    "Binary Search Visualization Tool",
    "Efficient Searching Algorithms",
    "Binary Search in JavaScript",
    "Binary Search in C",
    "Binary Search in Python",
    "Binary Search in Java",
    "Binary Search Code Examples",
    "Binary Search Quiz",
    "Interactive Binary Search Quiz",
    "DSA Quiz",
    "Quiz for Binary Search",
    "Learn DSA with Quizzes",
    "Binary Search Practice",
    "Test Your Binary Search Skills",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/searching/binarySearch.png",
        width: 1200,
        height: 630,
        alt: "Binary Search Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Searching", "Binary Search")}
      title="Binary Search"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.binarySearch}
          description="Mark binary search as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[{ text: "Linear Search", url: "./linearsearch" }]}
        />
      }
    />
  );
}
