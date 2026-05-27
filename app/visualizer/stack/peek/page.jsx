import Animation from "@/app/visualizer/stack/peek/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/peek/content";
import Quiz from "@/app/visualizer/stack/peek/quiz";
import Code from "@/app/visualizer/stack/peek/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Stack Peek Visualizer | Understand Peek Operation in Stack with Code in JS, C, Python, Java",
  description:
    "Learn how the Peek operation works in a Stack using interactive animations and code examples in JavaScript, C, Python, and Java. Perfect for beginners and DSA interview preparation.",
  keywords: [
    "Stack Peek",
    "Peek Operation Stack",
    "Stack Top Element",
    "Peek in DSA",
    "DSA Stack Animation",
    "Learn Stack Operations",
    "Stack in JavaScript",
    "Stack in C",
    "Stack in Python",
    "Stack in Java",
    "Peek Operation Example",
    "Stack Code Examples",
    "Top of Stack",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/peek.png",
        width: 1200,
        height: 630,
        alt: "Stack Peek Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Peek")}
      title="Peek Operation"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.peek}
          description="Mark Stack : Peek as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Push & Pop", url: "/visualizer/stack/push-pop" },
            { text: "Is Empty", url: "/visualizer/stack/isempty" },
            { text: "Is Full", url: "/visualizer/stack/isfull" },
          ]}
        />
      }
    />
  );
}
