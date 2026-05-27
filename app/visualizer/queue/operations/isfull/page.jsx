import Animation from "@/app/visualizer/queue/operations/isfull/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/operations/isfull/content";
import Quiz from "@/app/visualizer/queue/operations/isfull/quiz";
import Code from "@/app/visualizer/queue/operations/isfull/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Queue Is Full Operation | Learn with JS, C, Python, Java Code",
  description:
    "Understand how to check if a Queue is full using interactive visualizations and detailed code examples in JavaScript, C, Python, and Java. Perfect for mastering DSA and technical interviews.",
  keywords: [
    "Queue Is Full",
    "Is Full Operation Queue",
    "Queue Full Condition",
    "Queue Capacity Check",
    "Queue Code in JavaScript",
    "Queue Code in C",
    "Queue Code in Python",
    "Queue Code in Java",
    "Queue DSA",
    "Learn Queue Operations",
    "Queue Data Structure",
    "Visualize Queue",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/isFull.png",
        width: 1200,
        height: 630,
        alt: "isFull Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Is Full")}
      title="IsFull"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.queueIsFull}
          description="Mark queue : isFull as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Other Operations"
          links={[
            { text: "Peek Front", url: "./peek-front" },
            { text: "Enqueue & Dequeue", url: "./enqueue-dequeue" },
            { text: "Is Empty", url: "./isempty" },
          ]}
        />
      }
    />
  );
}
