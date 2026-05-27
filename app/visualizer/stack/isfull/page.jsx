import Animation from "@/app/visualizer/stack/isfull/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/isfull/content";
import Quiz from "@/app/visualizer/stack/isfull/quiz";
import Code from "@/app/visualizer/stack/isfull/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Stack Is Full Visualizer | Check Full Condition in Stack with Code in JS, C, Python, Java",
  description:
    "Understand how to check if a Stack is full using interactive animations and code examples in JavaScript, C, Python, and Java. A simple guide for beginners and DSA interview preparation.",
  keywords: [
    "Stack Is Full",
    "Is Full Operation Stack",
    "Stack Full Condition",
    "Stack Capacity Check",
    "DSA Stack Animation",
    "Learn Stack Operations",
    "Stack in JavaScript",
    "Stack in C",
    "Stack in Python",
    "Stack in Java",
    "Stack Code Examples",
    "Stack Overflow Condition",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/isFull.png",
        width: 1200,
        height: 630,
        alt: "Stack isFull Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Is Full")}
      title="IsFull Operation"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.isFull}
          description="Mark Stack : isFull as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Peek", url: "/visualizer/stack/peek" },
            { text: "Is Empty", url: "/visualizer/stack/isempty" },
            { text: "Push Pop", url: "/visualizer/stack/push-pop" },
          ]}
        />
      }
    />
  );
}
