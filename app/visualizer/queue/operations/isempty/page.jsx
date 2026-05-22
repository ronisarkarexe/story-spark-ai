import Animation from "@/app/visualizer/queue/operations/isempty/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/operations/isempty/content";
import Quiz from "@/app/visualizer/queue/operations/isempty/quiz";
import Code from "@/app/visualizer/queue/operations/isempty/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Queue Is Empty Operation | Learn with JS, C, Python, Java Code",
  description:
    "Learn how to check if a Queue is empty using interactive visualizations and complete code examples in JavaScript, C, Python, and Java. Ideal for DSA beginners and interview prep.",
  keywords: [
    "Queue Is Empty",
    "Is Empty Operation Queue",
    "Queue Empty Condition",
    "Queue Code in JavaScript",
    "Queue Code in C",
    "Queue Code in Python",
    "Queue Code in Java",
    "DSA Queue Check",
    "Queue Operations",
    "Visualize Queue",
    "Learn Queue DSA",
    "Queue Data Structure",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/isEmpty.png",
        width: 1200,
        height: 630,
        alt: "isEmpty Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Is Empty")}
      title="IsEmpty"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.queueIsEmpty}
          description="Mark queue : isEmpty as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Other Operations"
          links={[
            { text: "Peek Front", url: "./peek-front" },
            { text: "Enqueue & Dequeue", url: "./enqueue-dequeue" },
            { text: "Is Full", url: "./isfull" },
          ]}
        />
      }
    />
  );
}
