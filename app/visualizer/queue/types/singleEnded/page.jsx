import Animation from "@/app/visualizer/queue/types/singleEnded/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/types/singleEnded/content";
import Quiz from "@/app/visualizer/queue/types/singleEnded/quiz";
import Code from "@/app/visualizer/queue/types/singleEnded/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Single Ended Queue | Learn with JS, C, Python, Java Code",
  description:
    "Understand Single Ended Queue in Data Structures with animations and full code examples in JavaScript, C, Python, and Java. Ideal for beginners learning queue operations and preparing for interviews.",
  keywords: [
    "Single Ended Queue",
    "Single Ended Queue DSA",
    "Queue Data Structure",
    "Single Ended Queue in JavaScript",
    "Single Ended Queue in C",
    "Single Ended Queue in Python",
    "Single Ended Queue in Java",
    "DSA Queue Operations",
    "Learn Queue DSA",
    "Queue Code Examples",
    "DSA Visualizer",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/singleEnded.png",
        width: 1200,
        height: 630,
        alt: "Single Ended Queue Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Single Ended")}
      title="Single Ended"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.singleEnded}
          description="Mark Single Ended Queue as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Double Ended Queue", url: "./deque" },
            { text: "Circular Queue", url: "./circular" },
            { text: "Multiple Queue", url: "./multiple" },
            { text: "Priority Queue", url: "./priority" },
          ]}
        />
      }
    />
  );
}
