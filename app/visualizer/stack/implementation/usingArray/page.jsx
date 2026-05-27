import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/implementation/usingArray/content";
import Code from "@/app/visualizer/stack/implementation/usingArray/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Stack Implementation using Array | Learn Stack in DSA with JS, C, Python, Java Code",
  description:
    "Understand how to implement a Stack using an Array with visual explanations, animations, and complete code examples in JavaScript, C, Python, and Java. Perfect for DSA beginners and interview prep.",
  keywords: [
    "Stack using Array",
    "Stack Implementation",
    "Stack Implementation in JavaScript",
    "Stack Implementation in C",
    "Stack Implementation in Python",
    "Stack Implementation in Java",
    "DSA Stack",
    "Array Stack",
    "Data Structures Stack",
    "Stack Push Pop Array",
    "Learn Stack DSA",
    "Visualize Stack Implementation",
    "Stack Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/stackArray.png",
        width: 1200,
        height: 630,
        alt: "Stack Implementation using Array",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Implementation Using Array")}
      title="Implementation Using Array"
      headerActions={<ArticleActions />}
      content={<Content />}
      code={<Code />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.stackArray}
          description="Mark Stack using Array as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Using Linked List", url: "./usingLinkedList" }]}
        />
      }
    />
  );
}
