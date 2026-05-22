import Animation from "@/app/visualizer/queue/operations/enqueue-dequeue/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/operations/enqueue-dequeue/content";
import Quiz from "@/app/visualizer/queue/operations/enqueue-dequeue/quiz";
import Code from "@/app/visualizer/queue/operations/enqueue-dequeue/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Enqueue and Dequeue Operations in Queue | Learn Queue with JS, C, Python, Java Code",
  description:
    "Visualize and understand the Enqueue and Dequeue operations in a Queue with real-time animations and code examples in JavaScript, C, Python, and Java. Perfect for DSA beginners and interview preparation.",
  keywords: [
    "Enqueue Operation",
    "Dequeue Operation",
    "Queue Operations",
    "Queue DSA",
    "Queue Enqueue Dequeue",
    "Learn Queue",
    "Queue Visualization",
    "Interactive DSA Tools",
    "Queue Data Structure",
    "Queue Code Examples",
    "Enqueue Dequeue in JavaScript",
    "Enqueue Dequeue in C",
    "Enqueue Dequeue in Python",
    "Enqueue Dequeue in Java",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/enqueueDequeue.png",
        width: 1200,
        height: 630,
        alt: "Enqueue Dequeue Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Enqueue & Dequeue")}
      title="Enqueue & Dequeue"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.enqueueDequeue}
          description="Mark queue : enqueue & dequeue as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Other Operations"
          links={[
            { text: "Peek Front", url: "./peek-front" },
            { text: "Is Empty", url: "./isempty" },
            { text: "Is Full", url: "./isfull" },
          ]}
        />
      }
    />
  );
}
