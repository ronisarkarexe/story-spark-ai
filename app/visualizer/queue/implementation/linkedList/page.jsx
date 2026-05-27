import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/implementation/linkedList/content";
import Code from "@/app/visualizer/queue/implementation/linkedList/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Queue Implementation Using Linked List | Visualize Queue in JS, C, Python, Java",
  description:
    "Explore Queue implementation using Linked List with real-time visualizations and code examples in JavaScript, C, Python, and Java. Understand how Enqueue and Dequeue work in a dynamic memory structure. Perfect for DSA beginners and interview prep.",
  keywords: [
    "Queue Implementation",
    "Queue using Linked List",
    "Enqueue Dequeue Operations",
    "Queue Data Structure",
    "Linked List Queue",
    "Queue Visualization",
    "DSA Queue Tutorial",
    "Queue in JavaScript",
    "Queue in C",
    "Queue in Python",
    "Queue in Java",
    "Learn Queue",
    "Interactive DSA Tools",
    "DSA with Linked List",
    "DSA for Beginners",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/queueLinkedList.png",
        width: 1200,
        height: 630,
        alt: "Implementation of Queue using Linked List Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Using Linked List")}
      title="Using Linked List"
      headerActions={<ArticleActions />}
      content={<Content />}
      code={<Code />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.queueLinkedList}
          description="Mark Queue implementation using Linked List as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Using Array", url: "./array" }]}
        />
      }
    />
  );
}
