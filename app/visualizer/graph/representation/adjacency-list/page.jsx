import Animation from "./animation";
import GraphTopicPage from "@/app/visualizer/graph/components/GraphTopicPage";
import { graphTopics } from "@/app/visualizer/graph/data";

const topic = graphTopics.adjacencyList;

export const metadata = {
  title: "Adjacency List | AlgoBuddy Graph Visualizer",
  description: topic.description,
  robots: "index, follow",
};

export default function Page() {
  return <GraphTopicPage topic={topic} Animation={Animation} />;
}
