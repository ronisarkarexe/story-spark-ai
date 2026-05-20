import Animation from "./animation";
import GraphTopicPage from "@/app/visualizer/graph/components/GraphTopicPage";
import { graphTopics } from "@/app/visualizer/graph/data";

const topic = graphTopics.kruskal;

export const metadata = {
  title: "Kruskal's Algorithm | AlgoBuddy Graph Visualizer",
  description: topic.description,
  robots: "index, follow",
};

export default function Page() {
  return <GraphTopicPage topic={topic} Animation={Animation} />;
}
