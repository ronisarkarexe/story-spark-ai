import Animation from "@/app/visualizer/stack/push-pop/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/push-pop/content";
import Quiz from "@/app/visualizer/stack/push-pop/quiz";
import Code from "@/app/visualizer/stack/push-pop/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Stack Push & Pop Visualizer & Quiz | Learn Stack Operations with Code in JS, C, Python, Java",
  description:
    "Understand Stack Push and Pop operations through step-by-step animations and test your knowledge with an interactive quiz. Includes code examples in JavaScript, C, Python, and Java. Ideal for beginners and interview preparation to master stack-based data structures visually and through hands-on coding.",
  keywords: [
    "Stack Push Visualizer",
    "Stack Pop Visualizer",
    "Push and Pop Animation",
    "Stack Operations",
    "Stack Algorithm",
    "Stack Quiz",
    "Data Structure Visualization",
    "Learn Stack Push",
    "Learn Stack Pop",
    "Interactive Stack Tool",
    "Practice Stack Operations",
    "Test Stack Knowledge",
    "Stack in JavaScript",
    "Stack in C",
    "Stack in Python",
    "Stack in Java",
    "Stack Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/pushPop.png",
        width: 1200,
        height: 630,
        alt: "Stack Push and Pop Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Push & Pop")}
      title="Push & Pop"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.pushPop}
          description="Mark Stack : Push & Pop as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Peek", url: "/visualizer/stack/peek" },
            { text: "Is Empty", url: "/visualizer/stack/isempty" },
            { text: "Is Full", url: "/visualizer/stack/isfull" },
          ]}
        />
      }
    />
  );
}
