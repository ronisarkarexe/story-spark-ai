import Animation from "@/app/visualizer/hashmap/insert/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/hashmap/insert/content";
import Quiz from "@/app/visualizer/hashmap/insert/quiz";
import Code from "@/app/visualizer/hashmap/insert/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "HashMap Insert Visualizer | Learn HashMap Operations",
  description: "Understand HashMap Insert operation through step-by-step animations with code examples in JavaScript, Python, Java, and C++.",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("HashMap", "Insert")}
      title="Insert (put)"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.hashmapInsert}
          description="Mark HashMap : Insert as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Search", url: "/visualizer/hashmap/search" },
            { text: "Delete", url: "/visualizer/hashmap/delete" },
          ]}
        />
      }
    />
  );
}