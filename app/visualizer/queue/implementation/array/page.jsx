import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/implementation/array/content";
import Code from "@/app/visualizer/queue/implementation/array/codeblock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Queue Implementation Using Array | Visualize Queue Operations in JS, C, Python, Java",
  description:
    "Learn Queue implementation using arrays with real-time visualizations and code examples in JavaScript, C, Python, and Java. Understand how Enqueue and Dequeue work step-by-step without quizzes. Ideal for DSA beginners.",
  keywords: [
    "Queue Implementation",
    "Queue using Array",
    "Enqueue Dequeue Operations",
    "Queue Data Structure",
    "Queue Visualization",
    "DSA Queue Tutorial",
    "Queue in JavaScript",
    "Queue in C",
    "Queue in Python",
    "Queue in Java",
    "Learn Queue",
    "Interactive Queue Visualizer",
    "Array based Queue",
    "DSA for Beginners",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/queueArray.png",
        width: 1200,
        height: 630,
        alt: "Implementation of Queue using Array Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Using Array")}
      title="Using Array"
      headerActions={<ArticleActions />}
      content={<Content />}
      code={<Code />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.queueArray}
          description="Mark Queue implementation using Array as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Using Linked List", url: "./linkedList" }]}
        />
      }
    />
  );
}
