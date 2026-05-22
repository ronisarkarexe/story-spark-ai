import Animation from "@/app/visualizer/queue/types/circular/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/types/circular/content";
import Quiz from "@/app/visualizer/queue/types/circular/quiz";
import Code from "@/app/visualizer/queue/types/circular/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Circular Queue | Learn with JS, C, Python, Java Code",
  description:
    "Understand how Circular Queue works in Data Structures using animations and complete code examples in JavaScript, C, Python, and Java. Ideal for DSA beginners and interview preparation.",
  keywords: [
    "Circular Queue",
    "Circular Queue Visualizer",
    "Circular Queue DSA",
    "Circular Queue in JavaScript",
    "Circular Queue in C",
    "Circular Queue in Python",
    "Circular Queue in Java",
    "Queue Data Structure",
    "DSA Queue Operations",
    "Learn Circular Queue",
    "Circular Queue Code Examples",
    "DSA Visualizer",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/circularQueue.png",
        width: 1200,
        height: 630,
        alt: "Circular Queue Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Circular Queue")}
      title="Circular Queue"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.circularQueue}
          description="Mark Circular Queue as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Single Ended Queue", url: "./singleEnded" },
            { text: "Double Ended Queue", url: "./deque" },
            { text: "Multiple Queue", url: "./multiple" },
            { text: "Priority Queue", url: "./priority" },
          ]}
        />
      }
    />
  );
}
