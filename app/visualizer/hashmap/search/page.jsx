import Animation from "@/app/visualizer/hashmap/search/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/hashmap/search/content";
import Quiz from "@/app/visualizer/hashmap/search/quiz";
import Code from "@/app/visualizer/hashmap/search/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export const metadata = {
  title: "HashMap Search Visualizer | Learn HashMap Operations",
  description: "Understand HashMap Search operation through step-by-step animations with code examples in JavaScript, Python, Java, and C.",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("HashMap", "Search")}
      title="Search (get)"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Insert", url: "/visualizer/hashmap/insert" },
            { text: "Delete", url: "/visualizer/hashmap/delete" },
          ]}
        />
      }
    />
  );
}