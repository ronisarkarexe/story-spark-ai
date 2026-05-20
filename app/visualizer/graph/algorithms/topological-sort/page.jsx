import Animation from "./animation";
import GraphTopicPage from "@/app/visualizer/graph/components/GraphTopicPage";
import { graphTopics } from "@/app/visualizer/graph/data";

const topic = graphTopics.topologicalSort;

export const metadata = {
  title: "Topological Sort | AlgoBuddy Graph Visualizer",
  description: topic.description,
  robots: "index, follow",
};

export default function Page() {
  return <GraphTopicPage topic={topic} Animation={Animation} />;
}
