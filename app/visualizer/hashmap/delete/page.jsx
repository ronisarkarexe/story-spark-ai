import Animation from "@/app/visualizer/hashmap/delete/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/hashmap/delete/content";
import Quiz from "@/app/visualizer/hashmap/delete/quiz";
import Code from "@/app/visualizer/hashmap/delete/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "HashMap Delete Visualizer | Learn HashMap Operations",
  description: "Understand HashMap Delete operation through step-by-step animations with code examples in JavaScript, Python, Java, and C.",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("HashMap", "Delete")}
      title="Delete (remove)"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.hashmapDelete}
          description="Mark HashMap : Delete as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Insert", url: "/visualizer/hashmap/insert" },
            { text: "Search", url: "/visualizer/hashmap/search" },
          ]}
        />
      }
    />
  );
}