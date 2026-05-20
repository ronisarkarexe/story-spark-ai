import Animation from "./animation";
import GraphTopicPage from "@/app/visualizer/graph/components/GraphTopicPage";
import { graphTopics } from "@/app/visualizer/graph/data";

const topic = graphTopics.dfs;

export const metadata = {
  title: "Depth-First Search | AlgoBuddy Graph Visualizer",
  description: topic.description,
  robots: "index, follow",
};

export default function Page() {
  return <GraphTopicPage topic={topic} Animation={Animation} />;
}
